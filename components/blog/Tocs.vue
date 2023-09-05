<template>
  <div v-show="visible" class="tocs">
    <slot />
    <div class="flex-col pb-2 justify-between">
      <SecondTocs :children="tocs" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useArticleScroll, addArchorClickEvent } from '~~/utils/toc';
import { ITableOfContent, IBlog } from '~~/types';

const props = defineProps({
  data: {
    type: Object as PropType<IBlog | null>,
    default() {
      return null;
    },
  },
  visible: {
    type: Boolean,
    default: false,
  },
});

const tocs = computed<ITableOfContent[]>(() => {
  return props.data?.tocs || [];
});

onMounted(() => {
  nextTick(() => {
    addArchorClickEvent();
  });
});

useArticleScroll();

</script>

<style lang="postcss">
.tocs {
  @apply text-xs p-4 box-border flex flex-col w-[300px] sticky top-0 h-[calc(100vh-56px)] overflow-x-hidden overflow-y-auto;
}
</style>
