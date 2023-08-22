<template>
  <NuxtLink v-if="!outLink" :to="to">
    <slot />
    <slot name="nuxt-link" />
  </NuxtLink>

  <NuxtLink
    v-else
    v-bind="linkAttrs"
    :to="to"
    external
    target="_blank"
  >
    <slot />
    <slot name="href" />
  </NuxtLink>
</template>

<script setup lang="ts">
const props = defineProps({
  to: {
    type: String,
    required: true,
  },
});

const outLink = computed(() => props.to.includes('//'));

const linkAttrs = computed(() => ({
  target: outLink.value ? '_blank' : undefined,
}));
</script>
