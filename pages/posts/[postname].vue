<template>
  <Html>
    <Head>
      <Title>{{ title }}</Title>
      <Meta name="description" :content="description" />
    </Head>
  </Html>
  <header-nav @toggle-sidebar="toggleSidebar" @toggle-theme="toggleDark" />
  <sidebar :visible="showSidebar" :categories="dirs" @close="toggleSidebar" />
  <article class="article">
    <table-of-contents
      class="tocs-sm lg:ml-$sidebar-width lg:w-$tocs-width-lg xl:hidden"
      :children="tocs"
    />
    <div class="article-info lg:ml-$sidebar-width">
      <Skeleton v-show="loading" />
      <article-content
        v-show="!loading"
        class="mt-2 px-4 article-scroll-box sm:px-6 xl:mr-$tocs-width xl:mt-0"
        :children="children"
        :meta="meta"
      />
      <table-of-contents
        class="xl:h-$tocs-height-xl xl:top-$header-height xl:left-$tocs-ml-xl xl:w-$tocs-width xl:fixed <xl:hidden"
        :children="tocs"
        :is-pc="true"
      />
      <div
        v-show="!loading && createTime"
        class="flex flex-col mb-4 px-4 text-gray-500 justify-between dark:text-white/70"
      >
        <span
          class="flex text-xs text-sm text-opacity-50 items-center xl:mr-$tocs-width"
        >
          create at {{ createTime }}
        </span>
      </div>
    </div>

    <div
      id="back-2-top"
      draggable="true"
      class="rounded-full bg-black-500/50 h-10 right-2 bottom-21 w-10 z-50 fixed items-center justify-center hidden dark:bg-white/90"
    >
      <span
        class="bg-white h-4 i-carbon-back-to-top block !w-4 dark:bg-black/90"
      />
    </div>

    <div
      id="comment"
      draggable="true"
      class="rounded-full flex bg-black-500/50 h-10 right-2 bottom-8 w-10 z-50 fixed items-center justify-center dark:bg-white/90"
    >
      <span
        class="bg-white h-4 i-carbon-document block !w-4 dark:bg-black/90"
      />
    </div>
  </article>
</template>

<script setup lang="ts">
// https://www.cnblogs.com/guangzan/p/15021560.html
import {
  addArchorClickEvent,
  useArticleScroll,
  useGitTalk,
} from '~~/utils/toc';
import { IArticleData, IElement, IMeta, ITableOfContent } from '~~/types';
import useImgSwipe from '~~/utils/imgSwipe';

/** ============= page meta define ============= */
definePageMeta({
  layout: 'page',
  pageTransition: false,
  layoutTransition: false,
  key: (route) => route.fullPath,
});

/** ============= route state ============= */
const route = useRoute();
const postname = route.params.postname;

/** ============= data state ============= */
const data = ref<IArticleData>();
const loading = ref(true);
const showSidebar = ref(false);
const { dirs, updateDirs } = useCategories();
const { toggleDark } = useDarkTheme();

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

const createTime = computed(() => {
  const date = meta.value.createAt;
  if (date) {
    const dateObj = new Date(date);
    let month = String(dateObj.getMonth() + 1);
    let day = String(dateObj.getDate());
    month = month.length === 1 ? `0${month}` : month;
    day = day.length === 1 ? `0${day}` : day;
    return `${dateObj.getFullYear()}-${month}-${day}`;
  }
  return '';
});

/** ============= methods ============= */
function toggleSidebar() {
  showSidebar.value = !showSidebar.value;
}

async function loadData(forceUpdate = false) {
  loading.value = true;
  // eslint-disable-next-line prettier/prettier
  const res = await useFetch<IArticleData>(`/api/post?postname=${postname}`, {
    initialCache: false,
  });

  data.value = res.data.value;
  loading.value = false;

  if (!dirs.value.length || forceUpdate) {
    // 更新分类缓存
    updateDirs(res.data.value?.categories);
  }

  if (data.value?.code === 404) {
    if (process.client) {
      window.location.href = '/404';
    }
  } else if (process.client) {
    nextTick(() => {
      addArchorClickEvent();
    });
  }
}

/** ============= load data on init ============= */
loadData();

/** ============= hooks ============= */
useImgSwipe(loading);
useArticleScroll();
useGitTalk();

if (process.client) {
  const ws = new WebSocket('ws://localhost:8080');
  ws.onclose = function (e) {
    console.log('webscoket connect closed');
  };
  ws.onerror = function () {
    console.log('webscoket connect failed');
  };
  ws.onmessage = (e) => {
    if (e.data && typeof e.data === 'string' && e.data.endsWith('.md')) {
      // setTimeout(() => {
      //   loadData(true);
      // }, 600);
      window.location.reload();
    }
  };
}
</script>

<style lang="postcss">
@import url('prismjs/plugins/line-numbers/prism-line-numbers.css');
@import url('prismjs/plugins/inline-color/prism-inline-color.min.css');
@import url('prismjs/plugins/diff-highlight/prism-diff-highlight.min.css');
@import url('prismjs/plugins/treeview/prism-treeview.min.css');
@import url('prismjs/plugins/command-line/prism-command-line.min.css');
@import url('prismjs/plugins/show-invisibles/prism-show-invisibles.min.css');
@import url('unified-remark-prismjs/src/style.css');
@import url('~~/assets/gittalk.css');
</style>
