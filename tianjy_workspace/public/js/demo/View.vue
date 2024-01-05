<script lang="ts" setup>
import { computed } from 'vue';

const props = defineProps<{
	value?: any;
	editing: boolean;
}>();
const emit = defineEmits<{
	(event: 'edit'): void
}>();

const v = computed(() => JSON.stringify(props.value));
</script>

<template>
	<WorkspaceWidget>
		<template #title>
			这是标题
		</template>
		<template #subtitle>
			这是子标题
		</template>
		<div>{{ v }}</div>
	</WorkspaceWidget>
</template>
