/**
 * 配置面板交互
 *
 * 负责：
 * - 读取并填充 base URL / API Key / 模型 三个输入
 * - 服务商预设下拉（PROVIDERS）：切换时自动覆盖 baseUrl + 默认模型（API Key 不覆盖）
 * - 任意输入变化时调用 onConfigChange(patch) 同步保存
 * - "测试连接" 按钮调用 testConnection，更新状态徽章
 * - 更新 step header summary（未配置 / 已配置 / 模型名）
 */
import { testConnection } from '../services/llm/client.js';
import { toast } from './toast.js';

function $(id) {
	return document.getElementById(id);
}

/**
 * 初始化配置面板。
 *
 * @param {Object}   config           当前配置（含 baseUrl/apiKey/model/lastProviderId）
 * @param {Array}    providers        PROVIDERS 数组
 * @param {Function} onConfigChange   任意配置字段变化时调用，参数 patch
 * @returns {Object}                  { setStatus, refresh, getConfig, setProvider }
 */
export function initConfigPanel(config, providers, onConfigChange) {
	const baseEl = $('cfg-base');
	const keyEl = $('cfg-key');
	const modelEl = $('cfg-model');
	const providerEl = $('cfg-provider');
	const testBtn = $('btn-test');
	const statusEl = $('cfg-status');
	const summaryEl = $('cfg-summary');

	// 初始化 provider 下拉
	if (providerEl && Array.isArray(providers)) {
		providerEl.innerHTML = '';
		for (const p of providers) {
			const opt = document.createElement('option');
			opt.value = p.id;
			opt.textContent = p.name;
			providerEl.appendChild(opt);
		}
		const validIds = providers.map((p) => p.id);
		providerEl.value = validIds.includes(config.lastProviderId) ? config.lastProviderId : 'custom';
	}

	// 初始填充输入
	baseEl.value = config.baseUrl || '';
	keyEl.value = config.apiKey || '';
	modelEl.value = config.model || '';
	refreshSummary();

	function refreshSummary() {
		if (!summaryEl) return;
		if (!config.baseUrl || !config.model) {
			summaryEl.textContent = '未配置';
			return;
		}
		summaryEl.textContent = config.apiKey ? `已配置 · ${config.model}` : '未配置';
	}

	function setStatus(state, text) {
		if (!statusEl) return;
		statusEl.dataset.state = state;
		statusEl.textContent = text;
	}

	function emit(patch) {
		Object.assign(config, patch);
		refreshSummary();
		if (typeof onConfigChange === 'function') {
			onConfigChange(patch);
		}
	}

	// 字段失焦时同步
	for (const [el, key] of [
		[baseEl, 'baseUrl'],
		[keyEl, 'apiKey'],
		[modelEl, 'model'],
	]) {
		el.addEventListener('change', () => emit({ [key]: el.value.trim() }));
		el.addEventListener('blur', () => emit({ [key]: el.value.trim() }));
	}

	// provider 切换：覆盖 baseUrl + model（API Key 永远不动）
	if (providerEl) {
		providerEl.addEventListener('change', () => {
			const id = providerEl.value;
			const p = providers.find((x) => x.id === id);
			if (p) {
				baseEl.value = p.baseUrl;
				modelEl.value = p.defaultModel;
			}
			emit({
				lastProviderId: id,
				baseUrl: baseEl.value,
				model: modelEl.value,
			});
		});
	}

	// 测试连接
	testBtn.addEventListener('click', async () => {
		const cfg = {
			baseUrl: baseEl.value.trim(),
			apiKey: keyEl.value.trim(),
			model: modelEl.value.trim(),
		};
		if (!cfg.baseUrl || !cfg.apiKey || !cfg.model) {
			toast('请先填写完整的 API 设置', 'error');
			setStatus('fail', '未测试');
			return;
		}
		testBtn.disabled = true;
		setStatus('testing', '测试中…');
		try {
			const { latencyMs } = await testConnection(cfg);
			setStatus('ok', `已连接 · ${latencyMs}ms`);
			toast('连接成功', 'success');
		} catch (e) {
			setStatus('fail', '连接失败');
			toast(`连接失败：${e.message || e}`, 'error');
		} finally {
			testBtn.disabled = false;
		}
	});

	return {
		setStatus,
		refresh: refreshSummary,
		getConfig: () => ({
			baseUrl: baseEl.value.trim(),
			apiKey: keyEl.value.trim(),
			model: modelEl.value.trim(),
		}),
		setProvider(providerId) {
			if (providerEl && providers.some((p) => p.id === providerId)) {
				providerEl.value = providerId;
			}
		},
	};
}
