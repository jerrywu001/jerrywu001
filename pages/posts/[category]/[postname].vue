<template>
  <Html>
    <Head>
      <Title>{{ title }}</Title>
      <Meta name="description" :content="description" />
    </Head>
  </Html>
  <header-nav @toggle-sidebar="toggleSidebar" />
  <sidebar :visible="showSidebar" :categories="dirs" @close="toggleSidebar" />
  <article class="article">
    <table-of-contents
      class="tocs-sm xl:hidden lg:ml-$sidebar-width lg:w-$tocs-width-lg"
      :children="tocs"
    />
    <div class="lg:ml-$sidebar-width">
      <Skeleton v-show="loading" />
      <article-content
        v-show="!loading"
        class="xl:mr-$tocs-width"
        :children="children"
        :meta="meta"
      />
      <table-of-contents
        class="xl:h-$tocs-height-xl xl:w-$tocs-width xl:fixed xl:left-$tocs-ml-xl xl:top-$header-height <xl:hidden"
        :children="tocs"
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
import {
  addArchorClickEvent,
  removeArchorClickEvent,
  useArticleScroll,
} from '~~/utils/toc';
import Sidebar from '~~/components/Sidebar.vue';
import {
  IArticleData,
  ICategory,
  IElement,
  IMeta,
  ITableOfContent,
} from '~~/types';

/** ============= page meta define ============= */
definePageMeta({
  layout: 'page',
  pageTransition: false,
  layoutTransition: false,
  key: (route) => route.fullPath,
});

/** ============= route state ============= */
const route = useRoute();
const category = route.params.category;
const postname = route.params.postname;

/** ============= data state ============= */
const data = ref<IArticleData>();
const loading = ref(true);
const showSidebar = ref(false);
const { dirs, updateDirs } = useCategories();

/** ============= computed state ============= */
const children = computed<IElement[]>(() => {
  return data.value?.children || [];
});

const tocs = computed<ITableOfContent[]>(() => {
  return data.value?.tocs || [];
});

const meta = computed<IMeta>(() => {
  return data.value?.meta || ({} as IMeta);
});

const title = computed(() => {
  return meta.value.title || '...';
});

const description = computed(() => {
  return meta.value.description || '...';
});

/** ============= methods ============= */
function toggleSidebar() {
  showSidebar.value = !showSidebar.value;
}

async function loadData() {
  loading.value = true;
  const res = await useFetch<IArticleData>(
    `/api/post?category=${category}&postname=${postname}`
  );

  data.value = res.data.value;
  loading.value = false;

  if (!dirs.value.length) {
    // 更新分类缓存
    updateDirs(res.data.value.categories);
  }

  if (data.value.code === 404) {
    window.location.href = '/404';
  } else if (process.client) {
    nextTick(() => {
      addArchorClickEvent();
    });
  }
}

/** ============= load data on init ============= */
loadData();

/** ============= hooks ============= */
useArticleScroll();

tryOnBeforeUnmount(() => {
  removeArchorClickEvent();
});
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
