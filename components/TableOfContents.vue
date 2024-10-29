<template>
  <div
    v-show="children.length > 0"
    class="flex-none bg-white/95 top-$header-height text-xs w-full px-4 left-0 z-10 tocs overflow-hidden sticky sm:px-6 lg:left-60 dark:bg-slate-900/90"
    :class="`${isPc ? 'h-auto' : 'h-10'}`"
  >
    <span
      class="cursor-pointer flex font-semibold text-xs w-full text-gray-900 z-10 relative tocs-btn items-center dark:border-b-white/30 dark:text-gray-100 hover:text-opacity-60 hover:no-underline focus:outline-none"
      :class="[
        !isPc ? 'border-dashed border-b border-b-gray-900/30 ' : '',
        isPc ? 'h-auto' : 'h-10',
      ]"
      @click="
        () => {
          if (!isPc) {
            toggleTocs();
          }
        }
      "
    >
      IN THIS ARTICLE
      <a
        v-show="!isPc"
        class="text-sm mr-1 text-dark/80 i-carbon-chevron-right dark:text-white/80"
      />
    </span>
    <div class="flex-col pb-2 justify-between overflow-y-auto sticky">
      <div
        class="pr-3 overflow-x-hidden overflow-y-auto box-border"
        :class="`${!isPc ? 'max-h-[50vh]' : 'h-$tocs-height-xl'}`"
      >
        <SecondTocs :children="children" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type PropType } from 'vue';
import { type ITableOfContent } from '~~/types';
import { toggleTocs } from '~~/utils/toc';

defineProps({
  children: {
    type: Array as PropType<ITableOfContent[]>,
    default() {
      return [];
    },
  },
  isPc: {
    type: Boolean,
    default: false,
  },
});
</script>
