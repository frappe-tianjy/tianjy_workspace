<template>
	<button v-if="editable" class="btn btn-secondary btn-xs edit-button"
		@click="edit" :title="t('Edit')">
		<svg class="icon icon-xs">
			<use href="#icon-edit" />
		</svg>
	</button>
</template>

<script lang="ts" setup>
import { inject, computed } from 'vue';

const editing = inject('__editing__', false);
const onEdit = inject('__tianjy_workspace:onEdit__');
const editable = computed(() => editing && onEdit);

function edit() {
	if (typeof onEdit !== 'function') { return; }
	onEdit();
}
const t = __;

</script>
