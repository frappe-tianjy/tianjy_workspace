import { App, shallowRef, createApp, h } from 'vue';


function createWidgetDialog (ConfigComponent: any) {
	return function WidgetDialog(value?: any) {
		const editing = Boolean(value);
		return new Promise(resolve => {
			let end = false;
			let dialog: frappe.ui.Dialog<any> | undefined;
			let mounted = false;
			let vue: App | undefined;
			let removed = false;
			function remove() {
				if (!mounted) { return; }
				if (removed) { return; }
				removed = true;
				dialog?.hide();
				vue?.unmount();
			}
			function ended() {
				if (end) { return false; }
				end = true;
				remove();
				return true;
			}
			const modelValue = shallowRef(value);
			const submittable = shallowRef(true);
			const onCancel = () => {
				if (!ended()) { return; }
				resolve(null);
			};
			const onSubmit = () => {
				if (!ended()) { return; }
				if (!submittable.value) { return; }
				console.log(modelValue.value || {});
				resolve(modelValue.value || {});
			};
			const onUpdate = (data: any, isSubmittable?: boolean) => {
				modelValue.value = data;
				if (typeof isSubmittable === 'boolean') {
					submittable.value = isSubmittable;
				}
			};
			vue = createApp({
				render() {
					return h(ConfigComponent, {
						value: value,
						modelValue: modelValue.value,
						'onUpdate:modelValue': onUpdate,
						onUpdate,
						onCancel,
						onSubmit,
					});
				},
			});
			dialog = new frappe.ui.Dialog({
				title: `${__(editing ? 'Edit' : 'Add')} 示例`,
				fields: [{ fieldname: 'main', fieldtype: 'HTML', label: '' }],
				primary_action: onSubmit,
				primary_action_label: __(editing ? 'Save' : 'Add'),
				on_hide: onCancel,
			});

			const p = (dialog.fields_dict.main as any).wrapper as HTMLElement;
			vue.mount(p.appendChild(document.createElement('div')));
			mounted = true;
			if (end) { remove(); }
			dialog.show();
			//@ts-ignore
			window.cur_dialog = dialog;
		});
	};
}

export default createWidgetDialog;
