import esbuild from 'esbuild';

/**
 * 把 iframe/modules/app.js 及其所有 ES Module 依赖打包成单一 IIFE bundle。
 *
 * 为什么不用 <script type="module">：
 * EasyEDA 把扩展 HTML 通过 IndexedDB（自定义非层级协议）提供给 iframe ，
 * 该协议下浏览器拒绝解析 ES Module 的 import —— 即使是绝对路径也会失败。
 * 用普通 <script src="..."> 加载 IIFE bundle 可绕过该限制。
 */
const config = {
	entryPoints: ['./iframe/modules/app.js'],
	bundle: true,
	format: 'iife',
	outfile: './iframe/dist/bundle.js',
	platform: 'browser',
	target: ['es2020'],
	minify: false,
	treeShaking: true,
	sourcemap: undefined,
} satisfies Parameters<(typeof esbuild)['build']>[0];

(async () => {
	const ctx = await esbuild.context(config);
	if (process.argv.includes('--watch')) {
		await ctx.watch();
	} else {
		await ctx.rebuild();
		process.exit();
	}
})();
