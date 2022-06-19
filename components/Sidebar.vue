<template>
  <aside
    class="z-50 sidebar fixed lg:top-$header-height lg:left-0 lg:z-0 xl:left-$sidebar-ml-xl"
  >
    <div class="h-full pointer-events-none">
      <div
        id="sidebar-layer"
        class="h-full bg-gray-200/50 w-full top-0 left-0 z-0 fixed backdrop-filter backdrop-blur-sm pointer-events-auto hidden lg:hidden dark:bg-dark-800/80"
        @click="emit('close')"
      />
      <div
        id="sidebar-content"
        class="h-full w-$sidebar-width top-0 left-0 fixed pointer-events-auto lg:sticky !lg:transform-none !lg:transition-none"
      >
        <div class="bg-white h-full w-full dark:bg-[#001e26]">
          <div class="h-full overflow-y-auto d-scrollbar">
            <categories :categories="categories" />
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>

<script lang="ts" setup>
import { PropType } from 'vue';
import { ICategory } from '~~/types';

interface IEmit {
  (event: 'close'): void;
}

defineProps({
  categories: {
    type: Array as PropType<ICategory[]>,
    default() {
      return [];
    },
  },
});

const emit = defineEmits<IEmit>();

const loaded = ref(false);

tryOnMounted(() => {
  loaded.value = true;
});
</script>

<style lang="postcss">
.article aside ul > li::before {
  display: none;
}

#sidebar-layer {
  opacity: 0;
  &.show {
    display: block;
  }
}

#sidebar-content {
  transition: transform 0.2s ease-in-out;
  transform: translate3d(-100%, 0, 0);

  &.x-full {
    transform: translate3d(0, 0, 0);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0 !important;
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1 !important;
}

@screen lg {
  .sidebar {
    height: calc(100% - var(--header-height));
  }
}
</style>
