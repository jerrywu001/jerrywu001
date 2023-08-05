<template>
  <Html>
    <Head>
      <Title>{{ meta.title }}</Title>
      <Meta name="description" :content="meta.description" />
    </Head>
  </Html>

  <Body
    class="bg-white min-w-xs text-slate-500 antialiased d-scrollbar overflow-x-hidden dark:bg-slate-900 dark:text-slate-400"
  >
    <div
      class="font-montserrat text-sm w-full layout-container relative xl:text-base"
    >
      <header-nav @toggle-sidebar="toggleSidebar" @toggle-theme="toggleDark" />
      <sidebar
        :visible="showSidebar"
        :categories="categories.data"
        @close="toggleSidebar"
      />
      <slot />
    </div>
  </Body>
</template>

<script setup lang="ts">
const { categories } = useCategories();
const { meta } = usePageMeta();
const { toggleDark } = useDarkTheme();

const showSidebar = ref(false);

function toggleSidebar() {
  showSidebar.value = !showSidebar.value;
}
</script>

<style scoped>
.layout-container {
  max-width: var(--max-content-width);
  margin-left: auto;
  margin-right: auto;
}
</style>
