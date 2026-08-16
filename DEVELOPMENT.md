# 开发文档

> 面向贡献者与二次开发者的技术文档。包含架构、扩展点、开发命令。
>
> 用户使用文档请参见 [README.md](./README.md)。

---

## 🏗️ 架构

```
project-description-generator/
├── src/                            # EasyEDA 扩展入口
│   └── index.ts                    # 打开 iframe 窗口（1280×800）
├── iframe/                         # 工具 UI（独立可运行）
│   ├── index.html                  # 主页面（Bauhaus 视觉）
│   ├── styles/                     # CSS（Bauhaus 设计系统）
│   │   ├── tokens.css              # 设计令牌（色板 / 圆角 / 阴影 / 字体）
│   │   ├── base.css                # 全局选择器 + 滚动条 + focus
│   │   ├── layout.css              # 顶层布局 + step / pane 几何
│   │   └── components.css          # 按钮 / 输入 / 输出 / 模态框 / 装饰
│   ├── modules/
│   │   ├── app.js                  # 入口
│   │   ├── config/defaults.js      # 默认配置 + storage key
│   │   ├── prompts/                # 系统 / 主题 / 固定提示词数据
│   │   ├── services/
│   │   │   ├── llm/client.js       # LLM 流式调用（SSE）
│   │   │   ├── providers-data.js   # 10 家服务商预设 + 自定义
│   │   │   └── storage.js          # localStorage 封装
│   │   └── ui/                     # 面板组件
│   │       ├── config-panel.js     # API 配置面板
│   │       ├── input-panel.js      # 输入框
│   │       ├── output-panel.js     # 输出框 + think 折叠 + 复制过滤 + 代码围栏剥离
│   │       ├── theme-selector.js   # 主题胶囊单选
│   │       ├── theme-detail-modal.js # 主题详情 / 固定提示词编辑
│   │       └── toast.js            # 轻量提示
│   └── dist/bundle.js              # esbuild 打包产物（IIFE）
├── config/                         # esbuild 配置
│   ├── esbuild.common.ts           # 主扩展共用 esbuild 配置
│   ├── esbuild.iframe.ts           # iframe 打包配置
│   └── esbuild.prod.ts             # 生产构建入口
├── build/                          # 打包为 .eext
│   ├── packaged.ts                 # 把 dist + iframe/dist 打成 .eext
│   └── dist/                       # .eext 产物目录（含 .gitignore）
├── images/                         # 主题预览图（README 引用）
└── extension.json                  # EasyEDA 扩展清单
```

### 关键设计

- **流式调用**：`client.js:generate()` 用 `fetch + getReader()` 解析 SSE 协议（`data: {...}\n\n`），每 `delta.content` 通过 `onChunk` 回调推给 UI
- **think 状态机**：`output-panel.js` 内置 OUT / IN_THINK 状态切换，跨 chunk 容错（半截 tag 缓存到下次），遇到 `</think>` 自动停止
- **HTML 标签归一化**：`<p style="...">` 内的连续空白（换行/缩进空格）压成单空格，避免模型把单行 HTML 拆成多行
- **Bauhaus 设计系统**：`tokens.css` 单一来源，硬阴影（4-8px → black 0 模糊）、thick black borders（2-4px）、二元圆角（0 / 9999px）、primary 色板（红 #D02020 / 蓝 #1040C0 / 黄 #F0C020）
- **最外层代码围栏剥离**：`output-panel.js` 状态机识别 LLM 输出首尾的 markdown 代码围栏（开头 ` ``` ` + 语言标签 + `\n`，结尾独立行的 ` ``` `），跨 chunk 用挂起缓冲拼回重判；剥离仅作用于 OUT 文本流，不影响 think 块；流结束/中断时丢弃残留挂起缓冲
- **生成/停止按钮切换**：`app.js` 主按钮态机 `'idle' ↔ 'stopping'`；生成中按钮文字从「生成」切到「停止」、样式由红切黄；`AbortController` 中断 SSE `fetch`，`client.js` 将 `AbortError` 原样上抛，UI 兜底丢弃残留缓冲

---

## ✏️ 自定义主题与提示词

### byPrompt 与 design-system 的职责分工

`fixedPrompts[byPrompt].content` 是所有**设计类主题**共享的"角色 + 输出约束"基座：

- 中文身份段（项目排版专家）
- 三条核心原则（绝对忠实 / 主题执行 / 一次完成）
- 一组输出格式硬约束（禁用标签 / 禁用布局 / 禁用样式；标题用 `<p>`/`<div>` + 内联样式；代码统一 `<pre><code>`；禁止外层 markdown 代码围栏；HTML 内联紧凑等）

使用 `fixedPromptId: 'byPrompt'` 的设计类主题（`utility-first` / `flat` / `tech` / `comic` / `bauhaus` / `Neo-brutalism` / `sketch` / `retro` / `playful-geometric` / `anti-design-studio`），其 `prompt` 只放主题特有的 `<design-system>…</design-system>` 块（角色身份、原则、硬约束都已由 byPrompt 提供，无需重复）。

`markdown` 主题使用 `fixedPromptId: 'empty'`，并在自身 `prompt` 中自包含完整的 Markdown 排版规则，与设计类主题互不干扰。

`byHtmlTemplate`（Html模板提示词）作为备用条目保留在 `fixed-prompts-data.js` 中，目前未被任何主题引用——如需启用，可在主题定义中将其 `fixedPromptId` 指向 `byHtmlTemplate`。

最终拼装顺序（`iframe/modules/prompts/system.js:buildSystemPrompt`）：

```
byPrompt.content   (共享：身份 + 核心原则 + 格式硬约束)
        +
'\n\n---\n\n'
        +
theme.prompt       (主题特有：design-system)
```

### 添加新主题

编辑 `iframe/modules/prompts/themes-data.js`：

```js
{
    id: 'my-theme',
    name: '我的设计主题',
    description: '一句话说明',
    fixedPromptId: 'byPrompt',  // 设计类主题共享 byPrompt
    prompt: `<design-system>
# Design Style: My Theme
色板 / 字体 / 签名样式 / 组件样式 ...
</design-system>`,
}
```

如需创建 Markdown 类等独立主题，可改用 `fixedPromptId: 'empty'`，并在 `prompt` 中自包含完整规则：

```js
{
    id: 'my-markdown',
    name: '我的 Markdown 主题',
    description: '一句话说明',
    fixedPromptId: 'empty',
    prompt: `# 任务：...
具体排版规则...
`,
}
```

### 添加新固定提示词

编辑 `iframe/modules/prompts/fixed-prompts-data.js`：

```js
{
    id: 'my-fixed',
    name: '我的固定提示词',
    description: '简要说明',
    content: '强制约束的提示词内容...',
}
```

修改后需重新打包：

```bash
npm run compile-iframe
```

---

## 🛠️ 开发

### 命令

| 命令                     | 作用                                                  |
| ------------------------ | ----------------------------------------------------- |
| `npm run compile`        | 编译主扩展（`src/index.ts`）                          |
| `npm run compile-iframe` | 编译 iframe 模块（`iframe/modules/*`）                |
| `npm run build`          | 完整构建（`compile` + `compile-iframe` + 打包 .eext） |
| `npm run prepare`        | 初始化 husky git hooks（安装依赖后自动执行）          |
| `npm run prettier:all`   | 用 prettier 格式化全仓库代码                          |
| `npm run eslint:all`     | ESLint 检查并自动修复 TS 代码（脚本带 `--fix`）       |
| `npm run fix`            | prettier + eslint 一次性修复                          |

### 技术栈

- **TypeScript** — 扩展入口 `src/index.ts`
- **Vanilla JS**（无框架）— iframe 内 `iframe/modules/*`
- **esbuild** — 模块打包（IIFE 模式）
- **Husky + lint-staged** — 提交前自动 prettier + eslint
- **CSS** — 自定义 Bauhaus 设计系统（无 Tailwind / shadcn）

### 本地预览

```bash
# 启动静态服务器预览 iframe UI
npx serve iframe/

# 或在 EasyEDA Pro 中加载 ./build/dist/*.eext
```

---

## 🤝 贡献

欢迎提交 Issue / PR：

- 新增服务商预设
- 适配 Anthropic / Gemini 协议
- 新增主题 / 固定提示词
- UI 改进

---

## 🔗 相关链接

- [嘉立创EDA 扩展开发文档](https://prodocs.lceda.cn/cn/api/guide/)
- [嘉立创EDA 扩展商店](https://ext.lceda.cn/)
- [pro-api-sdk（基础 SDK）](https://github.com/easyeda/pro-api-sdk)
