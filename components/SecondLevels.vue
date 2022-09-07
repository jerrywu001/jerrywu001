<template>
  <ul class="mb-2 pl-2 overflow-hidden">
    <li v-for="item in children" :key="item.url">
      <template v-if="!item.url && item.children">
        <h5
          v-show="item.children.length > 0"
          :data-depth="`${item.depth}`"
          class="cursor-pointer flex font-bold font-semibold opacity-95 py-2 transition text-slate-900 duration-100 sidebar-tag items-center !text-sm dark:text-slate-200"
        >
          <span>{{ item.label }}</span>
          <span
            v-if="item.depth === 1"
            class="h-4 transform transition-transform w-4 rotate-0 icon i-carbon-chevron-down inline-block"
          />
        </h5>
        <SecondLevels
          v-show="item.children.length > 0"
          :children="item.children"
        />
      </template>
      <template v-else>
        <NuxtLink
          :to="item.url"
          class="border-l -ml-px border-slate-100 py-1 pl-2 transition text-slate-700 block !text-sm dark:border-slate-800 dark:text-slate-400 hover:border-slate-400 hover:text-slate-900 dark:hover:border-slate-500 dark:hover:text-slate-300"
          :class="[
            currentPath === item.url ? ' !border-sky-500 !text-sky-500' : '',
          ]"
        >
          {{ item.label }}
        </NuxtLink>
      </template>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { PropType } from 'vue';
import { ICategory } from '~~/types';

defineProps({
  children: {
    type: Array as PropType<ICategory[]>,
    default() {
      return [];
    },
  },
});

const route = useRoute();

const currentPath = computed(() => route.path);
</script>

<script lang="ts">
export default {
  name: 'SecondLevel',
};
</script>

<style>
li ul.mb-2 {
  transition: height 0.2s ease-in-out;
}
</style>
