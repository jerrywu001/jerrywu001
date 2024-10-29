<template>
  <ol v-if="children.length > 0" class="font-medium table-of-contents">
    <li v-for="item in children" :key="item.archor">
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
import { type PropType } from 'vue';
import { type ITableOfContent } from '~~/types';
import { scrollToHeading } from '~~/utils/toc';

defineProps({
  children: {
    type: Array as PropType<ITableOfContent[]>,
    default() {
      return [];
    },
  },
});
</script>

<script lang="ts">
export default { name: 'SecondTocs' };
</script>

<style lang="postcss">
.table-of-contents {
  .toc-link {
    @apply py-1 transform transition-colors duration-100 block;
    font-weight: 400;

    &.active {
      @apply font-bold underline decoration-dotted underline-offset-2;
    }
  }
}

.dark {
  .table-of-contents {
    .toc-link {
      &.active {
        @apply text-white/95;
      }
    }
  }
}
</style>
