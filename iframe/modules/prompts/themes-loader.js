/**
 * 主题加载器
 *
 * - 优先使用本地缓存（pdg:themes:v1）
 * - 否则 fetch /iframe/themes.json
 * - 失败时回退到内联最小主题列表，保证 UI 始终可用
 */
import { loadThemeCache, saveThemeCache } from '../services/storage.js';

const FALLBACK_THEMES = [
	{
		id: 'general',
		name: '通用排版',
		description: '结构清晰、语气平实',
		prompt: '请对以下项目描述进行专业排版。要求使用恰当的标题层级（## 起），合理分段，关键术语加粗，必要时使用列表。仅输出排版后的 Markdown 正文。',
	},
	{
		id: 'github',
		name: 'GitHub README',
		description: '仓库首页风格',
		prompt: '请将以下内容改写为 GitHub README。结构：项目标题、一句话简介、功能特性（- 列表）、技术栈、快速开始、使用示例、许可证。开头放一个 emoji。',
	},
];

function isValidThemes(data) {
	return (
		data &&
		Array.isArray(data.themes) &&
		data.themes.length > 0 &&
		data.themes.every((t) => typeof t.id === 'string' && typeof t.name === 'string' && typeof t.prompt === 'string')
	);
}

export async function loadThemes() {
	// 1) 尝试本地缓存
	const cached = loadThemeCache();
	if (isValidThemes(cached)) {
		return cached.themes;
	}

	// 2) 尝试 fetch /iframe/themes.json
	try {
		const res = await fetch('/iframe/themes.json', { cache: 'no-store' });
		if (res.ok) {
			const data = await res.json();
			if (isValidThemes(data)) {
				saveThemeCache(data.themes);
				return data.themes;
			}
		}
	} catch (e) {
		console.warn('[pdg] loadThemes fetch failed:', e);
	}

	// 3) 回退到内联最小列表
	console.warn('[pdg] using fallback themes');
	return FALLBACK_THEMES;
}
