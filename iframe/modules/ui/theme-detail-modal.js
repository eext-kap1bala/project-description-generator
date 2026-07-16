/**
 * 主题详情 / 编辑模态框
 *
 * 渲染逻辑：
 *   - 遮罩 + 居中面板
 *   - 标题（主题名）+ 关闭按钮（×）
 *   - description 段（只读）
 *   - 「主题提示词」section（只读 pre）
 *   - 「固定提示词」section：
 *       标题 + 已覆盖徽章 + 可编辑 textarea + 恢复默认按钮
 *
 * 关闭：点遮罩 / Esc / × 按钮
 * 副作用：打开时给 body 加 .is-modal-open（scroll lock）；关闭时移除
 *
 * 单例：openThemeDetail 在内部先 closeThemeDetail，再创建新实例。
 */

const CLOSE_ICON_SVG = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
	<line x1="18" y1="6" x2="6" y2="18"/>
	<line x1="6" y1="6" x2="18" y2="18"/>
</svg>`;

const LOCK_ICON_SVG = `<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
	<rect x="4" y="11" width="16" height="10" rx="2"/>
	<path d="M8 11V7a4 4 0 0 1 8 0v4"/>
</svg>`;

const FADE_OUT_MS = 200;

let currentModal = null;
let escListener = null;

function lockBody() {
	document.body.classList.add('is-modal-open');
}

function unlockBody() {
	document.body.classList.remove('is-modal-open');
}

/**
 * @param {Object} theme                          THEMES 中的主题对象
 * @param {Object} [opts]
 * @param {Object} [opts.fixedPrompt]             { id, name, content, overridden }
 * @param {Function} [opts.onFixedPromptChange]   (fixedId, newContent) => boolean
 *                                                返回 true 表示「已覆盖」（即应显示徽章 + 恢复按钮）
 */
export function openThemeDetail(theme, opts = {}) {
	closeThemeDetail(); // 单例：替换前先关闭旧的（本次会立即重建，不 unlock body）

	const host = document.getElementById('theme-detail-modal');
	if (!host || !theme) return;

	const { fixedPrompt = null, onFixedPromptChange = null } = opts;

	const backdrop = document.createElement('div');
	backdrop.className = 'modal__backdrop';

	const panel = document.createElement('div');
	panel.className = 'modal__panel';
	panel.setAttribute('role', 'dialog');
	panel.setAttribute('aria-modal', 'true');
	panel.setAttribute('aria-label', theme.name);

	// header
	const header = document.createElement('div');
	header.className = 'modal__header';
	const title = document.createElement('h2');
	title.className = 'modal__title';
	title.textContent = theme.name;
	const closeBtn = document.createElement('button');
	closeBtn.type = 'button';
	closeBtn.className = 'modal__close';
	closeBtn.setAttribute('aria-label', '关闭');
	closeBtn.innerHTML = CLOSE_ICON_SVG;
	header.appendChild(title);
	header.appendChild(closeBtn);

	// body
	const body = document.createElement('div');
	body.className = 'modal__body';

	// description
	if (theme.description) {
		const desc = document.createElement('p');
		desc.className = 'modal__desc';
		desc.textContent = theme.description;
		body.appendChild(desc);
	}

	// 主题提示词（只读）
	if (theme.prompt) {
		body.appendChild(makeReadonlySection('主题提示词', theme.prompt));
	}

	// 固定提示词（可编辑）
	if (fixedPrompt && fixedPrompt.content) {
		body.appendChild(
			makeEditableSection({
				label: `固定提示词：${fixedPrompt.name || ''}`,
				content: fixedPrompt.content,
				overridden: !!fixedPrompt.overridden,
				onChange: (newContent) => {
					if (typeof onFixedPromptChange === 'function') {
						return onFixedPromptChange(fixedPrompt.id, newContent);
					}
					return false;
				},
			}),
		);
	}

	panel.appendChild(header);
	panel.appendChild(body);
	backdrop.appendChild(panel);
	host.appendChild(backdrop);

	// 关闭逻辑
	const closeAll = () => closeThemeDetail();
	backdrop.addEventListener('click', (e) => {
		if (e.target === backdrop) closeAll();
	});
	closeBtn.addEventListener('click', closeAll);
	escListener = (e) => {
		if (e.key === 'Escape') closeAll();
	};
	document.addEventListener('keydown', escListener);

	currentModal = backdrop;
	lockBody();
	requestAnimationFrame(() => backdrop.classList.add('is-visible'));
}

function makeReadonlySection(label, text) {
	const section = document.createElement('div');
	section.className = 'modal__section modal__section--readonly';

	const head = document.createElement('div');
	head.className = 'modal__section-head';
	const lbl = document.createElement('span');
	lbl.className = 'modal__label';
	lbl.textContent = label;
	head.appendChild(lbl);

	const badge = document.createElement('span');
	badge.className = 'modal__readonly-badge';
	badge.innerHTML = `${LOCK_ICON_SVG}<span>只读</span>`;
	head.appendChild(badge);

	section.appendChild(head);

	const pre = document.createElement('pre');
	pre.className = 'modal__pre';
	pre.textContent = text;
	section.appendChild(pre);

	return section;
}

function makeEditableSection({ label, content, overridden, onChange }) {
	const section = document.createElement('div');
	section.className = 'modal__section';

	const head = document.createElement('div');
	head.className = 'modal__section-head';
	const lbl = document.createElement('span');
	lbl.className = 'modal__label';
	lbl.textContent = label;
	head.appendChild(lbl);

	const badge = document.createElement('span');
	badge.className = 'badge';
	badge.dataset.state = 'ok';
	badge.textContent = '已覆盖';
	badge.style.display = overridden ? '' : 'none';
	head.appendChild(badge);
	section.appendChild(head);

	const field = document.createElement('div');
	field.className = 'modal__field';

	const ta = document.createElement('textarea');
	ta.className = 'modal__textarea';
	ta.rows = 8;
	ta.placeholder = '编辑当前固定提示词内容（清空恢复默认）';
	ta.value = content;
	// 保存原始默认内容（用于"恢复默认"按钮恢复 textarea 的内容）
	const defaultContent = content;
	field.appendChild(ta);

	const reset = document.createElement('button');
	reset.type = 'button';
	reset.className = 'btn btn--ghost modal__reset';
	reset.textContent = '恢复默认';
	reset.style.display = overridden ? '' : 'none';
	reset.addEventListener('click', () => {
		// 还原到默认：清空 overrides[fixedId]
		const nowOverridden = onChange('');
		ta.value = defaultContent;
		badge.style.display = nowOverridden ? '' : 'none';
		reset.style.display = nowOverridden ? '' : 'none';
	});
	field.appendChild(reset);

	ta.addEventListener('change', () => {
		const nowOverridden = onChange(ta.value);
		badge.style.display = nowOverridden ? '' : 'none';
		reset.style.display = nowOverridden ? '' : 'none';
	});

	section.appendChild(field);
	return section;
}

export function closeThemeDetail() {
	if (escListener) {
		document.removeEventListener('keydown', escListener);
		escListener = null;
	}
	if (currentModal) {
		const el = currentModal;
		currentModal = null;
		el.classList.remove('is-visible');
		setTimeout(() => {
			el.remove();
		}, FADE_OUT_MS);
	}
	unlockBody();
}
