/**
 * 固定提示词编辑器
 *
 * 在 #fixed-prompt-editor 中渲染：
 * ① 当前主题绑定的固定提示词名称与状态（默认 / 已覆盖）
 * ② 当前固定提示词内容的 textarea（可编辑；编辑后保存到 fixedPromptOverrides）
 * ③ 「恢复默认」按钮（仅在已覆盖时显示）
 *
 * 接口：
 *   initFixedPromptEditor(fixedPrompts, fixedOverrides, themes, activeThemeId, onChange)
 *     → { refresh(themeId) }
 *
 * @param {Object}   fixedPrompts     FIXED_PROMPTS 字典（{ id: { name, content, ... } }）
 * @param {Object}   fixedOverrides   持久化的 { [fixedId]: overrideString }
 * @param {Array}    themes           THEMES 数组（用来查 activeThemeId 对应的 fixedPromptId）
 * @param {string}   activeThemeId    当前主题 id
 * @param {Function} onChange         (kind, id, value) => void
 *                                    kind: 'edit'（目前只用这一种）
 *                                    id:   fixedPromptId
 *                                    value: 新覆盖内容（trim 后空串表示清除覆盖）
 *
 * 注：主题的 fixedPromptId 切换不在编辑器职责内——主题库是静态的，运行时不应让用户
 * 改主题绑定的固定提示词。本编辑器只允许编辑覆盖内容。
 */
export function initFixedPromptEditor(fixedPrompts, fixedOverrides, themes, activeThemeId, onChange) {
	const container = document.getElementById('fixed-prompt-editor');
	if (!container) return { refresh() {} };

	let currentThemeId = activeThemeId;
	let overridesRef = fixedOverrides || {};

	function getFixedPromptId(themeId) {
		const theme = themes.find((t) => t.id === themeId);
		return theme?.fixedPromptId || null;
	}

	function getCurrentContent(fixedId) {
		if (!fixedId) return '';
		const fp = fixedPrompts[fixedId];
		if (!fp) return '';
		const override = overridesRef[fixedId];
		return typeof override === 'string' && override.trim() ? override : fp.content || '';
	}

	function isOverridden(fixedId, fp) {
		const override = overridesRef[fixedId];
		if (typeof override !== 'string' || !override.trim()) return false;
		return override.trim() !== fp.content.trim();
	}

	function render() {
		const fixedId = getFixedPromptId(currentThemeId);
		const fp = fixedId ? fixedPrompts[fixedId] : null;

		container.innerHTML = '';

		if (!fp) {
			const note = document.createElement('p');
			note.className = 'muted hint';
			note.textContent = '当前主题未绑定固定提示词。';
			container.appendChild(note);
			return;
		}

		// 头部：当前固定提示词名称 + 默认/覆盖状态
		const head = document.createElement('div');
		head.className = 'editor__label';
		const overridden = isOverridden(fixedId, fp);
		head.textContent = `固定提示词：${fp.name}${overridden ? '（已覆盖默认）' : ''}`;
		container.appendChild(head);

		if (fp.description) {
			const desc = document.createElement('p');
			desc.className = 'muted hint';
			desc.textContent = fp.description;
			container.appendChild(desc);
		}

		// 编辑 textarea
		const ta = document.createElement('textarea');
		ta.className = 'editor__textarea';
		ta.rows = 8;
		ta.placeholder = '编辑当前固定提示词内容（清空恢复默认）';
		ta.value = getCurrentContent(fixedId);
		ta.addEventListener('change', () => {
			const finalValue = ta.value;
			if (typeof onChange === 'function') onChange('edit', fixedId, finalValue);
		});
		container.appendChild(ta);

		// 恢复默认按钮（仅在已覆盖时显示）
		if (overridden) {
			const reset = document.createElement('button');
			reset.type = 'button';
			reset.className = 'btn btn--ghost';
			reset.textContent = '恢复默认';
			reset.addEventListener('click', () => {
				ta.value = fp.content;
				if (typeof onChange === 'function') onChange('edit', fixedId, '');
			});
			container.appendChild(reset);
		}
	}

	return {
		refresh(themeId) {
			if (themeId) currentThemeId = themeId;
			render();
		},
		// 外部（app.js）保存覆盖后调用，重渲染「已覆盖」标签
		setOverrides(nextOverrides) {
			overridesRef = nextOverrides || {};
			render();
		},
	};
}
