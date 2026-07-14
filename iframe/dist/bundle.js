'use strict';
(() => {
	// iframe/modules/prompts/system.js
	var FIXED_SYSTEM_PROMPT = `\u4F60\u662F\u4E00\u540D\u8D44\u6DF1\u6280\u672F\u5199\u4F5C\u7F16\u8F91\uFF0C\u8D1F\u8D23\u628A\u7528\u6237\u8F93\u5165\u7684\u96F6\u6563\u9879\u76EE\u63CF\u8FF0\u6574\u7406\u4E3A\u7ED3\u6784\u6E05\u6670\u3001\u9762\u5411\u8BFB\u8005\u6392\u7248\u7684\u6210\u54C1\u6587\u672C\u3002

\u6392\u7248\u89C4\u5219\uFF1A
1. \u8F93\u51FA GitHub Flavored Markdown
2. \u6807\u9898\u5C42\u7EA7\u4E0D\u8D85\u8FC7 3 \u7EA7\uFF0C\u4ECE ## \u8D77
3. \u5217\u8868\u9879\u4F7F\u7528\u77ED\u53E5\uFF0C\u907F\u514D\u5197\u957F\u5D4C\u5957
4. \u5173\u952E\u672F\u8BED\u6216\u4F5C\u54C1\u540D\u9996\u6B21\u51FA\u73B0\u65F6\u4F7F\u7528 **\u52A0\u7C97**
5. \u4EE3\u7801\u3001\u6587\u4EF6\u8DEF\u5F84\u3001\u53D8\u91CF\u540D\u4F7F\u7528\u884C\u5185\u4EE3\u7801\u5305\u88F9
6. \u4E2D\u82F1\u6587\u4E4B\u95F4\u4FDD\u7559\u7A7A\u683C
7. \u4E0D\u7F16\u9020\u7528\u6237\u672A\u63D0\u4F9B\u7684\u4E8B\u5B9E\uFF0C\u4E0D\u8865\u5168\u672A\u7ED9\u51FA\u7684\u94FE\u63A5

\u53EA\u8F93\u51FA\u6392\u7248\u540E\u7684 Markdown \u6B63\u6587\uFF0C\u4E0D\u8981\u4EFB\u4F55\u89E3\u91CA\u6216\u524D\u540E\u8A00\u3002`;

	// iframe/modules/config/defaults.js
	var STORAGE_KEY = 'pdg:config:v1';
	var THEME_CACHE_KEY = 'pdg:themes:v1';
	var DEFAULTS = Object.freeze({
		baseUrl: 'https://api.openai.com/v1',
		apiKey: '',
		model: 'gpt-4o-mini',
		lastThemeId: 'general',
	});
	function mergeWithDefaults(stored) {
		if (!stored || typeof stored !== 'object') return { ...DEFAULTS };
		return {
			baseUrl: typeof stored.baseUrl === 'string' ? stored.baseUrl : DEFAULTS.baseUrl,
			apiKey: typeof stored.apiKey === 'string' ? stored.apiKey : DEFAULTS.apiKey,
			model: typeof stored.model === 'string' ? stored.model : DEFAULTS.model,
			lastThemeId: typeof stored.lastThemeId === 'string' ? stored.lastThemeId : DEFAULTS.lastThemeId,
		};
	}

	// iframe/modules/services/storage.js
	function safeParse(json, fallback) {
		try {
			return JSON.parse(json);
		} catch (e) {
			console.warn('[pdg] storage parse failed:', e);
			return fallback;
		}
	}
	function loadConfig() {
		try {
			const raw = localStorage.getItem(STORAGE_KEY);
			return mergeWithDefaults(safeParse(raw, null));
		} catch (e) {
			console.warn('[pdg] loadConfig failed:', e);
			return mergeWithDefaults(null);
		}
	}
	function saveConfig(patch) {
		const merged = { ...loadConfig(), ...patch };
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
		} catch (e) {
			console.warn('[pdg] saveConfig failed:', e);
		}
		return merged;
	}
	function loadThemeCache() {
		try {
			const raw = localStorage.getItem(THEME_CACHE_KEY);
			return safeParse(raw, null);
		} catch (e) {
			return null;
		}
	}
	function saveThemeCache(themes) {
		try {
			localStorage.setItem(THEME_CACHE_KEY, JSON.stringify(themes));
		} catch (e) {
			console.warn('[pdg] saveThemeCache failed:', e);
		}
	}

	// iframe/modules/prompts/themes-loader.js
	var FALLBACK_THEMES = [
		{
			id: 'general',
			name: '\u901A\u7528\u6392\u7248',
			description: '\u7ED3\u6784\u6E05\u6670\u3001\u8BED\u6C14\u5E73\u5B9E',
			prompt: '\u8BF7\u5BF9\u4EE5\u4E0B\u9879\u76EE\u63CF\u8FF0\u8FDB\u884C\u4E13\u4E1A\u6392\u7248\u3002\u8981\u6C42\u4F7F\u7528\u6070\u5F53\u7684\u6807\u9898\u5C42\u7EA7\uFF08## \u8D77\uFF09\uFF0C\u5408\u7406\u5206\u6BB5\uFF0C\u5173\u952E\u672F\u8BED\u52A0\u7C97\uFF0C\u5FC5\u8981\u65F6\u4F7F\u7528\u5217\u8868\u3002\u4EC5\u8F93\u51FA\u6392\u7248\u540E\u7684 Markdown \u6B63\u6587\u3002',
		},
		{
			id: 'github',
			name: 'GitHub README',
			description: '\u4ED3\u5E93\u9996\u9875\u98CE\u683C',
			prompt: '\u8BF7\u5C06\u4EE5\u4E0B\u5185\u5BB9\u6539\u5199\u4E3A GitHub README\u3002\u7ED3\u6784\uFF1A\u9879\u76EE\u6807\u9898\u3001\u4E00\u53E5\u8BDD\u7B80\u4ECB\u3001\u529F\u80FD\u7279\u6027\uFF08- \u5217\u8868\uFF09\u3001\u6280\u672F\u6808\u3001\u5FEB\u901F\u5F00\u59CB\u3001\u4F7F\u7528\u793A\u4F8B\u3001\u8BB8\u53EF\u8BC1\u3002\u5F00\u5934\u653E\u4E00\u4E2A emoji\u3002',
		},
	];
	function isValidThemes(data) {
		return (
			data &&
			Array.isArray(data.themes) &&
			data.themes.length > 0 &&
			data.themes.every((t) => typeof t.id === 'string' && typeof t.name === 'string' && typeof t.prompt === 'string')
		);
	}
	async function loadThemes() {
		const cached = loadThemeCache();
		if (isValidThemes(cached)) {
			return cached.themes;
		}
		try {
			const res = await fetch('/iframe/themes.json', { cache: 'no-store' });
			if (res.ok) {
				const data = await res.json();
				if (isValidThemes(data)) {
					saveThemeCache(data.themes);
					return data.themes;
				}
			}
		} catch (e) {
			console.warn('[pdg] loadThemes fetch failed:', e);
		}
		console.warn('[pdg] using fallback themes');
		return FALLBACK_THEMES;
	}

	// iframe/modules/services/llm/client.js
	var TEST_TIMEOUT_MS = 15e3;
	var GENERATE_TIMEOUT_MS = 6e4;
	function joinUrl(baseUrl, path) {
		const base = (baseUrl || '').replace(/\/+$/, '');
		if (/\/v\d+$/.test(base) && path.startsWith('/chat/')) {
			return base + path;
		}
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
	async function testConnection({ baseUrl, apiKey, model }) {
		if (!baseUrl) throw new Error('Base URL \u4E3A\u7A7A');
		if (!apiKey) throw new Error('API Key \u4E3A\u7A7A');
		if (!model) throw new Error('\u6A21\u578B\u540D\u4E3A\u7A7A');
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
				throw new Error(`HTTP ${res.status} \u2014 ${text.slice(0, 200)}`);
			}
			return { ok: true, latencyMs };
		} catch (e) {
			if (e.name === 'AbortError') {
				throw new Error(`\u8BF7\u6C42\u8D85\u65F6\uFF08${TEST_TIMEOUT_MS / 1e3}s\uFF09`);
			}
			if (e instanceof TypeError) {
				throw new Error(`\u7F51\u7EDC/CORS \u9519\u8BEF\uFF1A${e.message}`);
			}
			throw e;
		} finally {
			clearTimeout(timer);
		}
	}
	async function generate({ baseUrl, apiKey, model, systemPrompt, userInput }, { signal } = {}) {
		if (!baseUrl) throw new Error('Base URL \u4E3A\u7A7A');
		if (!apiKey) throw new Error('API Key \u4E3A\u7A7A');
		if (!model) throw new Error('\u6A21\u578B\u540D\u4E3A\u7A7A');
		if (!userInput) throw new Error('\u7528\u6237\u8F93\u5165\u4E3A\u7A7A');
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
				throw new Error(`HTTP ${res.status} \u2014 ${text.slice(0, 200)}`);
			}
			const data = await res.json();
			const content = data?.choices?.[0]?.message?.content;
			if (typeof content !== 'string') {
				throw new Error('\u54CD\u5E94\u683C\u5F0F\u5F02\u5E38\uFF1A\u672A\u627E\u5230 choices[0].message.content');
			}
			return content;
		} catch (e) {
			if (e.name === 'AbortError') {
				throw new Error(`\u8BF7\u6C42\u8D85\u65F6\uFF08${GENERATE_TIMEOUT_MS / 1e3}s\uFF09`);
			}
			if (e instanceof TypeError) {
				throw new Error(`\u7F51\u7EDC/CORS \u9519\u8BEF\uFF1A${e.message}`);
			}
			throw e;
		} finally {
			if (timer) clearTimeout(timer);
		}
	}

	// iframe/modules/ui/toast.js
	var TOAST_DURATION = 3e3;
	var TOAST_GAP = 60;
	function $(id) {
		return document.getElementById(id);
	}
	var queue = [];
	var activeTimer = null;
	var activeEl = null;
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
	function toast(message, kind = 'info') {
		const host = $('toast-host');
		if (!host) return;
		queue.push({ host, message, kind });
		flush();
	}

	// iframe/modules/ui/config-panel.js
	function $2(id) {
		return document.getElementById(id);
	}
	function initConfigPanel(config, onConfigChange) {
		const baseEl = $2('cfg-base');
		const keyEl = $2('cfg-key');
		const modelEl = $2('cfg-model');
		const testBtn = $2('btn-test');
		const statusEl = $2('cfg-status');
		const summaryEl = $2('cfg-summary');
		baseEl.value = config.baseUrl || '';
		keyEl.value = config.apiKey || '';
		modelEl.value = config.model || '';
		refreshSummary();
		function refreshSummary() {
			if (!summaryEl) return;
			if (!config.baseUrl || !config.model) {
				summaryEl.textContent = '\u672A\u914D\u7F6E';
				return;
			}
			summaryEl.textContent = config.apiKey ? `\u5DF2\u914D\u7F6E \xB7 ${config.model}` : '\u672A\u914D\u7F6E';
		}
		function setStatus(state, text) {
			if (!statusEl) return;
			statusEl.dataset.state = state;
			statusEl.textContent = text;
		}
		function emit(patch) {
			Object.assign(config, patch);
			refreshSummary();
			if (typeof onConfigChange === 'function') {
				onConfigChange(patch);
			}
		}
		for (const [el, key] of [
			[baseEl, 'baseUrl'],
			[keyEl, 'apiKey'],
			[modelEl, 'model'],
		]) {
			el.addEventListener('change', () => emit({ [key]: el.value.trim() }));
			el.addEventListener('blur', () => emit({ [key]: el.value.trim() }));
		}
		testBtn.addEventListener('click', async () => {
			const cfg = {
				baseUrl: baseEl.value.trim(),
				apiKey: keyEl.value.trim(),
				model: modelEl.value.trim(),
			};
			if (!cfg.baseUrl || !cfg.apiKey || !cfg.model) {
				toast('\u8BF7\u5148\u586B\u5199\u5B8C\u6574\u7684 API \u8BBE\u7F6E', 'error');
				setStatus('fail', '\u672A\u6D4B\u8BD5');
				return;
			}
			testBtn.disabled = true;
			setStatus('testing', '\u6D4B\u8BD5\u4E2D\u2026');
			try {
				const { latencyMs } = await testConnection(cfg);
				setStatus('ok', `\u5DF2\u8FDE\u63A5 \xB7 ${latencyMs}ms`);
				toast('\u8FDE\u63A5\u6210\u529F', 'success');
			} catch (e) {
				setStatus('fail', '\u8FDE\u63A5\u5931\u8D25');
				toast(`\u8FDE\u63A5\u5931\u8D25\uFF1A${e.message || e}`, 'error');
			} finally {
				testBtn.disabled = false;
			}
		});
		return {
			setStatus,
			refresh: refreshSummary,
			getConfig: () => ({
				baseUrl: baseEl.value.trim(),
				apiKey: keyEl.value.trim(),
				model: modelEl.value.trim(),
			}),
		};
	}

	// iframe/modules/ui/input-panel.js
	function $3(id) {
		return document.getElementById(id);
	}
	function initInputPanel(textareaId, charCountId, { onSubmit } = {}) {
		const ta = $3(textareaId);
		const counter = $3(charCountId);
		function updateCount() {
			const v = ta.value || '';
			const n = v.trim().length;
			counter.textContent = `${n.toLocaleString()} \u5B57`;
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

	// iframe/modules/ui/output-panel.js
	function $4(id) {
		return document.getElementById(id);
	}
	function initOutputPanel({ preId, statusId, copyBtnId, regenBtnId }) {
		const pre = $4(preId);
		const status = $4(statusId);
		const copyBtn = $4(copyBtnId);
		const regenBtn = $4(regenBtnId);
		let lastText = '';
		let copyCb = null;
		function setLoading() {
			pre.textContent = '\u751F\u6210\u4E2D\u2026';
			pre.classList.add('is-loading');
			pre.classList.remove('is-error');
			status.textContent = '\u751F\u6210\u4E2D';
			copyBtn.disabled = true;
			regenBtn.disabled = true;
		}
		function setResult(text) {
			lastText = text || '';
			pre.textContent = lastText;
			pre.classList.remove('is-loading', 'is-error');
			status.textContent = `\u5B8C\u6210 \xB7 ${lastText.length.toLocaleString()} \u5B57`;
			copyBtn.disabled = !lastText;
			regenBtn.disabled = false;
		}
		function setError(msg) {
			pre.textContent = `\xD7 ${msg}`;
			pre.classList.add('is-error');
			pre.classList.remove('is-loading');
			status.textContent = '\u5931\u8D25';
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
				try {
					const range = document.createRange();
					range.selectNodeContents(pre);
					const sel = getSelection();
					sel.removeAllRanges();
					sel.addRange(range);
				} catch (_) {}
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

	// iframe/modules/ui/theme-selector.js
	function renderThemeSelector(container, themes, activeId, onChange) {
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

	// iframe/modules/app.js
	function $5(id) {
		return document.getElementById(id);
	}
	(async function main() {
		const config = loadConfig();
		let themes = [];
		try {
			themes = await loadThemes();
		} catch (e) {
			console.warn('[pdg] loadThemes fatal:', e);
			themes = [];
		}
		if (!themes.length) {
			toast('\u672A\u52A0\u8F7D\u5230\u4EFB\u4F55\u4E3B\u9898\uFF0C\u8BF7\u68C0\u67E5 themes.json', 'error');
		}
		let activeThemeId = themes.some((t) => t.id === config.lastThemeId) ? config.lastThemeId : themes[0]?.id;
		renderThemeSelector($5('theme-bar'), themes, activeThemeId, (id) => {
			activeThemeId = id;
			saveConfig({ lastThemeId: id });
		});
		const configPanel = initConfigPanel(config, (patch) => {
			saveConfig(patch);
		});
		const input = initInputPanel('user-input', 'char-count', {
			onSubmit: runGenerate,
		});
		const output = initOutputPanel({
			preId: 'output',
			statusId: 'result-status',
			copyBtnId: 'btn-copy',
			regenBtnId: 'btn-regenerate',
		});
		output.onCopy(() => toast('\u5DF2\u590D\u5236', 'success'));
		output.setRegenHandler(runGenerate);
		$5('btn-generate').addEventListener('click', runGenerate);
		async function runGenerate() {
			const latest = configPanel.getConfig();
			if (!latest.baseUrl || !latest.apiKey || !latest.model) {
				toast('\u8BF7\u5148\u5728 API \u8BBE\u7F6E\u4E2D\u586B\u5199\u5B8C\u6574\u4FE1\u606F', 'error');
				document.querySelector('.config-panel')?.setAttribute('open', '');
				return;
			}
			const userInput = input.getValue().trim();
			if (!userInput) {
				toast('\u8BF7\u8F93\u5165\u9879\u76EE\u63CF\u8FF0', 'error');
				input.focus();
				return;
			}
			const theme = themes.find((t) => t.id === activeThemeId);
			if (!theme) {
				toast('\u672A\u9009\u62E9\u6709\u6548\u4E3B\u9898', 'error');
				return;
			}
			const systemPrompt = `${FIXED_SYSTEM_PROMPT}

---

${theme.prompt}`;
			output.setLoading();
			$5('btn-generate').disabled = true;
			try {
				const text = await generate({
					baseUrl: latest.baseUrl,
					apiKey: latest.apiKey,
					model: latest.model,
					systemPrompt,
					userInput,
				});
				output.setResult(text);
				toast('\u751F\u6210\u6210\u529F', 'success');
			} catch (e) {
				const msg = e?.message || String(e);
				output.setError(msg);
				toast(`\u751F\u6210\u5931\u8D25\uFF1A${msg}`, 'error');
			} finally {
				$5('btn-generate').disabled = false;
			}
		}
	})();
})();
