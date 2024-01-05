// @ts-check
import tianjyWorkspace, { blocks } from './public/js/constants';
/**
 * @template {object} T
 * @typedef {object} RendererContext
 * @property {HTMLElement} container
 * @property {boolean} editing
 * @property {T} value
 * @property {any} block
 * @property {() => void} edit
 * @property {(listener: (value: T) => void) => () => void} listenValue
 */

/**
 * @callback DefineFn
 * @param {string} type
 * @param {(ctx: RendererContext<object>) => void} renderer 渲染函数
 * @param {(value?: object) => PromiseLike<object | null> | object | null} config 配置函数
 * @param {object} [options] 现象
 * @param {number} [options.col] 默认列
 * @param {number} [options.minWidth] 最大宽度
 * @param {number} [options.maxWidgetCount] 最大数量
 * @param {string} [options.icon] 组件图标
 * @param {string} [options.title] 组件标题
 * @param {boolean} [options.deprecated] 是否为过时的组件
 */


/**
 *
 * @param {string} key
 * @param {*} block
 * @param {boolean} [deprecated]
 */
export function register(key, block, deprecated) {
	if (!deprecated) { frappe.workspace_block.blocks[key] = block; }
	blocks.set(key, block);
}
/**
 *
 * @param  {Parameters<DefineFn>} p
 */
export function define(...p) {
	if (typeof tianjyWorkspace.define === 'function') {
		tianjyWorkspace.define(...p);
		return;
	}
	const {defineQueue} = tianjyWorkspace;
	if (defineQueue) {
		defineQueue.push(p);
		return;
	}
	tianjyWorkspace.defineQueue = [p];

}
