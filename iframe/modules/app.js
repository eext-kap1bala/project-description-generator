/**
 * 应用入口
 *
 * 启动顺序：
 *   1. 加载持久化配置
 *   2. 加载主题 + 固定提示词
 *   3. 渲染主题胶囊单选
 *   4. 初始化固定提示词编辑器
 *   5. 初始化配置面板
 *   6. 初始化输入面板（绑定字数统计）
 *   7. 初始化输出面板（绑定"复制"）
 *   8. 绑定"生成"主按钮：拼接提示词 → 调用 LLM → 渲染结果（生成中按钮切换为"停止"）
 */
// 注意：这里使用相对路径 import —— esbuild 在打包时会把所有模块合并到
// iframe/dist/bundle.js（IIFE 格式），最终以普通 <script> 加载，所以运行时
// 不会触发浏览器 ES Module 解析（EasyEDA iframe 协议下解析会失败）。
import { buildSystemPrompt } from './prompts/system.js';
import { loadFixedPrompts, loadThemes } from './prompts/themes-loader.js';
import { generate } from './services/llm/client.js';
import { PROVIDERS } from './services/providers-data.js';
import { loadConfig, saveConfig } from './services/storage.js';
import { initConfigPanel } from './ui/config-panel.js';
import { initInputPanel } from './ui/input-panel.js';
import { initOutputPanel } from './ui/output-panel.js';
import { openThemeDetail } from './ui/theme-detail-modal.js';
import { renderThemeSelector } from './ui/theme-selector.js';
import { toast } from './ui/toast.js';

function $(id) {
	return document.getElementById(id);
}

(async function main() {
	// 1) 配置
	const config = loadConfig();

	// 2) 主题 + 固定提示词
	let themes = [];
	let fixedPrompts = {};
	try {
		themes = await loadThemes();
	} catch (e) {
		console.warn('[pdg] loadThemes fatal:', e);
		themes = [];
	}
	try {
		const arr = await loadFixedPrompts();
		fixedPrompts = Object.fromEntries(arr.map((fp) => [fp.id, fp]));
	} catch (e) {
		console.warn('[pdg] loadFixedPrompts fatal:', e);
		fixedPrompts = {};
	}

	if (!themes.length) {
		toast('未加载到任何主题', 'error');
	}

	// 3) 主题单选
	let activeThemeId = themes.some((t) => t.id === config.lastThemeId) ? config.lastThemeId : themes[0]?.id;

	renderThemeSelector($('theme-bar'), themes, activeThemeId, {
		onChange: (id) => {
			activeThemeId = id;
			saveConfig({ lastThemeId: id });
		},
		onShowDetail: (theme) => {
			const fpEntry = fixedPrompts[theme.fixedPromptId];
			const override = config.fixedPromptOverrides?.[theme.fixedPromptId];
			const defaultContent = fpEntry?.content || '';
			const isOverridden = (val) => typeof val === 'string' && val.trim() && val.trim() !== defaultContent.trim();

			openThemeDetail(theme, {
				fixedPrompt: {
					id: theme.fixedPromptId,
					name: fpEntry?.name,
					content: isOverridden(override) ? override : defaultContent,
					overridden: isOverridden(override),
				},
				onFixedPromptChange: (fixedId, value) => {
					const next = { ...(config.fixedPromptOverrides || {}) };
					if (typeof value === 'string' && value.trim()) {
						const fp = fixedPrompts[fixedId];
						// 与默认内容完全一致 → 视为未覆盖，删除 key
						if (fp && value.trim() === fp.content.trim()) {
							delete next[fixedId];
						} else {
							next[fixedId] = value;
						}
					} else {
						delete next[fixedId];
					}
					config.fixedPromptOverrides = next;
					saveConfig({ fixedPromptOverrides: next });
					return isOverridden(next[fixedId]);
				},
			});
		},
	});

	// 5) 配置面板
	const configPanel = initConfigPanel(config, PROVIDERS, (patch) => {
		saveConfig(patch);
	});

	// 6) 输入面板
	const input = initInputPanel('user-input', 'char-count', {
		onSubmit: runGenerate,
	});

	// 7) 输出面板
	const output = initOutputPanel({
		preId: 'output',
		statusId: 'result-status',
		copyBtnId: 'btn-copy',
	});
	output.onCopy(() => toast('已复制', 'success'));

	// 闭包：当前请求的"在飞"状态与控制器（先声明，避免 click handler 内 TDZ 语义模糊）
	let isGenerating = false;
	let activeController = null;

	// 8) 主按钮：根据当前状态分发（生成 / 停止）
	const genBtn = $('btn-generate');
	genBtn.addEventListener('click', () => {
		if (isGenerating) {
			// 主动停止 —— 触发 AbortController，client.js 会把 AbortError 原样上抛
			if (activeController) activeController.abort();
			return;
		}
		runGenerate();
	});

	// 按钮态切换：'idle' → 「生成」红底；'stopping' → 「停止」黄底
	function setGenerateButtonMode(mode) {
		if (mode === 'stopping') {
			genBtn.textContent = '停止';
			genBtn.classList.remove('btn--primary');
			genBtn.classList.add('btn--yellow');
			genBtn.disabled = false; // 停止按钮必须可点
		} else {
			genBtn.textContent = '生成';
			genBtn.classList.remove('btn--yellow');
			genBtn.classList.add('btn--primary');
			genBtn.disabled = false;
		}
	}

	async function runGenerate() {
		// ★ 并发守卫：生成中再次触发（含 Ctrl/⌘+Enter）直接吞掉
		if (isGenerating) return;

		// 每次重新从输入框读取最新配置（用户在折叠面板里改过未提交也可能）
		const latest = configPanel.getConfig();
		if (!latest.baseUrl || !latest.apiKey || !latest.model) {
			toast('请先在「① 配置 API」中填写完整信息', 'error');
			const apiStep = document.querySelector('.step--api');
			if (apiStep) {
				apiStep.classList.add('is-attention');
				apiStep.scrollIntoView({ behavior: 'smooth', block: 'center' });
				setTimeout(() => apiStep.classList.remove('is-attention'), 1500);
			}
			return;
		}

		const userInput = input.getValue().trim();
		if (!userInput) {
			toast('请输入项目描述', 'error');
			input.focus();
			return;
		}

		const theme = themes.find((t) => t.id === activeThemeId);
		if (!theme) {
			toast('未选择有效主题', 'error');
			return;
		}

		const systemPrompt = buildSystemPrompt(theme, fixedPrompts, config.fixedPromptOverrides);

		const controller = new AbortController();
		activeController = controller;
		isGenerating = true;
		setGenerateButtonMode('stopping');
		output.setLoading();

		try {
			await generate(
				{
					baseUrl: latest.baseUrl,
					apiKey: latest.apiKey,
					model: latest.model,
					systemPrompt,
					userInput,
				},
				{
					onChunk: (chunk) => output.appendChunk(chunk),
					signal: controller.signal,
				},
			);
			output.finishStreaming();
			toast('生成成功', 'success');
		} catch (e) {
			// ★ 用户主动停止 —— client.js 在外部 signal aborted 时原样上抛 AbortError
			if (e?.name === 'AbortError' && activeController?.signal.aborted) {
				output.setStopped();
				toast('已停止', 'info');
			} else {
				const msg = e?.message || String(e);
				output.setError(msg);
				toast(`生成失败：${msg}`, 'error');
			}
		} finally {
			isGenerating = false;
			activeController = null;
			setGenerateButtonMode('idle');
		}
	}
})();
