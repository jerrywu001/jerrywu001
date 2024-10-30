<template>
  <div id="docsearch" class="max-md:mr-3" :class="[index ? 'fix-top' : '']"></div>
</template>

<script setup lang="ts">
import docsearch from '@docsearch/js';
import '@docsearch/css';

defineProps({
  index: {
    type: Boolean,
    default: false,
  },
});

onMounted(() => {
  nextTick(() => {
    if (import.meta.client) {
      docsearch({
        appId: 'SKCYNAKILD',
        apiKey: 'eda24ec76be8debf3862d6ecbfa13b3c',
        indexName: 'js-bridge',
        insights: true, // Optional, automatically send insights when user interacts with search results
        container: '#docsearch',
        transformItems(items) {
          return items.map((item) => ({
            ...item,
            url: new URL(item.url).pathname,
          }));
        },
      });
    }
  });
});
</script>

<style lang="postcss">
.fix-top {
  position: relative;
  top: -6px !important;
}

@media (max-width: 640px) {
  .DocSearch-Button {
    @apply !bg-transparent !m-0 !p-[6px];
  }
}
</style>
