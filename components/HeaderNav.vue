<template>
  <div
    class="flex h-$header-height bg-white/95 w-full px-4 top-0 z-50 header-box items-center justify-between sticky dark:bg-slate-900/90"
  >
    <div class="flex">
      <span
        class="cursor-pointer mr-2 text-gray-600 block i-carbon-list !h-6 !w-6 lg:hidden dark:text-[#92adad] hover:opacity-80"
        @click="emit('toggle-sidebar')"
      />
      <NuxtLink
        to="/"
        class="font-bold text-base !text-[#333] !dark:text-white"
      >
        前端博文
      </NuxtLink>
    </div>
    <div class="flex">
      <a
        class="cursor-pointer mx-2 text-gray-600 block i-carbon-logo-github !h-6 !w-6 dark:text-[#92adad] hover:opacity-80"
        href="https://github.com/jerrywu001/jerrywu001"
        target="_blank"
      />
      <span
        class="cursor-pointer mx-2 text-gray-600 block i-ph-sun-fill !h-6 !w-6 dark:text-[#92adad] dark:i-ph-moon-fill hover:opacity-80"
        @click="emit('toggle-theme')"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
interface IEmit {
  (event: 'toggle-sidebar'): void;
  (event: 'toggle-theme'): void;
}

const emit = defineEmits<IEmit>();

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
