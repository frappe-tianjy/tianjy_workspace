// @ts-check
import define from './define';
import tianjyWorkspace, { blocks } from './constants';

tianjyWorkspace.define = define;
const {defineQueue} = tianjyWorkspace;
if (defineQueue) {
	delete tianjyWorkspace.defineQueue;
	for (const p of defineQueue) {
		define(...p);
	}

}
Object.defineProperty(frappe.views.Workspace.prototype, 'tools', {
	get() {
		return this.__tianjy_workspace_tools;
	},
	set(tools) {
		const newTools = { ...tools };
		for (const [k, c] of blocks) {
			newTools[k] = c;
		}
		this.__tianjy_workspace_tools = newTools;
	},
	enumerable: true,
	configurable: true,
});
