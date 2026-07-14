/**
 * Toast 轻提示
 *
 * 右上角堆叠显示，3 秒自动消失；同 kind 多条不重复创建，按队列逐条展示。
 */

const TOAST_DURATION = 3000;
const TOAST_GAP = 60;

function $(id) {
	return document.getElementById(id);
}

const queue = [];
let activeTimer = null;
let activeEl = null;

function flush() {
	if (activeEl || queue.length === 0) return;

	const { host, message, kind } = queue.shift();
	const el = document.createElement('div');
	el.className = `toast toast--${kind || 'info'}`;
	el.textContent = message;

	host.appendChild(el);
	activeEl = el;

	activeTimer = setTimeout(() => {
		el.classList.add('is-leaving');
		setTimeout(() => {
			el.remove();
			activeEl = null;
			flush();
		}, TOAST_GAP);
	}, TOAST_DURATION);
}

/**
 * @param {string} message
 * @param {"info"|"success"|"error"} kind
 */
export function toast(message, kind = 'info') {
	const host = $('toast-host');
	if (!host) return;
	queue.push({ host, message, kind });
	flush();
}
