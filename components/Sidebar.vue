<template>
  <aside
    class="sidebar fixed z-50 lg:z-0 lg:left-0 lg:top-$header-height xl:left-$sidebar-ml-xl"
  >
    <div class="h-full pointer-events-none">
      <div
        id="sidebar-layer"
        class="fixed backdrop-filter backdrop-blur-sm top-0 left-0 z-0 w-full h-full bg-gray-200/50 pointer-events-auto dark:bg-dark-800/80 lg:hidden hidden"
        @click="emit('close')"
      />
      <div
        id="sidebar-content"
        class="fixed top-0 left-0 w-$sidebar-width h-full pointer-events-auto lg:sticky"
      >
        <div class="w-full h-full bg-white dark:bg-[#001e26]">
          <div class="h-full overflow-y-auto d-scrollbar">
            <categories :categories="props?.categories" />
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>

<script lang="ts" setup>
import { ICategory } from '~~/types';

interface IEmit {
  (event: 'close'): void;
}

const props = defineProps({
  categories: {
    type: Array,
    default() {
      return [] as ICategory[];
    },
  },
});

const emit = defineEmits<IEmit>();

const loaded = ref(false);

tryOnMounted(() => {
  loaded.value = true;
});
</script>

<style lang="scss">
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
