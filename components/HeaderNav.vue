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
      <a
        class="cursor-pointer mx-2 !w-6 !h-6 block text-gray-600 i-carbon-logo-github hover:opacity-80 dark:text-[#92adad]"
        href="https://github.com/jerrywu001/jerrywu001"
        target="_blank"
      />
      <span
        class="cursor-pointer mx-2 !w-6 !h-6 block text-gray-600 i-ph-sun-fill hover:opacity-80 dark:i-ph-moon-fill dark:text-[#92adad]"
        @click="toggleDark()"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useTheme } from '~~/utils/useTheme';

interface IEmit {
  (event: 'toggle-sidebar'): void;
}

const { toggleDark } = useTheme();

const emit = defineEmits<IEmit>();
</script>

<style lang="postcss">
.theme-ico {
  width: 1.5rem;
  height: 1.5rem;
}
</style>
