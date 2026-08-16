/**
 * 默认配置
 *
 * 在用户首次打开扩展时填充输入框的内容。
 * 所有默认值都是可改的。
 */

export const STORAGE_KEY = 'pdg:config:v1';

export const DEFAULTS = Object.freeze({
	baseUrl: 'https://api.deepseek.com',
	apiKey: '',
	model: 'deepseek-v4-pro', // 与 PROVIDERS['deepseek'].defaultModel 对齐
	lastThemeId: 'general',
	fixedPromptOverrides: {}, // { [fixedPromptId]: string }
	lastProviderId: 'deepseek', // 当前选中的 API 服务商预设 id
});

/**
 * 把用户持久化的配置与默认值合并，未填字段用默认填充。
 */
export function mergeWithDefaults(stored) {
	if (!stored || typeof stored !== 'object') return { ...DEFAULTS };

	// fixedPromptOverrides：必须是 plain object，过滤非字符串值
	let fixedPromptOverrides = {};
	if (stored.fixedPromptOverrides && typeof stored.fixedPromptOverrides === 'object' && !Array.isArray(stored.fixedPromptOverrides)) {
		for (const [id, text] of Object.entries(stored.fixedPromptOverrides)) {
			if (typeof id === 'string' && typeof text === 'string') {
				fixedPromptOverrides[id] = text;
			}
		}
	}

	return {
		baseUrl: typeof stored.baseUrl === 'string' ? stored.baseUrl : DEFAULTS.baseUrl,
		apiKey: typeof stored.apiKey === 'string' ? stored.apiKey : DEFAULTS.apiKey,
		model: typeof stored.model === 'string' ? stored.model : DEFAULTS.model,
		lastThemeId: typeof stored.lastThemeId === 'string' ? stored.lastThemeId : DEFAULTS.lastThemeId,
		fixedPromptOverrides,
		lastProviderId: typeof stored.lastProviderId === 'string' ? stored.lastProviderId : DEFAULTS.lastProviderId,
	};
}
