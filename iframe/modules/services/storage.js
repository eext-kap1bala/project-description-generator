/**
 * localStorage 封装
 *
 * - 仅负责 pdg:config:v1（LLM API 配置 + 上次主题 id）
 * - 主题已硬编码进 bundle（见 prompts/themes-data.js），不再需要缓存层
 * - 所有错误静默回退到默认配置
 * - 使用 JSON 序列化
 */
import { STORAGE_KEY, mergeWithDefaults } from '../config/defaults.js';

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
