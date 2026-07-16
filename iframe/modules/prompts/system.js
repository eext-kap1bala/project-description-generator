/**
 * 系统提示词拼接
 *
 * 数据模型：
 * - FIXED_PROMPTS（独立库，prompts/fixed-prompts-data.js）：{id, name, content}
 * - THEMES 的每个主题通过 fixedPromptId 引用一个固定提示词
 * - 用户可在 UI 覆盖固定提示词内容（持久化到 fixedPromptOverrides）
 *
 * 拼接规则：fixedContent（默认或覆盖） + '\n\n---\n\n' + theme.prompt
 */

/**
 * 拼接最终 systemPrompt
 *
 * @param {Object} theme         THEMES 中的主题对象
 * @param {Object} fixedPrompts  FIXED_PROMPTS 字典（{ id: { name, content, ... } }）
 * @param {Object} [fixedOverrides]  持久化的用户覆盖 { [fixedId]: string }
 * @returns {string}
 */
export function buildSystemPrompt(theme, fixedPrompts, fixedOverrides = {}) {
	if (!theme) return '';

	let fixedContent = '';
	if (theme.fixedPromptId && fixedPrompts) {
		const fp = fixedPrompts[theme.fixedPromptId];
		const defaultContent = fp?.content || '';
		const override = fixedOverrides?.[theme.fixedPromptId];
		fixedContent = typeof override === 'string' && override.trim() ? override : defaultContent;
	}

	const chunks = [];
	if (fixedContent && fixedContent.trim()) {
		chunks.push(fixedContent.trim());
	}
	if (typeof theme.prompt === 'string' && theme.prompt.trim()) {
		chunks.push(theme.prompt.trim());
	}

	return chunks.join('\n\n---\n\n');
}
