<template>
  <div class="flex flex-wrap">
    <div v-for="item in tags" :key="item.id">
      <div class="tag" :class="colorClassName()">{{ item.name }}</div>
    </div>
    <!-- ignore -->
    <div v-show="false" class="tag bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-900 dark:text-fuchsia-300">Vue</div>
    <div v-show="false" class="tag bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300">Vue</div>
    <div v-show="false" class="tag bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">Vue</div>
    <div v-show="false" class="tag bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-300">React</div>
    <div v-show="false" class="tag bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">Nodejs</div>
    <div v-show="false" class="tag bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Css</div>
    <div v-show="false" class="tag bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">Svg</div>
    <div v-show="false" class="tag bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300">pnpm</div>
    <div v-show="false" class="tag bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">bun</div>
    <div v-show="false" class="tag bg-pink-100 text-pink-800  dark:bg-pink-900 dark:text-pink-300">Git</div>
    <div v-show="false" class="tag bg-orange-100 text-orange-800  dark:bg-orange-900 dark:text-orange-300">Git</div>
  </div>
</template>

<script setup lang="ts">
import { PropType } from 'nuxt/dist/app/compat/capi';
import { Tag } from '~~/types';

const props = defineProps({
  data: {
    type: Array as PropType<Array<Tag>>,
    default() {
      return [];
    },
  },
});

const tags = ref(props.data);

watchEffect(() => {
  tags.value = props.data;
});

const colors = [
  'blue',
  'gray',
  'red',
  'green',
  'yellow',
  'indigo',
  'purple',
  'pink',
  'teal',
  'fuchsia',
  'orange',
];

const randomColor = () => {
  const index = Math.floor(Math.random() * colors.length);
  return colors[index];
};

const colorClassName = () => {
  const color = randomColor();
  return `bg-${color}-100 text-${color}-800 dark:bg-${color}-${color === 'gray' ? 600 : 900} dark:text-${color}-300`;
};
</script>

<style lang="postcss" scoped>
.tag {
  @apply text-xs font-medium mr-3 mb-4 cursor-pointer hover:opacity-80 px-2.5 py-0.5 rounded h-fit;
}
</style>
