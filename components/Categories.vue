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

const dirs = computed(() => ([...props.categories] || []) as ICategory[]);

function toggleDirs(e: MouseEvent) {
  const target = e.currentTarget as HTMLHeadingElement;
  if (target) {
    const depth = Number(target.dataset.depth);
    const ul = target.nextElementSibling as HTMLUListElement;
    const hidden = parseInt(ul.style.height, 10) === 0;
    const icon = target.querySelector('.icon');
    if (depth === 1) {
      if (hidden) {
        icon.classList.remove('rotate-270');
        icon.classList.add('rotate-0');
        ul.style.height = `${ul.dataset.height}px`;
      } else {
        icon.classList.add('rotate-270');
        icon.classList.remove('rotate-0');
        ul.style.height = '0';
      }
    }
  }
}

tryOnMounted(() => {
  nextTick(() => {
    const tags = document.querySelectorAll('.sidebar-tag');
    for (const tag of tags) {
      const ul = tag.nextElementSibling as HTMLUListElement;
      if (ul && ul.tagName.toUpperCase() === 'UL') {
        ul.style.height = `${ul.clientHeight}px`;
        ul.dataset.height = `${ul.clientHeight}`;
        tag.addEventListener('click', toggleDirs, false);
      }
    }
  });
});

tryOnBeforeUnmount(() => {
  const tags = document.querySelectorAll('.sidebar-tag');
  for (const tag of tags) {
    const ul = tag.nextElementSibling as HTMLUListElement;
    if (ul && ul.tagName.toUpperCase() === 'UL') {
      tag.removeEventListener('click', toggleDirs, false);
    }
  }
});
</script>
