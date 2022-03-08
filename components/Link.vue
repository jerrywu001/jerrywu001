<template>
  <NuxtLink v-if="!outLink" :to="to">
    <slot />
    <slot name="nuxt-link" />
  </NuxtLink>

  <a v-else :href="to" v-bind="linkAttrs">
    <slot />
    <slot name="href" />
  </a>
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
