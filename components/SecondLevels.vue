<template>
  <ul class="mb-2 pl-3 overflow-hidden">
    <li v-for="item in children" :key="item.url">
      <template v-if="!item.url && item.children">
        <h5
          v-show="item.children.length > 0"
          :data-depth="`${item.depth}`"
          class="cursor-pointer flex font-bold opacity-95 py-2 transition duration-100 sidebar-tag items-center"
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
          class="border-l border-gray-100 text-sm py-1 pl-3 transition text-gray-700 duration-100 relative inline-flex items-center justify-between dark:border-dark-400 dark:text-gray-400 hover:text-primary hover:dark:text-primary"
          :class="[
            currentPath === item.url
              ? 'active !text-primary dark:text-primary !border-primary dark:border-primary'
              : '',
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
