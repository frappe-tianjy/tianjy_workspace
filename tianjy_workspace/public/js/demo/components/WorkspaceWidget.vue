<template>
	<div class="widget" :class="{ 'edit-mode': editing }">
		<div class="widget-head">
			<div class="widget-label">
				<div class="widget-title">
					<slot name="title">{{ title }}</slot>
				</div>
				<div class="widget-subtitle">
					<slot name="subtitle">{{ subtitle }}</slot>
				</div>
			</div>
			<div class="widget-control" v-if="editing">
				<Setting />
				<button class="btn btn-secondary btn-xs drag-handle"
					:title="t('Drag')">
					<svg class="icon  icon-xs">
						<use href="#icon-drag" />
					</svg>
				</button>
				<EditBtn />
			</div>
			<div class="widget-control" v-else>
				<slot name="button" />
			</div>
		</div>
		<div class="widget-body">
			<slot />
		</div>
		<div class="widget-footer">
			<slot name="footer" />
		</div>
	</div>
</template>

<script lang="ts" setup>
import { inject, ref } from 'vue';

import Setting from './WorkspaceWidgetSetting.vue';
import EditBtn from './WorkspaceWidgetEditBtn.vue';
defineProps<{
	title?: string;
	subtitle?: string;
}>();
const editing = inject('__editing__', false);

const t = __;

</script>
