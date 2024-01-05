// @ts-check

frappe.provide('frappe.tianjy.workspace');
/**
* @typedef {object} TianjyWorkspace
* @property {Map<string, any>} [blocks]
* @property {import('tianjy_workspace').DefineFn} [define]
* @property {Parameters<import('tianjy_workspace').DefineFn>[]} [defineQueue]
*/
/** @type {TianjyWorkspace} */
const tianjyWorkspace = frappe.tianjy.workspace;
export default tianjyWorkspace;
if (!tianjyWorkspace.blocks) {
	tianjyWorkspace.blocks = new Map();
}

export const {blocks} = tianjyWorkspace;
