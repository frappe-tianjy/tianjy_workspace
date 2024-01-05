
// @ts-check
import {h, unref, KeepAlive, isRef} from 'vue';


/**
 * @template P
 * @overload
 * @param {import('vue').Component<P>} component
 * @param {import('vue').Ref<boolean>} [visible]
 */
/**
 * @template P
 * @overload
 * @param {import('vue').Component<P>} Component
 * @param {Record<string, any> & P} [props]
 * @param {import('vue').Ref<boolean>} [visible]
 */
/**
 * @template P
 * @overload
 * @param {import('vue').Component<P>} Component
 * @param {Record<string, any> & P} [props]
 * @param {import('vue').Ref<boolean>} [visible]
 */
export default function createVueRenderer(component, props, visible) {
	const p = !isRef(props) && props || {};
	const core = () => h(component, Object.fromEntries(
		Object.entries(p).map(([k, v]) => [k, unref(v)]),
	));
	const domVisible = isRef(props) ? props : visible;
	if (!isRef(domVisible)) {
		return core;
	}
	const mainRender = () => domVisible.value ? h(component, Object.fromEntries(
		Object.entries(p).map(([k, v]) => [k, unref(v)]),
	)) : undefined;
	return () => h(KeepAlive, {}, mainRender);
}
