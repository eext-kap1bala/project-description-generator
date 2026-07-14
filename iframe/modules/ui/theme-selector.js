/**
 * 主题单选渲染器
 *
 * 在 #theme-bar 中渲染胶囊状单选按钮。
 * 每个 chip 是一个 <label> 包裹一个隐藏的 radio 输入，
 * 选中态由 CSS :has(input:checked) 控制，无需额外 JS class 切换。
 *
 * @param {HTMLElement} container  主题栏容器
 * @param {Array}       themes     主题数组
 * @param {string}      activeId   当前选中主题 id
 * @param {Function}    onChange   选择变化回调 (newId) => void
 */

export function renderThemeSelector(container, themes, activeId, onChange) {
	if (!container) return;
	container.innerHTML = '';

	const validActiveId = themes.some((t) => t.id === activeId) ? activeId : themes[0]?.id;

	for (const theme of themes) {
		const label = document.createElement('label');
		label.className = 'theme-chip';
		label.title = theme.description || theme.name;

		const input = document.createElement('input');
		input.type = 'radio';
		input.name = 'pdg-theme';
		input.value = theme.id;
		input.checked = theme.id === validActiveId;
		input.setAttribute('aria-label', theme.name);

		const text = document.createElement('span');
		text.textContent = theme.name;

		label.appendChild(input);
		label.appendChild(text);

		input.addEventListener('change', () => {
			if (input.checked && typeof onChange === 'function') {
				onChange(theme.id);
			}
		});

		container.appendChild(label);
	}
}
