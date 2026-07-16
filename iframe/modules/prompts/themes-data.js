/**
 * 主题定义
 *
 * 单一真相源，由 esbuild 直接打包进 iframe/dist/bundle.js。
 * 不在运行时拉取，避免 EasyEDA IndexedDB 协议下 fetch 失败的隐患。
 *
 * 每个主题通过 fixedPromptId 引用 fixed-prompts-data.js 中的固定提示词（一对一）。
 * 多个主题可以共享同一个固定提示词（一对多）。
 *
 * 修改主题：编辑本文件后重新 npm run compile-iframe。
 */

export const THEMES = [
	{
		id: 'general',
		name: '通用排版',
		description: '结构清晰、语气平实',
		fixedPromptId: 'standard',
		prompt: '请对以下项目描述进行专业排版。要求使用恰当的标题层级（## 起），合理分段，关键术语加粗，必要时使用列表。仅输出排版后的 Markdown 正文。',
	},
	{
		id: 'github',
		name: 'GitHub README',
		description: '仓库首页风格',
		fixedPromptId: 'standard',
		prompt: '请将以下内容改写为 GitHub README。结构：项目标题、一句话简介、功能特性（- 列表）、技术栈、快速开始、使用示例、许可证。开头放一个 emoji。',
	},
	{
		id: 'academic',
		name: '技术报告',
		description: '客观、第三人称',
		fixedPromptId: 'tech',
		prompt: '请将以下内容改写为技术报告风格。客观、第三人称，按 问题—方法—结果—讨论 组织，专业术语准确。',
	},
	{
		id: 'marketing',
		name: '宣传文案',
		description: '吸引眼球的简介',
		fixedPromptId: 'minimal',
		prompt: '请将以下内容改写为吸引人的宣传文案。开头一个钩子句，使用第二人称，突出用户收益，使用强动词。',
	},
];
