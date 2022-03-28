<template>
  <ul class="dirs py-4 px-4 lg:pt-0">
    <SecondLevels :children="dirs" />
  </ul>
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
