<template>
  <ol v-if="tocs.length > 0" class="table-of-contents font-medium">
    <li v-for="item in tocs" :key="item.archor">
      <a
        :href="item.archor"
        :class="item.class"
        @click="scrollToHeading($event, item.archor)"
      >
        {{ item.label }}
      </a>
      <SecondTocs :children="item.children" />
    </li>
  </ol>
</template>

<script setup lang="ts">
import { ITableOfContent } from '~~/types';
import { scrollToHeading } from '~~/utils/toc';

const props = defineProps({
  children: {
    type: Array,
    default() {
      return [] as ITableOfContent[];
    },
  },
});

const tocs = computed(() => (props.children as ITableOfContent[]) || []);
</script>

<script lang="ts">
export default {
  name: 'SecondTocs',
};
</script>

<style lang="scss">
.toc-link.active {
  @apply font-bold underline decoration-dotted underline-offset-2;

  .dark & {
    @apply text-white/95;
  }
}
</style>
