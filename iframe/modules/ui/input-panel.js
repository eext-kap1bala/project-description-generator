/**
 * 输入面板交互
 *
 * - 实时更新字数统计（中英文都算 1 字）
 * - Ctrl/Cmd + Enter 触发 onSubmit
 */

function $(id) {
	return document.getElementById(id);
}

/**
 * @param {string} textareaId
 * @param {string} charCountId
 * @param {Object} options
 * @param {Function} options.onSubmit  按下 Ctrl/Cmd+Enter 时调用
 * @returns {{ getValue, setValue, focus }}
 */
export function initInputPanel(textareaId, charCountId, { onSubmit } = {}) {
	const ta = $(textareaId);
	const counter = $(charCountId);

	function updateCount() {
		const v = ta.value || '';
		// 简单按字符数统计（trim 后）
		const n = v.trim().length;
		counter.textContent = `${n.toLocaleString()} 字`;
	}

	ta.addEventListener('input', updateCount);
	updateCount();

	ta.addEventListener('keydown', (e) => {
		if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
			e.preventDefault();
			if (typeof onSubmit === 'function') onSubmit();
		}
	});

	return {
		getValue: () => ta.value,
		setValue: (v) => {
			ta.value = v;
			updateCount();
		},
		focus: () => ta.focus(),
	};
}
