<template>
  <ul class="mb-2 pl-3 overflow-hidden">
    <li v-for="item in levels" :key="item.url">
      <template v-if="!item.url && item.children">
        <h5
          v-show="item.children.length > 0"
          :data-depth="`${item.depth}`"
          class="sidebar-tag cursor-pointer transition duration-100 font-bold py-2 flex items-center opacity-95"
        >
          <span>{{ item.label }}</span>
          <span
            v-if="item.depth === 1"
            class="icon i-carbon-chevron-down transform transition-transform rotate-0 w-4 h-4 inline-block"
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
          class="transition duration-100 relative inline-flex items-center justify-between pl-3 py-1 border-l border-gray-100 dark:border-dark-400 text-sm text-gray-700 dark:text-gray-400 hover:text-primary hover:dark:text-primary"
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

<script lang="ts">
import { ICategory } from '~~/types';

export default {
  name: 'SecondLevel',
  props: {
    children: {
      type: Array,
      default() {
        return [] as ICategory[];
      },
    },
  },
  computed: {
    levels() {
      return [...(this.children || [])] as ICategory[];
    },
    currentPath() {
      return this.$route.path;
    },
  },
};
</script>

<style>
li ul.mb-2 {
  transition: height 0.2s ease-in-out;
}
</style>
