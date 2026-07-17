/**
 * API 服务商预设
 *
 * 单一真相源，由 esbuild 打包进 iframe/dist/bundle.js。
 * 修改后重新 npm run compile-iframe。
 *
 * lastProviderId 字段由 storage.js 持久化；启动时回填 select。
 * API Key 不在此处存储（始终由用户手填）。
 *
 */
export const PROVIDERS = [
	{
		id: 'openai',
		name: 'OpenAI',
		baseUrl: 'https://api.openai.com/v1',
		defaultModel: 'gpt-5',
	},
	{
		id: 'deepseek',
		name: 'DeepSeek',
		baseUrl: 'https://api.deepseek.com',
		defaultModel: 'deepseek-v4-pro',
	},
	{
		id: 'glm',
		name: 'Zhipu GLM',
		baseUrl: 'https://open.bigmodel.cn/api/paas/v4',
		defaultModel: 'glm-5.2',
	},
	{
		id: 'minimax',
		name: 'MiniMax',
		baseUrl: 'https://api.minimax.chat/v1',
		defaultModel: 'MiniMax-m3',
	},
	{
		id: 'mimo',
		name: 'Xiaomi MiMo',
		baseUrl: 'https://api.xiaomimimo.com/v1',
		defaultModel: 'mimo-v2.5-pro',
	},
	{
		id: 'anthropic',
		name: 'Anthropic Claude',
		baseUrl: 'https://api.anthropic.com/v1',
		defaultModel: 'claude-opus-4-5',
	},
	{
		id: 'gemini',
		name: 'Google Gemini',
		baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
		defaultModel: 'gemini-3-pro',
	},
	{
		id: 'siliconflow',
		name: 'SiliconFlow',
		baseUrl: 'https://api.siliconflow.cn/v1',
		defaultModel: 'deepseek-ai/DeepSeek-V4-Pro',
	},
	{
		id: 'opencodego',
		name: 'OpenCode Go',
		baseUrl: 'https://api.opencodego.com/v1',
		defaultModel: 'gpt-4o-mini',
	},
	{
		id: 'kimi',
		name: 'Kimi',
		baseUrl: 'https://api.moonshot.cn/v1',
		defaultModel: 'kimi-k2.5',
	},
	{
		id: 'custom',
		name: '自定义',
		baseUrl: '',
		defaultModel: '',
	},
];
