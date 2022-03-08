<template>
  <Link
    class="button-link"
    :class="[size, bold ? 'font-semibold' : 'font-medium']"
    :to="href"
  >
    <slot />

    <template #href>
      <svg
        v-if="outLink"
        class="w-4 h-4 ml-2"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
        />
      </svg>
    </template>
  </Link>
</template>

<script setup lang="ts">
const props = defineProps({
  href: {
    type: String,
    default: '',
  },
  size: {
    type: String,
    default: 'medium',
  },
  bold: {
    type: Boolean,
    default: false,
  },
});

const outLink = computed(() => props.href.includes('//'));
</script>

<style lang="postcss" scoped>
a.button-link {
  @apply border-transparent inline-flex items-center flex-none mb-2 text-xs px-3 py-1.5 border-1 rounded-md text-black bg-[var(--primary-500)] duration-200 ease-in-out hover:bg-[var(--primary-400)] focus:outline-transparent;
  transition-property: background-color, border-color, color, fill, stroke;
}

a.button-link.medium {
  @apply text-xs;
  padding: 0.35rem 1rem;
}

a.button-link.large {
  font-size: 0.875rem;
  line-height: 1.25rem;
  padding: 0.625rem 1rem;
}
</style>
