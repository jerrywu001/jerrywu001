<template>
  <ul class="py-4 px-4 dirs lg:pt-0">
    <SecondLevels :children="categories" />
  </ul>
</template>

<script setup lang="ts">
import { PropType } from 'vue';
import { ICategory } from '~~/types';

defineProps({
  categories: {
    type: Array as PropType<ICategory[]>,
    default() {
      return [];
    },
  },
});

function toggleDirs(e: any) {
  const target = e.currentTarget as HTMLHeadingElement;
  if (target) {
    const depth = Number(target.dataset.depth);
    const ul = target.nextElementSibling as HTMLUListElement;
    const hidden = parseInt(ul.style.height, 10) === 0;
    const icon = target.querySelector('.icon');
    if (depth === 1) {
      if (hidden) {
        icon!.classList.remove('rotate-270');
        icon!.classList.add('rotate-0');
        ul.style.height = `${ul.dataset.height}px`;
      } else {
        icon!.classList.add('rotate-270');
        icon!.classList.remove('rotate-0');
        ul.style.height = '0';
      }
    }
  }
}

tryOnMounted(() => {
  nextTick(() => {
    setTimeout(() => {
      const tags = document.querySelectorAll('.sidebar-tag');
      for (const tag of tags) {
        const ul = tag.nextElementSibling as HTMLUListElement;
        if (ul && ul.tagName.toUpperCase() === 'UL') {
          ul.style.height = `${ul.clientHeight}px`;
          ul.dataset.height = `${ul.clientHeight}`;
          tag.addEventListener('click', toggleDirs, false);
        }
      }
    }, 300);
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
