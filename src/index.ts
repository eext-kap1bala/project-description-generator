/**
 * 入口文件
 *
 * 本文件为默认扩展入口文件，如果你想要配置其它文件作为入口文件，
 * 请修改 `extension.json` 中的 `entry` 字段；
 *
 * 请在此处使用 `export`  导出所有你希望在 `headerMenus` 中引用的方法，
 * 方法通过方法名与 `headerMenus` 关联。
 *
 * 如需了解更多开发细节，请阅读：
 * https://prodocs.lceda.cn/cn/api/guide/
 */
// import * as extensionConfig from '../extension.json';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function activate(status?: 'onStartupFinished', arg?: string): void {}

/**
 * 打开"项目描述生成器"iframe 窗口
 *
 * 通过 eda.sys_IFrame.openIFrame 加载 /iframe/index.html。
 * 路径相对于扩展包根目录，运行时由 EasyEDA 客户端从已安装的扩展中读取。
 */
export function openGenerator(): void {
	eda.sys_IFrame.openIFrame('/iframe/index.html', 960, 720, 'pdg-main', {
		maximizeButton: true,
		minimizeButton: true,
		grayscaleMask: true,
	});
}
