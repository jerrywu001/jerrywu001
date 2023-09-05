<template>
  <button
    type="button"
    class="bd-btn bd-btn-focus"
    :class="{ disabled, loading }"
    @click="$emit('click')"
  >
    <icon-loading-white :class="{ hidden: !loading }" />
    <span>{{ name }}</span>
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
  @apply flex items-center justify-center w-full px-6 py-3 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-500 rounded-lg select-none;

  &.loading {
    @apply opacity-50 pointer-events-none;
  }

  &.disabled {
    @apply pointer-events-none bg-gray-200 text-gray-500 dark:bg-gray-400 dark:text-gray-700;

    svg {
      @apply hidden;
    }
  }

  &-focus:not(.disabled) {
    @apply hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50;
  }
}
</style>
