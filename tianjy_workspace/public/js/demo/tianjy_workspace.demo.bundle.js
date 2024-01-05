import { ref, createApp } from 'vue';
import {define} from 'tianjy_workspace';
import getDOMNodeState from 'tianjy_workspace/getDOMNodeState';
import createVueRenderer from 'tianjy_workspace/createVueRenderer';


import createWidgetDialog from './createWidgetDialog';
import View from './View.vue';
import Config from './Config.vue';
import * as components from './components';


/**
 *
 * @param {import('tianjy_workspace').RendererContext<any>} ctx
 * @returns
 */
function renderer(ctx) {
	/** @type {import ('vue').Ref<any>} */
	const vueValue = ref(ctx.value);
	ctx.listenValue(v => { vueValue.value = v; });
	const domVisible = ref(false);

	const render = createVueRenderer(View, {
		value: vueValue,
		editing: ctx.editing,
		onEdit: () => { ctx.edit(); },
	}, domVisible);
	const app = createApp({ render });
	app.provide('__editing__', ctx.editing);
	app.provide('__tianjy_workspace:Block__', ctx.block);
	app.provide('__tianjy_workspace:onEdit__', () => { ctx.edit(); });
	for (const [name, component] of Object.entries(components)) {
		app.component(name, component);
	}
	const parent = ctx.container;
	const el = parent.appendChild(document.createElement('div'));
	const state = getDOMNodeState(ctx.container);
	domVisible.value = state.visible;
	state.listenVisible(visible => { domVisible.value = visible; });
	state.then(mounted => {
		if (mounted) { app.mount(el); }
		return mounted;
	}).then(mounted => {
		if (!mounted) { return; }
		app.unmount();
	});
}


define('Demo', renderer, createWidgetDialog(Config), { title: '示例' });
