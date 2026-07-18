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
		id: 'markdown',
		name: 'Markdown 生成器',
		description: '将文本描述转为Markdown格式',
		fixedPromptId: 'empty',
		prompt: `# 任务：将文本转换为结构化 Markdown

	* 请你扮演一个专业的编辑，将提供的文本内容转换为一份格式良好、结构清晰、重点突出的 Markdown 文档。

## A. 重点要求

	1. 忠于原文：禁止补充、删改、推断或概括；保留原文的所有文字内容；原文未提及的内容一律不可出现。
	2. 坚持到底：你是一个智能助手，请务必把用户的问题彻底解决完，然后再结束对话。只有当你确定问题完全解决了，才能结束对话。
	3. 善用工具：如果对用户发的内容或结构不确定，一定要用你的工具去读取文件并收集相关信息，绝对不要瞎猜或编造内容。
	4. 多用脑子想：你在每次排版调用之前，必须进行全面、细致、清楚的规划，并周全考虑结果。

## B. 最终输出规范 (请严格按此格式生成)

请根据你的内部推理，生成符合以下所有规范的 Markdown 文本：

1.  **主标题 (H1)**：
	* 使用 # 标题 格式，采用你在步骤 A.3 中选定的最佳标题。
2.  **内容结构**：
	* 使用不同级别的子标题（如 ##、###）来组织文章脉络，使其逻辑清晰。
	* 适当使用项目符号（-）或编号列表（1.）来呈现并列或顺序关系。
3.  **突出重点 (句子优先)**：
	* **有选择性地**使用粗体 (**) 来突出你在步骤 A.1 和 A.3 中确定的**核心论点**、**关键结论**或**金句**。
	* **优先加粗**：优先考虑加粗**能够概括要点的完整句子**或**关键短语**。
	* **避免**：避免只加粗零散的单个关键词，并**切勿过度使用粗体**，保持文档的专业性和易读性。
4.  **【!!!】重要格式规范**：
	* 在设置粗体时，**绝对不要**将任何标点符号（如 。、，、：、"、（、） 等）包含在 ** 标记内部。
	* ✅ **正确示例**(标点在 ** 之外)：这是“**一个核心观点**”。
	* ❌ **错误示例**：这是**“一个核心观点”**。
	
# 待排版的文字
`,
	},
	{
		id: 'docusaurus',
		name: 'Docusaurus 风格',
		description: '静态站点生成器 Docusaurus 风格',
		fixedPromptId: 'byHtmlTemplate',
		prompt: `# 模板
<!-- 标题 -->
<p style="color: rgb(28, 30, 33);font-size: 34px;font-weight: 700;text-align: center;margin-bottom: 0px;padding: 0px;border: none;">居中的大标题</h1>


<!-- 面包屑导航 -->
<p style="font-size:large;text-align: center;margin-top: 5px;">
	<a style="color: rgb(24, 129, 106);text-decoration: none;" href="https://oshwhub.com/">导航1</a>
	<span> | </span> 
	<a style="color: rgb(24, 129, 106);text-decoration: none;" href="https://oshwhub.com/">导航2</a>
	<span> | </span> 
	<a style="color: rgb(24, 129, 106);text-decoration: none;" href="https://oshwhub.com/">导航3</a>
	<span> | </span> 
	<a style="color: rgb(24, 129, 106);text-decoration: none;" href="https://oshwhub.com/">导航4</a>
	<span> | </span> 
	<a style="color: rgb(24, 129, 106);text-decoration: none;" href="https://oshwhub.com/">导航5</a>
</p>


<!-- 子标题 -->
<p style="color: #1c1e21;font-size: 24px;font-weight: 700;border: none;margin:0;margin-top:30px">二级标题</h2>
<p style="color: rgb(28, 30, 33);font-size: 20px;font-weight: 700;border: none;margin:0">三级标题</h3>
<p style="color: rgb(28, 30, 33);font-size: 16px;font-weight: 700;border: none;margin:0">四级标题</h4>


<!-- 虚线分隔符 -->
<hr style="border: 0;border-bottom: 4px dashed rgb(24, 129, 106);">
<!-- 实线分隔符 -->
<hr style="border: 0;border-bottom: 4px solid rgb(24, 129, 106);">


<!-- 普通文字 -->
<p style="margin: 0;line-height: 26.4px">
	一段普通文字，其中包括
	<span style="font-size: 15.2px;background-color: rgba(235, 237, 240, 0.15);border:1.6px solid rgba(0, 0, 0, 0.1);border-radius: 6.4px;padding: 1.6px;">强调的文字</span>
	或是
	<span style="font-size: 15.2px;background-color: rgba(235, 237, 240, 0.15);border:1.6px solid rgba(0, 0, 0, 0.1);border-radius: 6.4px;padding: 1.6px;">key</span>
	等。
</p>

<p style="margin: 0;line-height: 26.4px">
	一段普通文字，其中包括
	<a href="https://oshwhub.com/" style="margin: 0;line-height: 26.4px;color: rgb(24, 129, 106);text-decoration: none;">一个链接</a>
	。
</p>


<div style="background-color:rgb(253, 253, 254);border-left:3.8px solid rgb(212, 213, 216);border-radius:6.4px;padding:16px;margin: 10px;">
	<p style="margin: 0;margin-bottom: 4.8px"><b>注释</b></p>
	<p style="margin: 0;line-height: 26.4px">这是一个<b>白色</b>的注释 </p>
	<p style="margin: 0;line-height: 26.4px">可以包含一些Markdown<span style="background-color: rgba(235, 237, 240, 0.15);border:1.6px solid rgba(0, 0, 0, 0.1);border-radius: 6.4px;padding: 1.6px;">语法</span></p>
</div>


<div style="background-color:rgb(230, 246, 230);border-left:3.8px solid rgb(0, 148, 0);border-radius:6.4px;padding:16px;margin: 10px;">
	<p style="margin: 0;margin-bottom: 4.8px;"><b>💡提示</b></p>
	<p style="margin: 0;line-height: 26.4px">这是一个<b>绿色</b>的提示 </p>
	<p style="margin: 0;line-height: 26.4px">可以包含一些Markdown<span style="background-color: rgba(0, 164, 0, 0.15);border:1.6px solid rgba(0, 0, 0, 0.1);border-radius: 6.4px;padding: 1.6px;">语法</span></p>
</div>


<div style="background-color:rgb(238, 249, 253);border-left:3.8px solid rgb(76, 179, 212);border-radius:6.4px;padding:16px;margin: 10px;">
	<p style="margin: 0;margin-bottom: 4.8px;"><b>ℹ️信息</b></p>
	<p style="margin: 0;line-height: 26.4px">这是一个<b>蓝色</b>的信息 </p>
	<p style="margin: 0;line-height: 26.4px">可以包含一些Markdown<span style="background-color: rgba(84, 199, 236, 0.15);border:1.6px solid rgba(0, 0, 0, 0.1);border-radius: 6.4px;padding: 1.6px;">语法</span></p>
</div>


<div style="background-color:rgb(255, 248, 230);border-left:3.8px solid rgb(230, 167, 0);border-radius:6.4px;padding:16px;margin: 10px;">
	<p style="margin: 0;margin-bottom: 4.8px;"><b>⚠️警告</b></p>
	<p style="margin: 0;line-height: 26.4px">这是一个<b>橙色</b>的警告 </p>
	<p style="margin: 0;line-height: 26.4px">可以包含一些Markdown<span style="background-color: rgba(255, 186, 0, 0.15);border:1.6px solid rgba(0, 0, 0, 0.1);border-radius: 6.4px;padding: 1.6px;">语法</span></p>
</div>


<div style="background-color:rgb(255, 235, 236);border-left:3.8px solid rgb(225, 50, 56);border-radius:6.4px;padding:16px;margin: 10px;">
	<p style="margin: 0;margin-bottom: 4.8px;"><b>🔥危险</b></p>
	<p style="margin: 0;line-height: 26.4px">这是一个<b>红色</b>的危险 </p>
	<p style="margin: 0;line-height: 26.4px">可以包含一些Markdown<span style="background-color: rgba(250, 56, 62, 0.15);border:1.6px solid rgba(0, 0, 0, 0.1);border-radius: 6.4px;padding: 1.6px;">语法</span></p>
</div>


<!-- 嵌套 -->
<div style="background-color:rgb(238, 249, 253);border-left:3.8px solid rgb(76, 179, 212);border-radius:6.4px;padding:16px;margin: 10px;">
	<p style="margin: 0;margin-bottom: 4.8px;"><b>PARENT</b></p>
	<p style="margin: 0;line-height: 26.4px">Parent content</p>
	<div style="background-color:rgb(255, 235, 236);border-left:3.8px solid rgb(225, 50, 56);border-radius:6.4px;padding:16px;margin: 10px;">
		<p style="margin: 0;margin-bottom: 4.8px;"><b>CHILD</b></p>
		<p style="margin: 0;line-height: 26.4px">Child content</p>
		<div style="background-color:rgb(230, 246, 230);border-left:3.8px solid rgb(0, 148, 0);border-radius:6.4px;padding:16px;margin: 10px;">
			<p style="margin: 0;margin-bottom: 4.8px;"><b>Deep Child</b></p>
			<p style="margin: 0;line-height: 26.4px">Deep child content</p>
		</div>
	</div>
</div>


<!-- 卡片 -->
<div style="background-color: rgb(255, 255, 255);border:0.5px rgb(235, 237, 240) solid;border-radius: 12.8px;box-sizing: border-box;box-shadow: rgb(0, 0, 0, 0.1) 0px 1px 1px 1px;padding: 32px;margin: 10px;">
	卡片
</div>

<!-- 多卡片 -->
<div style="display: flex; gap: 16px;margin: 10px;">
	<div style="flex: 1; background-color: #fff; border:1px solid rgb(235, 237, 240); border-radius: 12.8px;box-sizing: border-box; box-shadow: rgb(0, 0, 0, 0.1) 0px 1px 1px 1px; padding: 32px;">
		卡片 1 内容
	</div>
	<div style="flex: 1; background-color: #fff; border:1px solid rgb(235, 237, 240); border-radius: 12.8px;box-sizing: border-box; box-shadow: rgb(0, 0, 0, 0.1) 0px 1px 1px 1px; padding: 32px;">
		卡片 2 内容
	</div>
</div>

<div style="display: flex; gap: 16px;margin: 10px;">
	<div style="flex: 1; background-color: #fff; border:1px solid rgb(235, 237, 240); border-radius: 12.8px;box-sizing: border-box; box-shadow: rgb(0, 0, 0, 0.1) 0px 1px 1px 1px; padding: 32px;">
		卡片 1 内容
	</div>
	<div style="flex: 1; background-color: #fff; border:1px solid rgb(235, 237, 240); border-radius: 12.8px;box-sizing: border-box; box-shadow: rgb(0, 0, 0, 0.1) 0px 1px 1px 1px; padding: 32px;">
		卡片 2 内容
	</div>
	<div style="flex: 1; background-color: #fff; border:1px solid rgb(235, 237, 240); border-radius: 12.8px;box-sizing: border-box; box-shadow: rgb(0, 0, 0, 0.1) 0px 1px 1px 1px; padding: 32px;">
		卡片 3 内容
	</div>
</div>
<!-- 以此类推 -->


<!-- 代码块 -->
<!-- 建议用AI生成，手打还是用Markdown -->
<div style="margin: 10px;color: rgb(57, 58, 52);background-color: rgb(246, 248, 250);padding: 16px;border-radius: 6.4px;border:1px rgb(235, 237, 240) solid;border-radius: 12.8px;box-sizing: border-box;box-shadow: rgb(0, 0, 0, 0.15) 0px 1.5px 2px 1px;">
	<pre style="margin: 0;height: auto;">
	<code style="font-size: 15.2px;font-family:system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;">
		for i in range(1,5):
		for j in range(1,5):
			for k in range(1,5):
				if( i != k ) and (i != j) and (j != k):
					print (i,j,k)
	</code>
	</pre>
</div>


<!-- 表格 -->
<!-- 建议用AI生成，手打还是用Markdown -->
<div style="display: flex;margin: 10px"></div>
	<table cellspacing="0" style="margin: auto">
		<thead>
			<tr>
				<th style="padding: 14px 16px;text-align: center;background-color:rgb(247,247,247);border: solid 1px rgb(218,221,225);">表头1</th>
				<th style="padding: 14px 16px;text-align: center;background-color:rgb(247,247,247);border: solid 1px rgb(218,221,225);">表头2</th>
				<th style="padding: 14px 16px;text-align: center;background-color:rgb(247,247,247);border: solid 1px rgb(218,221,225);">表头2</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td style="padding: 14px 16px;text-align: center;border: solid 1px rgb(218,221,225);">内容1</td>
				<td style="padding: 14px 16px;text-align: center;border: solid 1px rgb(218,221,225);">内容2</td>
				<td style="padding: 14px 16px;text-align: center;border: solid 1px rgb(218,221,225);">内容3</td>
			</tr>
			<tr>
				<td style="padding: 14px 16px;text-align: center;border: solid 1px rgb(218,221,225);">内容4</td>
				<td style="padding: 14px 16px;text-align: center;border: solid 1px rgb(218,221,225);">内容5</td>
				<td style="padding: 14px 16px;text-align: center;border: solid 1px rgb(218,221,225);">内容6</td>
			</tr>
		</tbody>
	</table>
</div>

# 待排版的文字
	`,
	},
];
