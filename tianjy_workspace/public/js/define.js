// @ts-check
import { blocks } from './constants';
import createBlock from './createBlock';

/**
 * @param {string} type
 * @param {(ctx: import('tianjy_workspace').RendererContext<any>) => void} renderer 渲染函数
 * @param {(value?: object) => PromiseLike<object | null> | object | null} config 配置函数
 * @param {object} [options] 现象
 * @param {number} [options.col] 默认列
 * @param {number} [options.minWidth] 最大宽度
 * @param {number} [options.maxWidgetCount] 最大数量
 * @param {string} [options.icon] 组件图标
 * @param {string} [options.title] 组件标题
 * @param {boolean} [options.deprecated] 是否为过时的组件
 */
export default function define(
	type,
	renderer,
	config,
	{ minWidth, col, maxWidgetCount, icon, title, deprecated } = {},
) {
	const block = createBlock(
		type,
		renderer,
		config,
		{ minWidth, col, maxWidgetCount, icon, title },
	);
	if (!deprecated) { frappe.workspace_block.blocks[type] = block; }
	blocks.set(type, block);

}
