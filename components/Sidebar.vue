<template>
  <aside
    class="sidebar fixed z-50 lg:z-0 lg:left-0 lg:top-$header-height xl:left-$sidebar-ml-xl"
  >
    <div class="h-full pointer-events-none">
      <div
        v-show="props.visible"
        class="fixed top-0 left-0 z-0 w-full h-full bg-gray-200 pointer-events-auto backdrop-filter backdrop-blur-sm dark:bg-dark-800 dark:bg-opacity-80 bg-opacity-50 lg:hidden"
        @click="emit('close')"
      />
      <div
        class="fixed top-0 left-0 w-$sidebar-width h-full pointer-events-auto transform lg:transform-none transition-transform duration-200 ease-linear lg:sticky"
        :class="`${visible ? '-translate-x-0' : '-translate-x-full'}`"
      >
        <div class="w-full h-full bg-white dark:bg-[#001e26]">
          <div class="h-full overflow-y-auto d-scrollbar">
            <categories />
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>

<script lang="ts" setup>
interface IEmit {
  (event: 'close'): void;
}

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits<IEmit>();

const loaded = ref(false);

tryOnMounted(() => {
  loaded.value = true;
});
</script>

<style>
.article aside ul > li::before {
  display: none;
}

@screen lg {
  .sidebar {
    height: calc(100% - var(--header-height));
  }
}
</style>
