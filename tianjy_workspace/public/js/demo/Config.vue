<script lang="ts" setup>
import { computed } from 'vue';

const props = defineProps<{
	modelValue?: any;
}>();
const emit = defineEmits<{
	(event: 'update:modelValue', data: any, submittable?: boolean): void;
	(event: 'cancel' | 'submit'): void;
}>();


const value = computed({
	get: () => props.modelValue,
	set: v => emit('update:modelValue', v),
});
function cancel() {
	emit('cancel');
}
function submit() {
	emit('submit');
}
const v = JSON.stringify(value.value);
value.value = { k: Math.random() };
const v2 = computed(() => JSON.stringify(value.value));
</script>

<template>
	<div>{{ v }}</div>
	<div>{{ v2 }}</div>
</template>
