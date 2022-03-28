<template>
  <ul class="mb-2">
    <li v-for="item in levels" :key="item.url">
      <template v-if="!item.url">
        <h5 class="transition duration-100 font-bold py-2">{{ item.label }}</h5>
        <SecondLevels :children="item.children" />
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
  padding-left: 12px;
}
</style>
