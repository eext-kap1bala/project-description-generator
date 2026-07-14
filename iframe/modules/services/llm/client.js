/**
 * LLM API 客户端（OpenAI 兼容 /chat/completions）
 *
 * - testConnection：发 max_tokens=1 的最小请求，验证 base URL / key / model
 * - generate：发完整对话请求，返回助手回复文本
 * - 统一错误处理：超时、网络/CORS、HTTP 错误都转为 Error，中文消息
 * - 自动拼接 /chat/completions 后缀（如果 baseUrl 已含 /v1 则不重复）
 */

const TEST_TIMEOUT_MS = 15000;
const GENERATE_TIMEOUT_MS = 60000;

/**
 * 拼接 base URL 与端点路径，剥去尾部斜杠。
 * 支持 baseUrl 已经含 /v1 的情况（如 https://api.openai.com/v1）。
 */
function joinUrl(baseUrl, path) {
	const base = (baseUrl || '').replace(/\/+$/, '');
	// 如果 base 已经以 /v1 结尾，且 path 是 /chat/completions，则只补 /chat/completions
	if (/\/v\d+$/.test(base) && path.startsWith('/chat/')) {
		return base + path;
	}
	// 否则补一个 /v1（兼容裸域名）
	if (!/\/v\d+$/.test(base) && path === '/chat/completions') {
		return base + '/v1' + path;
	}
	return base + path;
}

function buildHeaders(apiKey) {
	return {
		'Content-Type': 'application/json',
		Authorization: `Bearer ${apiKey}`,
	};
}

/**
 * 测试连接：发一个最小请求。
 * 成功返回 { ok: true, latencyMs }
 * 失败抛出 Error，message 包含 HTTP 码或网络原因
 */
export async function testConnection({ baseUrl, apiKey, model }) {
	if (!baseUrl) throw new Error('Base URL 为空');
	if (!apiKey) throw new Error('API Key 为空');
	if (!model) throw new Error('模型名为空');

	const url = joinUrl(baseUrl, '/chat/completions');
	const ctrl = new AbortController();
	const timer = setTimeout(() => ctrl.abort(), TEST_TIMEOUT_MS);

	const start = performance.now();
	try {
		const res = await fetch(url, {
			method: 'POST',
			headers: buildHeaders(apiKey),
			body: JSON.stringify({
				model,
				messages: [{ role: 'user', content: 'ping' }],
				max_tokens: 1,
			}),
			signal: ctrl.signal,
		});
		const latencyMs = Math.round(performance.now() - start);

		if (!res.ok) {
			const text = await res.text().catch(() => '');
			throw new Error(`HTTP ${res.status} — ${text.slice(0, 200)}`);
		}
		return { ok: true, latencyMs };
	} catch (e) {
		if (e.name === 'AbortError') {
			throw new Error(`请求超时（${TEST_TIMEOUT_MS / 1000}s）`);
		}
		if (e instanceof TypeError) {
			// fetch 网络错误 / CORS / DNS 失败通常抛 TypeError
			throw new Error(`网络/CORS 错误：${e.message}`);
		}
		throw e;
	} finally {
		clearTimeout(timer);
	}
}

/**
 * 调用 LLM 生成排版文本。
 * 成功返回 string（助手消息 content）
 * 失败抛出 Error
 */
export async function generate({ baseUrl, apiKey, model, systemPrompt, userInput }, { signal } = {}) {
	if (!baseUrl) throw new Error('Base URL 为空');
	if (!apiKey) throw new Error('API Key 为空');
	if (!model) throw new Error('模型名为空');
	if (!userInput) throw new Error('用户输入为空');

	const url = joinUrl(baseUrl, '/chat/completions');

	let ctrl = null;
	let timer = null;
	if (!signal) {
		ctrl = new AbortController();
		timer = setTimeout(() => ctrl.abort(), GENERATE_TIMEOUT_MS);
	}
	const realSignal = signal || (ctrl && ctrl.signal);

	try {
		const res = await fetch(url, {
			method: 'POST',
			headers: buildHeaders(apiKey),
			body: JSON.stringify({
				model,
				messages: [
					{ role: 'system', content: systemPrompt },
					{ role: 'user', content: userInput },
				],
				temperature: 0.7,
			}),
			signal: realSignal,
		});

		if (!res.ok) {
			const text = await res.text().catch(() => '');
			throw new Error(`HTTP ${res.status} — ${text.slice(0, 200)}`);
		}

		const data = await res.json();
		const content = data?.choices?.[0]?.message?.content;
		if (typeof content !== 'string') {
			throw new Error('响应格式异常：未找到 choices[0].message.content');
		}
		return content;
	} catch (e) {
		if (e.name === 'AbortError') {
			throw new Error(`请求超时（${GENERATE_TIMEOUT_MS / 1000}s）`);
		}
		if (e instanceof TypeError) {
			throw new Error(`网络/CORS 错误：${e.message}`);
		}
		throw e;
	} finally {
		if (timer) clearTimeout(timer);
	}
}
