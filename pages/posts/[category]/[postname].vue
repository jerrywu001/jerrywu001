<template>
  <Html>
    <Head>
      <Title>{{ title }}</Title>
    </Head>
  </Html>
  <header-nav @toggle-sidebar="toggleSidebar" />
  <sidebar :visible="showSidebar" @close="toggleSidebar" />
  <article class="article">
    <table-of-contents
      class="tocs-sm xl:hidden lg:ml-$sidebar-width lg:w-$tocs-width-lg"
      :children="data?.tocs"
    />
    <div class="lg:ml-$sidebar-width">
      <article-content class="xl:mr-$tocs-width" :children="data?.children" />
      <table-of-contents
        class="xl:h-$tocs-height-xl xl:w-$tocs-width xl:fixed xl:left-$tocs-ml-xl xl:top-$header-height <xl:hidden"
        :children="data?.tocs"
        :is-pc="true"
      />
    </div>

    <div
      id="back-2-top"
      class="fixed z-50 bottom-2 right-2 w-10 h-10 bg-black-500/50 rounded-full items-center justify-center hidden dark:bg-white/90"
    >
      <span
        class="i-carbon-back-to-top block !w-4 h-4 bg-white dark:bg-black/90"
      ></span>
    </div>
  </article>
</template>

<script setup lang="ts">
// https://www.cnblogs.com/guangzan/p/15021560.html
import { useArticleScroll } from '~~/utils/toc';
import Sidebar from '~~/components/Sidebar.vue';

definePageMeta({
  layout: 'page',
  pageTransition: false,
  layoutTransition: false,
  key: (route) => route.fullPath,
});

const showSidebar = ref(false);
const route = useRoute();
const category = route.params.category;
const postname = route.params.postname;

const { data } = await useFetch<{
  meta: any;
  tocs: any[];
  children: any[];
  code: number;
}>(`/api/post?category=${category}&postname=${postname}`);

const title = computed(() => {
  return data.value.meta?.title || 'blog';
});

if (data.value.code === 404) {
  window.location.href = '/404';
}

function toggleSidebar() {
  showSidebar.value = !showSidebar.value;
}

useArticleScroll();
</script>

<style>
@import url('prismjs/plugins/line-numbers/prism-line-numbers.css');
@import url('prismjs/plugins/inline-color/prism-inline-color.min.css');
@import url('prismjs/plugins/diff-highlight/prism-diff-highlight.min.css');
@import url('prismjs/plugins/treeview/prism-treeview.min.css');
@import url('prismjs/plugins/command-line/prism-command-line.min.css');
@import url('prismjs/plugins/show-invisibles/prism-show-invisibles.min.css');
@import url('unified-remark-prismjs/src/style.css');
</style>
