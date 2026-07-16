/**
 * 主题卡片单选渲染器
 *
 * 在 #theme-bar 中渲染主题卡片。每张卡片显示：
 *   - 主题名称
 *   - 右上角眼镜 icon：点击弹出模态框显示完整提示词预览
 *
 * 选中态由 CSS :has(input:checked) 控制。
 *
 * @param {HTMLElement} container  主题栏容器
 * @param {Array}       themes     主题数组
 * @param {string}      activeId   当前选中主题 id
 * @param {Object}      options
 * @param {Function}    [options.onChange]      (newId) => void
 * @param {Function}    [options.onShowDetail]  (theme) => void
 */

const PEEK_ICON_SVG = `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
	<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/>
	<circle cx="12" cy="12" r="3"/>
</svg>`;

export function renderThemeSelector(container, themes, activeId, options = {}) {
	if (!container) return;
	const { onChange, onShowDetail } = options;

	container.innerHTML = '';

	const validActiveId = themes.some((t) => t.id === activeId) ? activeId : themes[0]?.id;

	for (const theme of themes) {
		const label = document.createElement('label');
		label.className = 'theme-card';

		const input = document.createElement('input');
		input.type = 'radio';
		input.name = 'pdg-theme';
		input.value = theme.id;
		input.checked = theme.id === validActiveId;
		input.setAttribute('aria-label', theme.name);

		const name = document.createElement('span');
		name.className = 'theme-card__name';
		name.textContent = theme.name;

		// 眼镜 icon 按钮（绝对定位，卡片右上角）
		const peek = document.createElement('button');
		peek.type = 'button';
		peek.className = 'theme-card__peek';
		peek.setAttribute('aria-label', `查看「${theme.name}」提示词详情`);
		peek.title = '查看提示词详情';
		peek.innerHTML = PEEK_ICON_SVG;
		peek.addEventListener('click', (e) => {
			// 阻止冒泡，避免触发 label 关联的 radio 选中
			e.preventDefault();
			e.stopPropagation();
			if (typeof onShowDetail === 'function') onShowDetail(theme);
		});

		label.appendChild(input);
		label.appendChild(name);

		if (theme.description) {
			const desc = document.createElement('span');
			desc.className = 'theme-card__desc';
			desc.textContent = theme.description;
			label.appendChild(desc);
		}

		label.appendChild(peek);

		input.addEventListener('change', () => {
			if (input.checked && typeof onChange === 'function') {
				onChange(theme.id);
			}
		});

		container.appendChild(label);
	}
}
