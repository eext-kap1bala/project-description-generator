/**
 * 主题 / 固定提示词加载器
 *
 * 直接从 ./themes-data.js 与 ./fixed-prompts-data.js 重新导出，
 * 不做 fetch / cache / fallback。保留 Promise 接口以兼容调用方。
 */
import { FIXED_PROMPTS } from './fixed-prompts-data.js';
import { THEMES } from './themes-data.js';

export { THEMES, FIXED_PROMPTS };

export function loadThemes() {
	return Promise.resolve(THEMES);
}

export function loadFixedPrompts() {
	return Promise.resolve(FIXED_PROMPTS);
}
