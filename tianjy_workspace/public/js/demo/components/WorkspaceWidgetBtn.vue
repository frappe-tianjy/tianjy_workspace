<template>
	<div
		class="filter-list btn btn-xs"
		:title="title"
		@click="click">
		<svg class="icon icon-sm">
			<use :href="'#icon-' + icon" />
		</svg>
	</div>
</template>

<script lang="ts" setup>

defineProps<{
	title: string;
	icon: string;
}>();
const emit = defineEmits<{
	(event: 'click'): void
}>();
function click() {
	emit('click');
}
</script>
