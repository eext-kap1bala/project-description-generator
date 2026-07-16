/**
 * 应用入口
 *
 * 启动顺序：
 *   1. 加载持久化配置
 *   2. 加载主题（缓存 → fetch → fallback）
 *   3. 渲染主题胶囊单选
 *   4. 初始化配置面板
 *   5. 初始化输入面板（绑定字数统计）
 *   6. 初始化输出面板（绑定"复制""重新生成"）
 *   7. 绑定"生成"主按钮：拼接提示词 → 调用 LLM → 渲染结果
 */
// 注意：这里使用相对路径 import —— esbuild 在打包时会把所有模块合并到
// iframe/dist/bundle.js（IIFE 格式），最终以普通 <script> 加载，所以运行时
// 不会触发浏览器 ES Module 解析（EasyEDA iframe 协议下解析会失败）。
import { FIXED_SYSTEM_PROMPT } from './prompts/system.js';
import { loadThemes } from './prompts/themes-loader.js';
import { generate } from './services/llm/client.js';
import { loadConfig, saveConfig } from './services/storage.js';
import { initConfigPanel } from './ui/config-panel.js';
import { initInputPanel } from './ui/input-panel.js';
import { initOutputPanel } from './ui/output-panel.js';
import { renderThemeSelector } from './ui/theme-selector.js';
import { toast } from './ui/toast.js';

function $(id) {
	return document.getElementById(id);
}

(async function main() {
	// 1) 配置
	const config = loadConfig();

	// 2) 主题
	let themes = [];
	try {
		themes = await loadThemes();
	} catch (e) {
		console.warn('[pdg] loadThemes fatal:', e);
		themes = [];
	}

	if (!themes.length) {
		toast('未加载到任何主题', 'error');
	}

	// 3) 主题单选
	let activeThemeId = themes.some((t) => t.id === config.lastThemeId) ? config.lastThemeId : themes[0]?.id;

	renderThemeSelector($('theme-bar'), themes, activeThemeId, (id) => {
		activeThemeId = id;
		saveConfig({ lastThemeId: id });
	});

	// 4) 配置面板
	const configPanel = initConfigPanel(config, (patch) => {
		saveConfig(patch);
	});

	// 5) 输入面板
	const input = initInputPanel('user-input', 'char-count', {
		onSubmit: runGenerate,
	});

	// 6) 输出面板
	const output = initOutputPanel({
		preId: 'output',
		statusId: 'result-status',
		copyBtnId: 'btn-copy',
		regenBtnId: 'btn-regenerate',
	});
	output.onCopy(() => toast('已复制', 'success'));
	output.setRegenHandler(runGenerate);

	// 7) 主按钮
	$('btn-generate').addEventListener('click', runGenerate);

	async function runGenerate() {
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

		const systemPrompt = `${FIXED_SYSTEM_PROMPT}\n\n---\n\n${theme.prompt}`;

		output.setLoading();
		$('btn-generate').disabled = true;
		try {
			const text = await generate({
				baseUrl: latest.baseUrl,
				apiKey: latest.apiKey,
				model: latest.model,
				systemPrompt,
				userInput,
			});
			output.setResult(text);
			toast('生成成功', 'success');
		} catch (e) {
			const msg = e?.message || String(e);
			output.setError(msg);
			toast(`生成失败：${msg}`, 'error');
		} finally {
			$('btn-generate').disabled = false;
		}
	}
})();
