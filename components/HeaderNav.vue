<template>
  <div
    class="header-box px-4 flex items-center justify-between top-0 w-full z-50 sticky bg-white/95 h-$header-height dark:bg-[#001e26]/95"
  >
    <div class="flex">
      <span
        class="cursor-pointer lg:hidden mr-2 !w-6 !h-6 block text-gray-600 i-carbon-list hover:opacity-80 dark:text-[#92adad]"
        @click="emit('toggle-sidebar')"
      />
      <NuxtLink to="/" class="text-base">前端博文</NuxtLink>
    </div>
    <div class="flex">
      <AlgoliaSearchBox :options="searchOptions" />
      <a
        class="cursor-pointer mx-2 !w-6 !h-6 block text-gray-600 i-carbon-logo-github hover:opacity-80 dark:text-[#92adad]"
        href="https://github.com/jerrywu001/jerrywu001"
        target="_blank"
      />
      <span
        class="cursor-pointer mx-2 !w-6 !h-6 block text-gray-600 i-ph-sun-fill hover:opacity-80 dark:i-ph-moon-fill dark:text-[#92adad]"
        @click="emit('toggle-theme')"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { DocSearchProps } from '@docsearch/react/dist/esm';

interface IEmit {
  (event: 'toggle-sidebar'): void;
  (event: 'toggle-theme'): void;
}

const emit = defineEmits<IEmit>();

const searchOptions = {
  // indexName: 'vuejs',
  // appId: 'ML0LEBN7FQ',
  // apiKey: 'f49cbd92a74532cc55cfbffa5e5a7d01',
  // searchParameters: {
  //   facetFilters: ['version:v3'],
  // },
  indexName: 'blog',
  appId: '667T7RWHK3',
  apiKey: '9691e71305a7c7c21c3780a5ff702cc6',
} as DocSearchProps;

let lock = false;

function toggleSidebar() {
  if (lock) return;
  lock = true;
  const layer = document.getElementById('sidebar-layer');
  const content = document.getElementById('sidebar-content');
  const isVisible = content.classList.contains('x-full');
  if (isVisible) {
    document.documentElement.classList.remove('overflow-hidden');
    document.documentElement.classList.remove('h-full');
    content.classList.remove('x-full');
    layer.classList.remove('fade-enter-active');
    layer.classList.remove('fade-enter-to');
    layer.classList.add('fade-leave-active');
    layer.classList.add('fade-leave-to');
    setTimeout(() => {
      layer.classList.remove('show');
      layer.classList.remove('fade-leave-active');
      layer.classList.remove('fade-leave-to');
      lock = false;
    }, 500);
  } else {
    document.documentElement.classList.add('overflow-hidden');
    document.documentElement.classList.add('h-full');
    content.classList.add('x-full');
    layer.classList.add('show');
    setTimeout(() => {
      layer.classList.remove('fade-leave-active');
      layer.classList.remove('fade-leave-to');
      layer.classList.add('fade-enter-active');
      layer.classList.add('fade-enter-to');
      lock = false;
    }, 0);
  }
}

tryOnMounted(() => {
  if (process.client) {
    const layer = document.getElementById('sidebar-layer');
    const icon = document.querySelector('.i-carbon-list');
    if (icon) {
      icon.addEventListener('click', toggleSidebar, false);
    }
    if (layer) {
      layer.addEventListener('click', toggleSidebar, false);
    }
  }
});

tryOnBeforeUnmount(() => {
  if (process.client) {
    const layer = document.getElementById('sidebar-layer');
    const icon = document.querySelector('.i-carbon-list');
    if (icon) {
      icon.removeEventListener('click', toggleSidebar, false);
    }
    if (layer) {
      layer.removeEventListener('click', toggleSidebar, false);
    }
  }
});
</script>

<style lang="postcss">
.theme-ico {
  width: 1.5rem;
  height: 1.5rem;
}
</style>
