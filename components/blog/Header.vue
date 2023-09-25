<template>
  <header id="header" class="common-bg header">
    <NuxtLink to="/">
      <img class="w-[70px] dark:hidden" src="/logo/light.png" />
      <img class="w-[70px] hidden dark:block" src="/logo/dark.png" />
    </NuxtLink>
    <div class="flex items-center">
      <div class="h-ls flex gap-2 text-sm max-md:hidden">
        <NuxtLink class="h-l" to="/tags/all">Tags</NuxtLink>
        <NuxtLink class="h-l" to="/about-me">About me</NuxtLink>
        <NuxtLink class="h-l" to="/sponsor-me">Sponsor me</NuxtLink>
      </div>
      <blog-nav-tools :blog="blog" />
    </div>
  </header>
</template>

<script setup lang="ts">
defineProps({
  blog: {
    type: Boolean,
    default: false,
  },
});
</script>
