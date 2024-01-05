// @ts-check
const Block = Object.getPrototypeOf(frappe.workspace_block.blocks.header);

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
 */
export default function createBlock(
	type, renderer, config,
	{ minWidth, col, maxWidgetCount, icon, title } = {},
) {
	class WidgetFactory extends frappe.widget.widget_factory.base {
		/** @type {any} */
		values;
		/** @private @type {Set<(value: any) => void>} */
		__valueListeners = new Set();
		/**
		 * @private
		 * @param {any} value
		 * @returns
		 */
		__setValue(value) {
			const {values} = this;
			if (value === this.values.value) { return; }
			this.values = { ...values, value };
			for (const fn of [...this.__valueListeners]) {
				fn(value);
			}

		}
		/**
		 *
		 * @param {any} param
		 */
		constructor({
			widget_type, container, options, new: isNew, block, in_customize_mode, ...values
		}) {
			super(...arguments);
			this.values = values;
			const valueListeners = this.__valueListeners;
			const me = this;
			/** @type {import('tianjy_workspace').RendererContext<object>} */
			const ctx = {
				container,
				editing: in_customize_mode,
				block,
				get value() { return me.values.value; },
				// set value(value) { me.__setValue(value); },
				edit() { me.edit(); },
				listenValue(listener) {
					/** @type {(value: any) => void} */
					const fn = v => listener(v);
					valueListeners.add(fn);
					return () => { valueListeners.delete(fn); };
				},
			};
			renderer(ctx);
		}
		get_config() { return this.values; }
		async edit() {
			if (!this.in_customize_mode) { return; }
			const value = await config(this.values?.value || {});
			if (!value) { return; }
			this.new = true;
			this.__setValue(value);
			this.refresh();
			this.options.on_edit && this.options.on_edit(this.values);
		}


		make() {
			this.make_widget();
			// this.widget.appendTo(this.container);
		}
		make_widget() {
			this.refresh();
		}
		customize() {}
		set_title() {}

	}

	class CBlock extends Block {
		static get toolbox() {
			return {
				title: title || __(type),
				icon: frappe.utils.icon(icon || 'list', 'sm'),
			};
		}
		static get isReadOnlySupported() {
			return true;
		}
		/** @type {any} */
		constructor(opt) {
			super(opt);
			this.col = this.data?.col || col;
			this.allow_customization = !this.readOnly;
			this.options = {
				allow_sorting: this.allow_customization,
				allow_create: this.allow_customization,
				allow_delete: this.allow_customization,
				allow_hiding: false,
				allow_edit: true,
				allow_resize: true,
				min_width: minWidth,
				max_widget_count: maxWidgetCount,
			};
		}
		async new() {
			if (!(!this.readOnly && this.data && !this.data.name)) {
				return;
			}
			const value = await config();
			if (!value) {
				if (!this.readOnly && this.data && !this.data.name) {
					this.wrapper.closest('.ce-block').remove();
				}
				return;

			}
			const block_widget = new WidgetFactory({
				value,
				name: `${type}-${this.label}-${frappe.utils.get_random(20)}`,
				in_customize_mode: 1,
				widget_type: type,
				container: this.wrapper,
				block: this,
				options: {
					...this.options,
					on_delete: () => this.api.blocks.delete(),
					on_edit: () => this.on_edit(block_widget),
				},
			});
			this.block_widget = block_widget;
			this.new_block_widget = block_widget.get_config();
		}
		on_edit(block_obj) {
			let block_name = `${type}_name`;
			let block = block_obj.get_config();
			this.block_widget.widgets = block;
			this.wrapper.setAttribute(block_name, block.label);
			this.new_block_widget = block_obj.get_config();
		}
		render() {
			this.wrapper = document.createElement('div');
			const {readOnly} = this;
			const container = this.wrapper;
			this.new();

			if (this.data && this.data._name) {
				this.wrapper.innerHTML = '';
				const { col, _name: v, ...data } = this.data;
				const {options, api, block} = this;
				const widgets = { ...data, in_customize_mode: !readOnly };
				const block_widget = new WidgetFactory({
					...widgets,
					height: null,
					widget_type: type,
					container: container,
					block: this,
					options: {
						...options,
						on_delete: () => api.blocks.delete(),
						on_edit: () => block.call('on_edit', block_widget),
					},
				});
				this.block_widget = {
					container, type, options, widgets, api, block,
					widgets_list: [block_widget],
					widgets_dict: {[widgets.name]: block_widget},
				};
			}
			if (!readOnly) {
				$(container).find('.widget').addClass('edit-mode');
				// this.add_settings_button();
				this.add_new_block_button();
			}
			return container;
		}
		/**
		 *
		 * @param {any} savedData
		 * @returns
		 */
		validate(savedData) { return Boolean(savedData._name); }

		save() {
			if (this.new_block_widget) {
				return {
					...this.new_block_widget,
					new: true,
					col: this.get_col(),
					_name: Boolean(this.new_block_widget.name),
				};
			}
			if (!this.data) {
				return {};
			}
			return {
				...this.data,
				new: false,
				col: this.get_col(),
				_name: Boolean(this.data.name),
			};
		}
	}
	return CBlock;

}
