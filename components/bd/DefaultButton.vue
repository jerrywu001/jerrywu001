<template>
  <button
    class="bd-btn bd-btn-focus w-full"
    :class="{ disabled, loading }"
    @click="$emit('click')"
  >
    <slot />
    <icon-loading :class="{ hidden: !loading }" />
    <span class="mx-2">{{ name }}</span>
  </button>
</template>

<script setup lang="ts">
defineProps({
  name: {
    type: String,
    default: '',
  },
  loading: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

defineEmits(['click']);
</script>

<style lang="postcss" scoped>
.bd-btn {
  @apply flex items-center justify-center px-6 py-3 mt-4 text-gray-600 transition-colors duration-300 transform border rounded-lg;

  &.loading,
  &.disabled {
    @apply opacity-70 pointer-events-none;
  }

  &.disabled {
    @apply dark:border-gray-50/20;
  }

  &-focus:not(.disabled) {
    @apply dark:border-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600;
  }
}
</style>
