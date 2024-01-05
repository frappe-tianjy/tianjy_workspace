<template>
	<div class="dropdown-btn" v-if="has">
		<button class="btn btn-secondary btn-xs setting-btn"
			@click="hidden = !hidden" title="Setting">
			<svg class="icon icon-xs">
				<use class="" href="#icon-dot-horizontal"></use>
			</svg>
		</button>
		<div class="dropdown-list" :hidden="hidden">
			<div class="dropdown-item" :title="t('Delete Block')"
				@click="block.api.blocks.delete()">
				<span class="dropdown-item-icon"><svg class="icon icon-sm">
					<use class="" href="#icon-delete-active"></use>
				</svg></span>
				<span class="dropdown-item-label">
					{{ t('Delete') }}
				</span>
			</div>
			<div class="dropdown-item" :title="t('Expand Block')"
				@click="block.increase_width()">
				<span class="dropdown-item-icon"><svg class="icon icon-sm">
					<use class="" href="#icon-expand-alt"></use>
				</svg></span>
				<span class="dropdown-item-label">
					{{ t('Expand') }}
				</span>
			</div>
			<div class="dropdown-item" :title="t('Shrink Block')"
				@click="block.decrease_width()">
				<span class="dropdown-item-icon"><svg class="icon icon-sm">
					<use class="" href="#icon-shrink"></use>
				</svg></span>
				<span class="dropdown-item-label">
					{{ t('Shrink') }}
				</span>
			</div>
			<div class="dropdown-item" :title="t('Move Up')"
				@click="block.move_block('up')">
				<span class="dropdown-item-icon"><svg class="icon icon-sm">
					<use class="" href="#icon-up-arrow"></use>
				</svg></span>
				<span class="dropdown-item-label">
					{{ t('Move Up') }}
				</span>
			</div>
			<div class="dropdown-item" :title="t('Move Down')"
				@click="block.move_block('down')">
				<span class="dropdown-item-icon"><svg class="icon icon-sm">
					<use class="" href="#icon-down-arrow"></use>
				</svg></span>
				<span class="dropdown-item-label">
					{{ t('Move Down') }}
				</span>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { inject, ref } from 'vue';


const hidden = ref(true);
const block = inject('__tianjy_workspace:Block__') as any;
const has = Boolean(block);


const t = __;

</script>
