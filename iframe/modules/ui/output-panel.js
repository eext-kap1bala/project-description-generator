/**
 * 输出面板交互
 *
 * 纯文本展示 —— 不做任何 Markdown 渲染（XSS 风险归零）。
 * - <pre> 块保留换行 + 自动换行
 * - 等宽字体
 * - 状态：loading / done / error 三态
 * - "复制" 优先用 navigator.clipboard.writeText，
 *   旧环境下退化为文本选中
 */

function $(id) {
	return document.getElementById(id);
}

/**
 * @param {Object} refs  { preId, statusId, copyBtnId, regenBtnId }
 * @returns {{ setLoading, setResult, setError, onCopy, getLastText, setRegenHandler }}
 */
export function initOutputPanel({ preId, statusId, copyBtnId, regenBtnId }) {
	const pre = $(preId);
	const status = $(statusId);
	const copyBtn = $(copyBtnId);
	const regenBtn = $(regenBtnId);

	let lastText = '';
	let copyCb = null;

	function setLoading() {
		pre.textContent = '生成中…';
		pre.classList.add('is-loading');
		pre.classList.remove('is-error');
		status.textContent = '生成中';
		copyBtn.disabled = true;
		regenBtn.disabled = true;
	}

	function setResult(text) {
		lastText = text || '';
		pre.textContent = lastText;
		pre.classList.remove('is-loading', 'is-error');
		status.textContent = `完成 · ${lastText.length.toLocaleString()} 字`;
		copyBtn.disabled = !lastText;
		regenBtn.disabled = false;
	}

	function setError(msg) {
		pre.textContent = `× ${msg}`;
		pre.classList.add('is-error');
		pre.classList.remove('is-loading');
		status.textContent = '失败';
		copyBtn.disabled = true;
		regenBtn.disabled = false;
	}

	copyBtn.addEventListener('click', async () => {
		if (!lastText) return;
		try {
			if (navigator.clipboard?.writeText) {
				await navigator.clipboard.writeText(lastText);
			} else {
				throw new Error('no clipboard api');
			}
		} catch {
			// fallback: 选中文本
			try {
				const range = document.createRange();
				range.selectNodeContents(pre);
				const sel = getSelection();
				sel.removeAllRanges();
				sel.addRange(range);
			} catch (_) {
				// swallow
			}
		}
		if (copyCb) copyCb();
	});

	function onCopy(cb) {
		copyCb = cb;
	}

	function setRegenHandler(fn) {
		regenBtn.addEventListener('click', fn);
	}

	return { setLoading, setResult, setError, onCopy, setRegenHandler, getLastText: () => lastText };
}
