/**
 * 主题加载器
 *
 * 直接从 ./themes-data.js 重新导出 THEMES，不再做 fetch / cache / fallback。
 * 保留 loadThemes() 接口（Promise<Array>）以兼容现有调用方。
 */
import { THEMES } from './themes-data.js';

export { THEMES };

export function loadThemes() {
	return Promise.resolve(THEMES);
}
