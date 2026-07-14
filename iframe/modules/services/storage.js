/**
 * localStorage 封装
 *
 * - 所有错误静默回退到默认配置 / 默认主题
 * - 使用 JSON 序列化
 * - 与 config/defaults.js 中的 key 常量对齐
 */
import { STORAGE_KEY, THEME_CACHE_KEY, mergeWithDefaults } from '../config/defaults.js';

function safeParse(json, fallback) {
	try {
		return JSON.parse(json);
	} catch (e) {
		console.warn('[pdg] storage parse failed:', e);
		return fallback;
	}
}

/**
 * 读取已保存的配置，未保存则返回默认。
 */
export function loadConfig() {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		return mergeWithDefaults(safeParse(raw, null));
	} catch (e) {
		console.warn('[pdg] loadConfig failed:', e);
		return mergeWithDefaults(null);
	}
}

/**
 * 保存配置（部分字段），返回合并后的完整配置。
 */
export function saveConfig(patch) {
	const merged = { ...loadConfig(), ...patch };
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
	} catch (e) {
		console.warn('[pdg] saveConfig failed:', e);
	}
	return merged;
}

/**
 * 缓存主题 JSON，避免每次打开都重新 fetch 解析。
 */
export function loadThemeCache() {
	try {
		const raw = localStorage.getItem(THEME_CACHE_KEY);
		return safeParse(raw, null);
	} catch (e) {
		return null;
	}
}

export function saveThemeCache(themes) {
	try {
		localStorage.setItem(THEME_CACHE_KEY, JSON.stringify(themes));
	} catch (e) {
		console.warn('[pdg] saveThemeCache failed:', e);
	}
}
