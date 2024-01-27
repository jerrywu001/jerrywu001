<template>
  <Html lang="zh-CN">
    <Head>
      <Title>Blog of Jerrywu001</Title>
      <Meta name="description" content="A front-end development blog of jerrywu, includes js,node,vue,react,css,linux, eg."></Meta>
      <Meta name="keywords" content="vue3-toastify,sandpack-vue3,vitepress-sandbox,js-bridge,jerrywu001"></Meta>
      <Meta name="author" content="jerrywu001"></Meta>

      <Link rel="author" href="/"></Link>
      <Link rel="icon" href="/favicon.ico"></Link>
      <Link rel="canonical" href="https://www.js-bridge.com/"></Link>

      <Link rel="alternate" hreflang="zh" href="https://www.js-bridge.com/"></Link>
      <Link rel="alternate" hreflang="x-default" href="https://www.js-bridge.com/"></Link>

      <Meta property="og:title" content="Blog of Jerrywu001"></Meta>
      <Meta property="og:description" content="A front-end development blog of jerrywu, includes js,node,vue,react,css,linux, eg."></Meta>
      <Meta property="og:locale" content="zh-CN"></Meta>
      <Meta property="og:url" content="https://www.js-bridge.com/"></Meta>
      <Meta property="og:site_name" content="Blog of Jerrywu001"></Meta>
      <Meta property="og:image" content="https://www.js-bridge.com/head.jpg"></Meta>
      <Meta property="og:type" content="website"></Meta>

      <Meta name="twitter:card" content="summary_large_image"></Meta>
      <Meta name="twitter:site" content="@jerrywu185"></Meta>
      <Meta name="twitter:title" content="Blog of Jerrywu001"></Meta>
      <Meta name="twitter:description" content="A front-end development blog of jerrywu, includes js,node,vue,react,css,linux, eg."></Meta>
      <Meta name="twitter:image" content="https://www.js-bridge.com/head.jpg"></Meta>
    </Head>
  </Html>

  <NuxtLayout name="default" title="Home">
    <div
      class="index bg-white h-[100vh] overflow-y-auto overflow-x-hidden dark:bg-slate-900 dark:text-white/80"
    >
      <header class="sticky top-0 flex justify-end py-5 px-3 z-50">
        <div class="h-ls flex gap-3 text-sm max-md:hidden">
          <NuxtLink class="h-l" to="/tags/all" rel="nofollow">Tags</NuxtLink>
          <NuxtLink class="h-l" to="/about-me" rel="nofollow">About me</NuxtLink>
          <NuxtLink class="h-l" to="/sponsor-me" rel="nofollow">Sponsor me</NuxtLink>
        </div>
        <blog-nav-tools :index="true" />
      </header>

      <div class="mt-[-55px] ml-5">
        <img class="w-[70px] dark:hidden" src="/logo/light.png" alt="theme" />
        <img class="w-[70px] hidden dark:block" src="/logo/dark.png" alt="theme-dark" />
      </div>

      <div class="font-semibold z-30 w-fit sticky top-5 leading-5 text-indigo-700 mx-5 mt-8 dark:text-indigo-500">
        <span class="i-lucide-mouse-pointer-click mr-1" /> RECENTLY POSTS
      </div>

      <blog-skeleton
        v-if="loading"
        :visible="loading"
        class="mt-8"
      />
      <div v-else class="mt-5 relative">
        <div
          v-for="item in blogs"
          :key="item.postId"
          class="block sm:h-[170px] transition-colors pt-6 px-5 w-full select-none all:transition-400 max-sm:active:bg-gray-100/80 max-sm:dark:active:bg-slate-800"
        >
          <NuxtLink class="flex gap-5" :to="`/post/${item.postId}`">
            <div v-if="item.cover" class="w-[180px] h-28 max-sm:hidden">
              <img class="w-[180px] h-28 rounded-md object-cover shadow-md" :src="item.cover" alt="cover">
            </div>
            <div class="flex flex-col flex-1 gap-2 items-start relative">
              <div class="title text-base font-medium text-slate-900 dark:text-slate-100">{{ item.title }}</div>
              <p
                class="text-slate-500 text-sm dark:text-slate-400"
              >
                {{ item.description || '暂无描述' }}
              </p>
              <a class="flex items-center text-xs text-slate-400 pt-1 sm:absolute bottom-0 left-0">
                {{ getDateTimeStr(item.createdAt) }}
              </a>
              <a class="flex items-center text-sm pt-1 font-semibold absolute bottom-0 right-0 max-sm:block">
                read more <icon-more class="ml-1 w-4 h-4 inline-block transition-transform duration-300" />
              </a>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { type IBlog } from '~~/types';

definePageMeta({ layout: false });

const { posts, scrollTop } = usePostCache();
const blogs = ref<IBlog[]>([]);
const loading = ref(false);

const fetchAllPosts = async () => {
  if (posts.value.length) {
    // @ts-ignore
    blogs.value = posts.value as IBlog[];
  } else {
    loading.value = true;
    const { data } = await useFetch('/api/post/recently', { method: 'POST' });
    // @ts-ignore
    blogs.value = data.value as IBlog[];
    // @ts-ignore
    posts.value = data.value as IBlog[];
    loading.value = false;
  }

  nextTick(() => {
    setTimeout(() => {
      if (process.client) {
        initHoverClasses();
        const scroller = document.querySelector('.bg-white');
        if (scroller) {
          scroller.scrollTop = scrollTop.value;
        }
      }
    }, 100);
  });
};

const initHoverClasses = () => {
  if (process.client && blogs.value?.length > 0) {
    const count = blogs.value?.length;
    let styleStr = '@media (min-width: 640px) {';

    for (let i = 0, len = count; i <= len - 1; i++) {
      styleStr += `
        .block:nth-child(${i + 1}):hover~.block:last-child:before {
          --y: calc(var(--height) * ${i});
        }
      `;
    }

    styleStr += `.block:nth-child(${count}):hover::before {
      --y: calc(var(--height) * ${count - 1});
        opacity: .06;
      }
    }`;

    // create style tag, inject styleStr
    const styleTag = document.getElementById('hover-classes');
    if (styleTag) styleTag.remove();

    const style = document.createElement('style');
    style.id = 'hover-classes';
    style.innerHTML = styleStr;
    document.head.appendChild(style);
  }
};

const scrollHandler = () => {
  const scroller = document.querySelector('.bg-white');
  scrollTop.value = scroller?.scrollTop || 0;
};

const resolveHandler = (unmount = false) => {
  if (process.client) {
    nextTick(() => {
      const scroller = document.querySelector('.bg-white');
      if (scroller) {
        scroller[unmount ? 'removeEventListener' : 'addEventListener']('scroll', scrollHandler, false);
      }
    });
  }
};

fetchAllPosts();

useAuthCallbackError();

onMounted(() => {
  resolveHandler();
});

onBeforeUnmount(() => {
  resolveHandler(true);
});
</script>

<style lang="postcss" scoped>
.block {
  &::after {
    content: '';
    display: block;
    height: 1px;
    background-color: #d9dde2;
    transform: scaleY(0.3);
    margin-top: 22px;
  }

  p {
    @apply line-clamp-3 text-ellipsis max-sm:line-clamp-5;
  }

  svg {
    @apply text-indigo-700;
  }

  &:hover {
    svg {
      @apply translate-x-2;
    }
  }

  &:hover {
    .title {
      @apply text-indigo-700 dark:text-slate-300;
    }
  }
}

a {
  -webkit-tap-highlight-color: transparent
}

@screen sm {
  .block {
    --height: 170px;
    --surface-2: #767676;
    --surface-0: #181818;

    &::after {
      margin-top: 32px;
    }

    &:last-child {
      &::before {
        content: "";
        display: block;
        position: absolute;
        background: var(--surface-2);
        opacity: 0;
        width: 100%;
        top: var(--y);
        left: 0;
        height: var(--height);
        border-radius: .4rem;
        transform: scale(1.04);
        pointer-events: none;
        transition: all .5s cubic-bezier(.2,1,.2,1);
      }
    }
  }

  .block:hover~.block:last-child:before {
    opacity: .06;
    transform: scale(1);
  }
}

.dark {
  @screen sm {
    .block:hover~.block:last-child:before {
      opacity: .2;
    }
  }
}

</style>

<style lang="postcss">
.index .hamburger .container {
  top: -2px !important;
}
</style>
