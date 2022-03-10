<template>
  <div>
    <ul class="py-4 px-4 lg:pt-0">
      <li v-for="dir in dirs" :key="dir.label">
        <h5 class="transition duration-100 font-bold py-2">{{ dir.label }}</h5>
        <template v-if="dir.children">
          <ul class="mb-2">
            <li v-for="item in dir.children" :key="item.url">
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
            </li>
          </ul>
        </template>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ICategory } from '~~/types';

const props = defineProps({
  categories: {
    type: Array,
    default() {
      return [] as ICategory[];
    },
  },
});

const route = useRoute();

const dirs = computed<ICategory[]>(() => props.categories || []);
const currentPath = computed(() => route.path);
</script>
