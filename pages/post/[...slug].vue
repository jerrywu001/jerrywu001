<template>
  <!-- header -->
  <header id="header" class="common-bg header">
    <NuxtLink to="/">前端博文</NuxtLink>
    <div class="flex items-center">
      <div class="h-ls flex gap-2 text-sm max-md:hidden">
        <NuxtLink class="h-l" to="/">Blogs</NuxtLink>
        <NuxtLink class="h-l" to="/">Projects</NuxtLink>
      </div>
      <blog-nav-tools />
    </div>
  </header>

  <div class="common-bg sub-header">
    <div class="l flex items-center gap-2" @click="toggleSidebar">
      <icon-menu class="w-4 h-4" />
      <span>All Tags</span>
    </div>
    <div id="small-tocs-tag" class="l flex items-center">
      <span>On this page</span>
      <icon-arrow class="w-4 h-4" />
    </div>
  </div>
  <!-- table of content for small screen -->
  <div
    id="tocs-app-container"
    class="fixed hidden opacity-0 translate-x-[calc(100vw-300px)] translate-y-[-505px] transition-all duration-200 ease-in-out z-50 w-[280px] !max-h-80 !overflow-y-auto rounded-lg shadow-lg px-6 text-base bg-white text-slate-900 dark:bg-slate-800 dark:text-slate-400"
  >
    <blog-tocs
      id="tocs-app"
      class="lg:!hidden !w-auto !p-0 !relative !h-auto"
      :visible="loaded"
      :data="post"
    />
  </div>

  <main class="main">
    <!-- sidebar -->
    <blog-sidebar :slide-in="showSidebar" @close="toggleSidebar" />

    <blog-skeleton :visible="!loaded" />

    <!-- article content -->
    <blog-content :visible="loaded" :data="post" />
    <!-- table of content -->
    <blog-tocs
      id="tocs"
      class="max-lg:!hidden"
      :visible="loaded"
      :data="post"
    >
      <div class="tocs-tag">On this page</div>
    </blog-tocs>
  </main>

  <!-- back to top icon -->
  <div
    id="back-2-top"
    draggable="true"
    class="rounded-full bg-black/50 h-10 right-5 bottom-10 w-10 z-50 fixed items-center justify-center hidden dark:bg-slate-600/90"
  >
    <span
      class="bg-white h-4 i-lucide-arrow-up-to-line block !w-4"
    />
  </div>
</template>

<script setup lang="ts">
import useImgSwipe from '~~/utils/imgSwipe';
import { IBlog } from '~~/types';
import { toggleVisibleAnimation } from '~/utils/utils';

const route = useRoute();
const { cacheKeys } = usePostCache();
const { public: runtimeConfig } = useRuntimeConfig();

const { params: { slug } } = route;
const [id] = slug || [];

const showSidebar = ref(false);
const post = ref<IBlog | null>();

const loaded = computed(() => !!post.value?.postId);

const toggleSidebar = () => {
  showSidebar.value = !showSidebar.value;
};

const queryPost = async () => {
  post.value = null;
  const { data } = await useFetch(`${runtimeConfig.baseUrl}/api/post/${id}`, { key: id, method: 'POST', body: { cacheKeys: toRaw(cacheKeys) } });
  // @ts-ignore
  post.value = data.value as IBlog;
  if (post.value?.postId) cacheKeys.value[post.value.postId] = true;

  try {
    useFetch(`${runtimeConfig.baseUrl}/api/post/${id}/reads`);
  } catch (error) {
    // ignore
  }
};

const tocsEvent = (e: MouseEvent) => {
  const target = e.target as HTMLElement;
  const tocs = document.getElementById('tocs-app-container');
  const clickOnTag = document.querySelector('#small-tocs-tag')?.contains(target) || !!tocs?.contains(target);
  toggleVisibleAnimation(clickOnTag && !!tocs?.classList?.contains('hidden'), tocs);
};

queryPost();

// init image swipe
useImgSwipe(loaded);

onMounted(() => {
  nextTick(() => {
    if (process.client) {
      document.body.addEventListener('click', tocsEvent, false);
    }
  });
});

onBeforeUnmount(() => {
  if (process.client) {
    document.body.removeEventListener('click', tocsEvent, false);
  }
});
</script>

<style lang="postcss">
@import url(@/assets/css/blog.css);
</style>
