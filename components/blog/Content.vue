<template>
  <Html lang="zh-CN">
    <Head>
      <Title>{{ props.data?.title || 'loading...' }}</Title>
      <Meta name="description" :content="props.data?.description || defdaultDesc"></Meta>
      <Meta name="keywords" :content="props.data?.keywords || props.data?.tags?.map((t) => t.name).join(',')"></Meta>
      <Meta name="author" :content="author.nickname || 'jerrywu001'"></Meta>

      <Link rel="author" href="/"></Link>
      <Link rel="icon" href="/favicon.ico"></Link>
      <Link rel="canonical" :href="'https://www.js-bridge.com/post/' + props.data?.postId"></Link>

      <Link rel="alternate" hreflang="zh" :href="'https://www.js-bridge.com/post/' + props.data?.postId"></Link>
      <Link rel="alternate" hreflang="x-default" :href="'https://www.js-bridge.com/post/' + props.data?.postId"></Link>

      <Meta property="og:title" :content="props.data?.title"></Meta>
      <Meta property="og:description" :content="props.data?.description || defdaultDesc"></Meta>
      <Meta property="og:locale" content="zh-CN"></Meta>
      <Meta property="og:url" :content="'https://www.js-bridge.com/post/' + props.data?.postId"></Meta>
      <Meta property="og:site_name" content="Blog of Jerrywu001"></Meta>
      <Meta property="og:image" :content="props.data?.cover || 'https://www.js-bridge.com/head.jpg'"></Meta>
      <Meta property="og:type" content="website"></Meta>

      <Meta name="twitter:card" content="summary_large_image"></Meta>
      <Meta name="twitter:site" content="@jerrywu185"></Meta>
      <Meta name="twitter:title" :content="props.data?.title"></Meta>
      <Meta name="twitter:description" :content="props.data?.description || defdaultDesc"></Meta>
      <Meta name="twitter:image" :content="props.data?.cover || 'https://www.js-bridge.com/head.jpg'"></Meta>

      <Link rel="stylesheet" :href="prismLink" />
    </Head>
  </Html>

  <article
    v-show="visible"
    id="content"
    class="article flex flex-col box-border p-4 pb-0 relative w-[calc(100vw-570px)] max-xl:w-[calc(100vw-300px)] max-lg:w-screen"
    :class="{ 'h-screen !w-full overflow-y-auto': preview }"
  >
    <h1
      v-show="!preview"
      class="font-semibold text-3xl pb-4 pt-2 text-black max-lg:text-2xl dark:text-white"
    >
      {{ props.data?.title }}
    </h1>

    <template v-if="!preview">
      <div v-if="props.data?.tags && props.data?.tags.length > 0" class="py-3">
        <span
          v-for="(v, idx) in props.data.tags"
          :key="idx"
          class="pr-2"
          :style="`color: ${getRandomColor()}`"
        >
          #{{ v.name }}
        </span>
      </div>
      <div class="flex items-center justify-between mb-2">
        <div class="flex items-center gap-3">
          <div v-if="author?.avatar">
            <img class="w-10 h-10 rounded-full" :src="author.avatar" alt="avatar" />
          </div>
          <div class="text-sm text-slate-600 dark:text-slate-300">{{ author?.nickname }}</div>
        </div>
      </div>
      <div>
        <span class="text-xs">创建时间：{{ createTime }}</span>
        <NuxtLink
          v-if="enableEdit"
          rel="nofollow"
          class="text-sm ml-2 !p-0 !font-normal"
          :to="`/post-edit/${data?.postId}`"
        >
          编辑
        </NuxtLink>
      </div>

    </template>

    <article-content :children="content" />

    <div class="py-6">&nbsp;</div>
  </article>
</template>

<script setup lang="ts">
import { getDateTimeStr, initMermaid, replaceMdSyntax } from '~~/utils/utils';
import type { IElement, IBlog, SiteUser } from '~~/types';

const defdaultDesc = 'A front-end development blog of jerrywu, includes js,node,vue,react,css,linux, eg.';

const props = defineProps({
  data: {
    type: Object as PropType<IBlog | null>,
    default() {
      return null;
    },
  },
  visible: {
    type: Boolean,
    default: false,
  },
  preview: {
    type: Boolean,
    default: false,
  },
});

const colorMode = useColorMode();
const { siteUser } = useSyncUser();
const prismLink = computed(() => colorMode.preference !== 'dark'
  ? 'https://cdn.staticfile.org/prism-themes/1.9.0/prism-one-light.min.css'
  : 'https://cdn.staticfile.org/prism-themes/1.9.0/prism-holi-theme.min.css');

const author = computed(() => props.data?.author || {} as SiteUser);
const content = computed<IElement[]>(() => props.data?.content || []);
const enableEdit = computed(() => siteUser?.value?.userId && author.value.userId === siteUser?.value?.userId);

const createTime = computed(() => {
  const date = props.data?.createdAt;
  if (date) {
    return getDateTimeStr(date);
  }
  return '';
});

const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

watch(
  () => props.data?.title,
  () => {
    nextTick(() => {
      setTimeout(() => {
        if (process.client && props.data?.title) {
          replaceMdSyntax(!props.preview);
        }
      }, 100);
    });
  },
  { immediate: true },
);

watch(
  () => props.data?.content,
  () => {
    nextTick(() => {
      if (process.client && props.data?.content) {
      // https://mermaid.nodejs.cn/
        initMermaid();
      }
    });
  },
  { immediate: true },
);

</script>

<style lang="postcss">
@import url('https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.3/katex.min.css');
@import url('prismjs/plugins/line-numbers/prism-line-numbers.css');
@import url('prismjs/plugins/inline-color/prism-inline-color.min.css');
@import url('prismjs/plugins/diff-highlight/prism-diff-highlight.min.css');
@import url('prismjs/plugins/treeview/prism-treeview.min.css');
@import url('prismjs/plugins/command-line/prism-command-line.min.css');
@import url('prismjs/plugins/show-invisibles/prism-show-invisibles.min.css');
@import url('unified-remark-prismjs/src/style.css');
@import url('@/assets/css/post.css');

.article {
  p,
  div,
  li,
  strong,
  span {
    & > a {
      @apply border-transparent border font-semibold text-sky-500 no-underline break-all whitespace-pre-wrap dark:text-sky-400 hover:underline;
    }
  }

  ul,
  ol {
    @apply pl-6;
    list-style-type: revert;

    li {
      padding-left: initial;

      &::before {
        display: none;
      }
    }
  }
}

.code-copy-block {
  @apply bg-transparent rounded-lg px-2 pt-2 pb-1;

  height: auto !important;
  line-height: initial !important;
  width: auto !important;
  min-width: unset !important;

  &::before {
    @apply bg-center bg-no-repeat h-[22px] w-[22px] inline-block relative;

    content: '' !important;
    background-image: url(@/assets/imgs/cc-copy.png);
    background-size: 18px;
  }

  &.code-copied {
    &::before {
      background-image: url(@/assets/imgs/success.png);
    }
  }
}

.dark {
  .code-copy-block {
    background-color: rgba(49, 77, 123, 0.49);

    &::before {
      background-image: url(@/assets/imgs/cc-copy-white.png);
    }

    &.code-copied {
      &::before {
        background-image: url(@/assets/imgs/success-white.png);
      }
    }
  }

  .remark-highlight .filename {
    color: white !important;
  }
}
</style>
