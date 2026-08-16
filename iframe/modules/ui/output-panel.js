/**
 * 输出面板交互
 *
 * 流式展示 —— 不做任何 Markdown 渲染（XSS 风险归零）。
 * - 容器为 <div>，内含两类子节点：
 *     <span class="output__text">    普通 OUT 段（流式累加 / 复制源）
 *     <div class="output__think">    think 折叠块（不进入复制源）
 * - 等宽字体 + white-space: pre-wrap 由 .output 类承载
 * - 状态：loading / streaming / done / error 四态
 * - "复制" 优先用 navigator.clipboard.writeText，
 *   旧环境下退化为文本选中
 *
 * 关键不变量：lastText（复制源）只追加 OUT 状态的纯文本，
 * think 段与 <think> / </think> 标签本身完全不入 lastText。
 */

function $(id) {
	return document.getElementById(id);
}

const THINK_OPEN = '<think';
const THINK_CLOSE = '</think>';
const THINK_OPEN_LEN = THINK_OPEN.length; // 6
const THINK_CLOSE_LEN = THINK_CLOSE.length; // 7

// ========== 最外层代码围栏剥离 ==========
// LLM 有时会把整段输出用 markdown 代码围栏包起来（开头 ```lang，结尾一行 ```）。
// 这些围栏本身不是正文，需在 OUT 文本流中剥离，避免污染显示与复制源。
const FENCE_HEAD_MAX = 32; // ```+语言标签+空白+\n 的安全上界，防缓冲无限增长
const FENCE_HEAD_LANG_OK = /^`{3}([ \t]*|[a-zA-Z0-9_+\-.]+)$/; // ``` 或 ```html 或 ```c++
// 尾部收尾围栏「挂起」模式：行首/换行后 1~3 个反引号（半截或完整），可带尾随空白/换行。
// 挂起 1~2 个反引号是为兼容收尾 ``` 被拆成多片（如 "``"+"`"）的流式场景；
// 前导 \n 可选，因为正文结尾的换行可能已在上一片输出。
const FENCE_TAIL_HOLD_RE = /(?:^|\n)`{1,3}[ \t]*\n?$/;

/**
 * 格式化思考耗时（毫秒 → 文本）。
 *  - < 60s：保留 1 位小数，如 "3.2s"
 *  - >= 60s：分 + 秒（秒取整），如 "1m 23s"
 */
function formatThinkDuration(ms) {
	const totalSec = ms / 1000;
	if (totalSec < 60) {
		return `${totalSec.toFixed(1)}s`;
	}
	const m = Math.floor(totalSec / 60);
	const s = Math.floor(totalSec % 60);
	return `${m}m ${s}s`;
}

/**
 * 压缩单个 HTML 标签内的空白（保留 < 和 >，去掉紧贴它们的空白，中部连续空白压成单空格）。
 * - 引号字符串（单/双）内的空白原样保留，避免破坏 class="nav primary" 这类场景
 * - 处理空白字符：\s = 空格 / 制表符 / 换行 / 回车
 *
 * 例：'<p style="color:\n   red;  font-size: 14px">'  →  '<p style="color: red; font-size: 14px">'
 *     '< p   style="red">'                                →  '<p style="red">'
 */
function normalizeTagWhitespace(tagContent) {
	const inner = tagContent.slice(1, -1);
	let out = '';
	let inStr = false;
	let strCh = '';
	for (let i = 0; i < inner.length; i++) {
		const ch = inner[i];
		if (inStr) {
			out += ch;
			if (ch === strCh) inStr = false;
		} else if (ch === '"' || ch === "'") {
			inStr = true;
			strCh = ch;
			out += ch;
		} else if (/\s/.test(ch)) {
			if (out.length > 0 && !out.endsWith(' ')) out += ' ';
		} else {
			out += ch;
		}
	}
	// 去掉末尾可能残留的空格（> 紧贴之前不应有空格）
	while (out.endsWith(' ')) out = out.slice(0, -1);
	return '<' + out + '>';
}

/**
 * @param {Object} refs  { preId, statusId, copyBtnId }
 * @returns {{
 *   setLoading: () => void,
 *   appendChunk: (chunk: string) => void,
 *   finishStreaming: () => void,
 *   setStopped: () => void,
 *   setResult: (text: string) => void,
 *   setError: (msg: string) => void,
 *   onCopy: (cb: () => void) => void,
 *   getLastText: () => string
 * }}
 */
export function initOutputPanel({ preId, statusId, copyBtnId }) {
	const container = $(preId); // 注意：HTML 上 id="output"，是 <div>
	const status = $(statusId);
	const copyBtn = $(copyBtnId);

	// ========== 状态机 / 渲染 ==========
	let lastText = ''; // ★ 复制源（已剔除 think）
	let copyCb = null;
	let streaming = false; // 流式进行中

	// 状态机状态
	let state = 'OUT'; // 'OUT' | 'IN_THINK'
	let pending = ''; // 跨 chunk 累积 buffer（think 标签切分用）
	let pendingTag = ''; // OUT 状态下跨 chunk 的未闭合 HTML 标签起始（<... 等待 >）
	let currentThinkBody = null; // 当前 think 块的 body 节点（null 表示 OUT）

	// 最外层代码围栏剥离状态（只作用于 OUT 文本流）
	let fenceHeadBuf = ''; // 开头围栏判定前的挂起缓冲
	let fenceHeadDone = false; // 开头围栏已剥离或已确认不存在
	let fenceTailBuf = ''; // 尾部疑似收尾围栏（含半截）的挂起缓冲，跨片拼回重判

	// 思考计时
	let thinkStartTime = null; // 当前 think 段开始 performance.now() 毫秒
	let thinkTimer = null; // setInterval 句柄
	let currentThinkSummary = null; // 当前 think 段 summary 按钮引用
	let currentThinkAborted = false; // 当前 think 段是否被中断（finishStreaming / setError 兜底触发）
	let thinkEnded = false; // 当前 think 段是否已结束（正常或被中断）
	let finalThinkDurationMs = 0; // 结束时锁定的耗时（ms），结束态文案复用，不再读 performance.now()

	// 占位文本「生成中…」的引用，便于收到首个真实 chunk 时立即移除
	let loadingSpan = null;

	// 贴底滚动：默认跟随新内容；用户上滚时冻结，回到底部阈值内恢复
	let stickToBottom = true;
	let scrollRafId = 0;
	const STICK_THRESHOLD_PX = 32; // 距底 ≤ 此值视为"已在底部"

	function scrollToBottomNow() {
		// 同步赋值，不用 behavior:'smooth' —— 流式高频追加下 smooth 动画队列会堆积，
		// 反而跟不上渲染节奏、出现回拉。直接跳到位与 ChatGPT 早期版一致，最稳。
		container.scrollTop = container.scrollHeight;
	}

	function scheduleScrollToBottom() {
		if (scrollRafId || !stickToBottom) return;
		scrollRafId = requestAnimationFrame(() => {
			scrollRafId = 0;
			scrollToBottomNow();
		});
	}

	function resetStickToBottom() {
		if (scrollRafId) {
			cancelAnimationFrame(scrollRafId);
			scrollRafId = 0;
		}
		stickToBottom = true;
	}

	function clearContainer() {
		while (container.firstChild) container.removeChild(container.firstChild);
		currentThinkBody = null;
		loadingSpan = null; // ★ 防止指向已 remove 的旧节点
		// 清理思考计时（防止泄漏到下一次生成）
		if (thinkTimer) {
			clearInterval(thinkTimer);
			thinkTimer = null;
		}
		thinkStartTime = null;
		currentThinkSummary = null;
		currentThinkAborted = false;
		thinkEnded = false;
		finalThinkDurationMs = 0;
		// 重置围栏剥离状态
		fenceHeadBuf = '';
		fenceHeadDone = false;
		fenceTailBuf = '';
		// 贴底滚动重置（新内容天然从底展示）
		resetStickToBottom();
	}

	function updateStatus() {
		if (streaming) {
			status.textContent = `生成中 · ${lastText.length.toLocaleString()} 字`;
		}
	}

	// ========== 思考计时 ==========
	function updateThinkLabel() {
		if (!currentThinkSummary) return;
		let prefix;
		if (thinkEnded) {
			prefix = currentThinkAborted ? '思考已中断' : '思考完成';
		} else {
			prefix = '思考中...';
		}
		const suffix = !thinkEnded && currentThinkAborted ? ' · 已中断' : '';
		const ms = thinkEnded ? finalThinkDurationMs : thinkStartTime ? performance.now() - thinkStartTime : 0;
		currentThinkSummary.textContent = `${prefix} (${formatThinkDuration(ms)})${suffix}`;
	}

	function startThinkTimer(summaryBtn) {
		// 清理可能存在的旧 timer（防御性，正常流程下不会触发）
		if (thinkTimer) {
			clearInterval(thinkTimer);
			thinkTimer = null;
		}
		thinkStartTime = performance.now();
		finalThinkDurationMs = 0;
		thinkEnded = false;
		currentThinkSummary = summaryBtn;
		currentThinkAborted = false;
		updateThinkLabel();
		thinkTimer = setInterval(updateThinkLabel, 200);
	}

	function stopThinkTimer(aborted) {
		if (thinkTimer) {
			clearInterval(thinkTimer);
			thinkTimer = null;
		}
		if (thinkStartTime && currentThinkSummary) {
			currentThinkAborted = !!aborted;
			finalThinkDurationMs = performance.now() - thinkStartTime;
			thinkEnded = true;
			updateThinkLabel(); // 最终一次更新（确保最后一帧到位，呈现「思考完成 / 思考已中断」）
		}
		thinkStartTime = null;
		currentThinkSummary = null;
	}

	function flushPendingText(s) {
		if (!s) return;

		// ===== 最外层代码围栏预处理（只作用于 OUT 段）=====
		// (A) 拼回上一次挂起的尾部：又来了新内容，与新片一起重判（中途绝不丢内容）
		if (fenceTailBuf) {
			s = fenceTailBuf + s;
			fenceTailBuf = '';
		}

		// (B) 开头围栏判定
		if (!fenceHeadDone) {
			fenceHeadBuf += s;
			// couldBeFence：当前缓冲仍可能构成 ``` 开头（是 ``` 的前缀，或已含 ```）
			const couldBeFence = '```'.startsWith(fenceHeadBuf) || fenceHeadBuf.startsWith('```');
			if (!couldBeFence) {
				// 不可能是三反引号围栏（如 "`a"、"x..."）→ 整段作为正文放行
				s = fenceHeadBuf;
				fenceHeadBuf = '';
				fenceHeadDone = true;
			} else if (!fenceHeadBuf.startsWith('```')) {
				// 还只是 ``` 的前缀（"`" 或 "``"）→ 继续等
				return;
			} else {
				// 已确定以 ``` 开头，需等首个 \n 才能校验语言标签
				const nl = fenceHeadBuf.indexOf('\n');
				if (nl === -1) {
					if (fenceHeadBuf.length > FENCE_HEAD_MAX) {
						// 迟迟不见 \n 且超长 → 判定不是围栏，放行
						s = fenceHeadBuf;
						fenceHeadBuf = '';
						fenceHeadDone = true;
					} else {
						return; // 继续等 \n
					}
				} else {
					const head = fenceHeadBuf.slice(0, nl);
					if (FENCE_HEAD_LANG_OK.test(head)) {
						// 确认开头围栏 → 丢弃首行（含 \n），其余为正文
						s = fenceHeadBuf.slice(nl + 1);
					} else {
						// ``` 后跟非法字符 → 不是围栏，整段放行
						s = fenceHeadBuf;
					}
					fenceHeadBuf = '';
					fenceHeadDone = true;
				}
			}
		}

		// (C) 尾部围栏挂起：末尾若是（半截或完整）收尾围栏，先挂起，留待后续片拼回或流结束裁决
		if (s) {
			const m = FENCE_TAIL_HOLD_RE.exec(s);
			if (m) {
				fenceTailBuf = s.slice(m.index);
				s = s.slice(0, m.index);
			}
		}

		if (!s) return;

		// 拼接跨 chunk 残留的未闭合 HTML 标签起始
		const full = pendingTag + s;
		pendingTag = '';

		// 扫描：每个 <...> 区间内的空白归一化；未闭合的 <... 留到下次
		let out = '';
		let i = 0;
		while (i < full.length) {
			if (full[i] === '<') {
				const end = full.indexOf('>', i);
				if (end === -1) {
					pendingTag = full.slice(i);
					break;
				}
				out += normalizeTagWhitespace(full.slice(i, end + 1));
				i = end + 1;
			} else {
				out += full[i];
				i++;
			}
		}

		if (!out) return;
		lastText += out;
		const span = document.createElement('span');
		span.className = 'output__text';
		span.textContent = out;
		container.appendChild(span);
		scheduleScrollToBottom();
		updateStatus();
	}

	function flushPendingThink(s) {
		if (!s && !currentThinkBody) return;
		if (!currentThinkBody) {
			const block = document.createElement('div');
			block.className = 'output__think';
			const btn = document.createElement('button');
			btn.className = 'output__think-summary';
			btn.type = 'button';
			btn.setAttribute('aria-expanded', 'false');
			btn.textContent = '思考中...';
			btn.addEventListener('click', () => {
				const open = block.classList.toggle('is-open');
				btn.setAttribute('aria-expanded', String(open));
			});
			const body = document.createElement('div');
			body.className = 'output__think-body';
			block.append(btn, body);
			container.appendChild(block);
			currentThinkBody = body;
			scheduleScrollToBottom(); // 新建 think 块 → 跟随展开
			// ★ 启动思考计时
			startThinkTimer(btn);
		}
		if (s) {
			currentThinkBody.textContent += s;
			scheduleScrollToBottom(); // 思考体文本增长 → 跟随
		}
	}

	/**
	 * 状态机主入口：每 chunk 调用一次。
	 * 容错策略：当 pending 末尾可能是半个 tag（如 "<thi"）时，
	 * 把"疑似半截"之前的部分推进渲染，剩余部分留到下次 chunk。
	 */
	function processChunk(chunk) {
		pending += chunk;
		while (true) {
			if (state === 'OUT') {
				const lower = pending.toLowerCase();
				const idx = lower.indexOf(THINK_OPEN);
				if (idx === -1) {
					// 检查末尾是否有"未完成的 <tag 前缀"
					const lastLt = pending.lastIndexOf('<');
					if (lastLt >= 0 && pending.length - lastLt < THINK_OPEN_LEN) {
						flushPendingText(pending.slice(0, lastLt));
						pending = pending.slice(lastLt);
					} else {
						flushPendingText(pending);
						pending = '';
					}
					return;
				}
				flushPendingText(pending.slice(0, idx));
				pending = pending.slice(idx + THINK_OPEN_LEN);
				// 跨入 THINK：清空 OUT 状态的未闭合标签，避免跨状态残留
				pendingTag = '';
				state = 'IN_THINK';
			} else {
				// IN_THINK
				const lower = pending.toLowerCase();
				const idx = lower.indexOf(THINK_CLOSE);
				if (idx === -1) {
					const lastLt = pending.lastIndexOf('<');
					if (lastLt >= 0 && pending.length - lastLt < THINK_CLOSE_LEN) {
						flushPendingThink(pending.slice(0, lastLt));
						pending = pending.slice(lastLt);
					} else {
						flushPendingThink(pending);
						pending = '';
					}
					return;
				}
				flushPendingThink(pending.slice(0, idx));
				pending = pending.slice(idx + THINK_CLOSE_LEN);
				// ★ 思考段正常结束：停止计时（不标中断）
				stopThinkTimer(false);
				state = 'OUT';
			}
		}
	}

	// ========== 对外接口 ==========
	function setLoading() {
		clearContainer();
		state = 'OUT';
		pending = '';
		pendingTag = '';
		lastText = '';
		streaming = true;
		// 新一轮：保证从底部开始展示（即使之前用户停在中间位置）
		stickToBottom = true;
		// 占位文本（避免空白闪烁）
		loadingSpan = document.createElement('span');
		loadingSpan.className = 'output__text';
		loadingSpan.textContent = '生成中…';
		container.appendChild(loadingSpan);
		scheduleScrollToBottom();
		container.classList.add('is-loading');
		container.classList.remove('is-error');
		status.textContent = '生成中';
		copyBtn.disabled = true;
	}

	function appendChunk(chunk) {
		if (!streaming) {
			// 兜底：未调用 setLoading 直接推入
			clearContainer();
			streaming = true;
		}
		container.classList.remove('is-loading');
		// ★ 收到首个真实 chunk（OUT 或 IN_THINK）即删「生成中…」占位
		if (loadingSpan) {
			loadingSpan.remove();
			loadingSpan = null;
		}
		processChunk(chunk);
	}

	function finishStreaming() {
		// ★ 流已结束：挂起的尾部即最外层收尾围栏，丢弃；防御性清空头部缓冲
		fenceTailBuf = '';
		fenceHeadBuf = '';
		fenceHeadDone = true;
		// 兜底：流结束若仍在 IN_THINK 状态（没收到 </think>），标记中断
		if (state === 'IN_THINK') {
			stopThinkTimer(true);
		}
		// 兜底：把流末尾残留的未闭合 HTML 标签起始原样追加（避免半截标签丢失）
		if (pendingTag) {
			lastText += pendingTag;
			const span = document.createElement('span');
			span.className = 'output__text';
			span.textContent = pendingTag;
			container.appendChild(span);
			pendingTag = '';
		}
		streaming = false;
		// 把占位文本「生成中…」删掉（如果没收到任何 OUT 内容）
		if (!lastText && container.firstChild?.classList?.contains('output__text') && container.firstChild.textContent === '生成中…') {
			clearContainer();
		}
		container.classList.remove('is-loading', 'is-error');
		status.textContent = `完成 · ${lastText.length.toLocaleString()} 字`;
		copyBtn.disabled = !lastText;
		scheduleScrollToBottom(); // 流结束后把残留追加跟随到位
	}

	function setResult(text) {
		// 兼容完整字符串（fallback 路径）
		clearContainer();
		state = 'OUT';
		pending = '';
		pendingTag = '';
		lastText = '';
		streaming = false;
		stickToBottom = true; // 完整字符串路径：保证一次性结果从底部展示
		container.classList.remove('is-loading', 'is-error');
		if (text) processChunk(text);
		finishStreaming();
	}

	function setError(msg) {
		// 兜底清理「生成中…」占位（若 setLoading 后没收到任何 chunk 就报错）
		if (loadingSpan) {
			loadingSpan.remove();
			loadingSpan = null;
		}
		// 兜底：流中断时若还在 IN_THINK，标中断；否则安全 no-op
		stopThinkTimer(state === 'IN_THINK');
		// ★ 中断：丢弃残留的半截/挂起围栏缓冲，避免半截围栏泄漏
		fenceHeadBuf = '';
		fenceHeadDone = true;
		fenceTailBuf = '';
		streaming = false;
		// 流式中断时保留已渲染内容，状态栏标记失败
		container.classList.add('is-error');
		container.classList.remove('is-loading');
		status.textContent = '失败';
		copyBtn.disabled = !lastText;
		// 在末尾追加错误信息（仍走 textContent 安全）
		const span = document.createElement('span');
		span.className = 'output__text';
		span.style.color = 'var(--error)';
		span.textContent = `× ${msg}`;
		container.appendChild(span);
		scheduleScrollToBottom(); // 错误信息追加 → 跟随到底
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
				range.selectNodeContents(container);
				const sel = getSelection();
				sel.removeAllRanges();
				sel.addRange(range);
			} catch (_) {
				// swallow
			}
		}
		if (copyCb) copyCb();
	});

	// 滚动监听：用户主动滚到非底部 → 冻结自动滚动；回到底部阈值内 → 恢复跟随
	container.addEventListener('scroll', () => {
		const distFromBottom = container.scrollHeight - container.scrollTop - container.clientHeight;
		if (distFromBottom <= STICK_THRESHOLD_PX) {
			if (!stickToBottom) stickToBottom = true; // 回到底部 → 重新跟随
		} else {
			if (stickToBottom) stickToBottom = false; // 离开底部 → 冻结
		}
	});

	function onCopy(cb) {
		copyCb = cb;
	}

	function setStopped() {
		// 兜底：丢弃残留半截/挂起围栏缓冲
		fenceHeadBuf = '';
		fenceHeadDone = true;
		fenceTailBuf = '';
		// 兜底：若仍在 IN_THINK 状态，标记中断
		if (state === 'IN_THINK') {
			stopThinkTimer(true);
		}
		// 兜底：把流末尾残留的未闭合 HTML 标签起始原样追加
		if (pendingTag) {
			lastText += pendingTag;
			const span = document.createElement('span');
			span.className = 'output__text';
			span.textContent = pendingTag;
			container.appendChild(span);
			pendingTag = '';
		}
		streaming = false;
		// 兜底：删「生成中…」占位（如果从未收到任何 OUT 内容）
		if (loadingSpan) {
			loadingSpan.remove();
			loadingSpan = null;
		}
		if (!lastText && container.firstChild?.classList?.contains('output__text') && container.firstChild.textContent === '生成中…') {
			clearContainer();
		}
		// ★ 关键：不加 is-error，沿用正常背景；只去掉 loading 态
		container.classList.remove('is-loading', 'is-error');
		status.textContent = `已停止 · ${lastText.length.toLocaleString()} 字`;
		copyBtn.disabled = !lastText;
		scheduleScrollToBottom(); // 停止后兜底追加 → 跟随
	}

	function getLastText() {
		return lastText;
	}

	return {
		setLoading,
		appendChunk,
		finishStreaming,
		setStopped,
		setResult,
		setError,
		onCopy,
		getLastText,
	};
}
