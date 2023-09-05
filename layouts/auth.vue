<template>
  <Html>
    <Head>
      <Title>{{ title }}</Title>
    </Head>
  </Html>
  <section class="bg-white dark:text-slate-400 dark:bg-slate-900">
    <div
      class="container flex items-center justify-center min-h-screen px-6 mx-auto max-sm:!items-start max-sm:!pt-6"
    >
      <div class="w-full max-w-md">
        <h1
          class="mt-3 text-2xl font-semibold text-gray-800 sm:text-3xl dark:text-white"
        >
          <slot name="header" />
        </h1>

        <slot />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default',
});

defineProps({
  title: {
    type: String,
    default: '',
  },
});

</script>
