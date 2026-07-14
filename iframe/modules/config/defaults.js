/**
 * 默认配置
 *
 * 在用户首次打开扩展时填充输入框的内容。
 * 所有默认值都是可改的；FIXED_SYSTEM_PROMPT 见 prompts/system.js。
 */

export const STORAGE_KEY = 'pdg:config:v1';

export const DEFAULTS = Object.freeze({
	baseUrl: 'https://api.openai.com/v1',
	apiKey: '',
	model: 'gpt-4o-mini',
	lastThemeId: 'general',
});

/**
 * 把用户持久化的配置与默认值合并，未填字段用默认填充。
 */
export function mergeWithDefaults(stored) {
	if (!stored || typeof stored !== 'object') return { ...DEFAULTS };
	return {
		baseUrl: typeof stored.baseUrl === 'string' ? stored.baseUrl : DEFAULTS.baseUrl,
		apiKey: typeof stored.apiKey === 'string' ? stored.apiKey : DEFAULTS.apiKey,
		model: typeof stored.model === 'string' ? stored.model : DEFAULTS.model,
		lastThemeId: typeof stored.lastThemeId === 'string' ? stored.lastThemeId : DEFAULTS.lastThemeId,
	};
}
