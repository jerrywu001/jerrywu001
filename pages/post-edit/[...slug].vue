<template>
  <Html>
    <Title>{{ title }}</Title>
  </Html>
  <div v-show="!loaded" class="flex pt-6 items-center justify-center">loading...</div>
  <div v-show="loaded && id && isUUID(id)" class="overflow-hidden w-screen h-screen bg-white dark:bg-slate-900 dark:text-slate-100">
    <!-- title input -->
    <blog-edit-nav
      ref="navRef"
      :title="title"
      :source="source"
      :saving="saving"
      :blog="blog"
      @on-cover-change="(val) => { cover = val; }"
      @on-desc-change="(val) => { description = val; }"
      @on-tags-change="(tags) => { selectdTags = tags; }"
      @on-title-change="(val) => { title = val; }"
      @on-save="savePost"
    />

    <div class="flex h-[calc(100vh-68px)]">
      <ClientOnly>
        <div class="flex-1 w-1/2 border-stone-300 border border-r-0 dark:border-slate-500">
          <!-- https://imzbf.github.io/md-editor-v3/zh-CN/docs -->
          <MdEditor
            ref="editorRef"
            v-model="source"
            style="border: 0; height: 100%;"
            :theme="theme"
            :preview="false"
            :toolbars="enableEdit? toolbars : ['pageFullscreen', 'fullscreen']"
            @on-upload-img="onUploadImg"
            @on-change="debounceOnChange"
          >
            <template #defToolbars>
              <md-emoji />
            </template>
          </MdEditor>
        </div>
      </ClientOnly>

      <blog-edit-preview :blog="(blog as IBlog)" />
    </div>
  </div>
</template>

<script setup lang="ts">
import pkg from 'lodash';
import { ExposeParam, MdEditor } from 'md-editor-v3';
import { toolbars, getDefaultMdVnodes, fileToBase64, uuid, isUUID } from '~~/utils/utils';
import { IBlog, IElement, ISavePost, ITableOfContent, Tag } from '~~/types';
import 'md-editor-v3/lib/style.css';

let content: Array<IElement> = [];
let tocs: Array<ITableOfContent> = [];

const colorMode = useColorMode();
const { siteUser } = useSyncUser();
const { $toast } = useNuxtApp();
const route = useRoute();

const { debounce } = pkg;
const { params: { slug } } = route;

const id = slug?.[0] || uuid();

const navRef = ref();
const editorRef = ref<ExposeParam>();
const blog = ref<IBlog | null>(null);
const selectdTags = ref<Tag[]>([]);
const theme = ref('light' as 'light' | 'dark');
const title = ref('');
const cover = ref('');
const description = ref('');
const source = ref('');
const saving = ref(false);

const loaded = computed(() => !!blog.value?.title);
const enableEdit = computed(() => {
  return (siteUser?.value?.userId && blog.value?.authorId === siteUser?.value?.userId)
    || (siteUser?.value?.userId && !blog.value?.authorId);
});

const queryPost = async () => {
  const { data } = await useFetch(`/api/post/${id}`, { key: id, method: 'POST', cache: 'reload' });
  // @ts-ignore
  const v = toRaw<IBlog>(data.value || getDefaultMdVnodes());
  if (!v.authorId) v.authorId = siteUser.value.userId;
  v.title = v.title || `untitled-${id}`;
  // @ts-ignore
  blog.value = v;
  title.value = v?.title as string;
  source.value = v?.source as string || '';
  content = toRaw(v?.content);
  tocs = toRaw(v?.tocs);
};

const savePost = async () => {
  const reqBody: ISavePost = {
    postId: blog.value?.postId || id,
    title: title.value.trim(),
    source: source.value,
    content,
    cover: cover.value,
    description: description.value.trim(),
    tocs,
    tags: toRaw(selectdTags.value),
    prevTags: toRaw(blog.value?.tags || []),
  };
  saving.value = true;
  const { data } = await useFetch('/api/post/save', { method: 'POST', body: reqBody });
  saving.value = false;

  if (navRef.value) navRef.value.toggleConfirm();
  if (data.value?.message) {
    $toast.error(data.value.message);
    return;
  }
  $toast.success('done');
};

const onChange = async () => {
  const { data } = await useFetch('/api/post/transform', { method: 'POST', body: { source: source.value } });
  // save for submit
  content = toRaw(data.value?.content as IElement[]);
  tocs = toRaw(data.value?.tocs as ITableOfContent[]);

  if (blog.value) {
    blog.value.title = title.value;
    blog.value.source = source.value;
    blog.value.tocs = tocs;
    blog.value.content = content;
  }
};
const debounceOnChange = debounce(onChange, 500);

const insertImage = async (str: string, select = false) => {
  // @ts-ignore
  editorRef.value?.insert(() => ({
    targetValue: str,
    select,
    deviationStart: 0,
    deviationEnd: 0,
  }));
};

const onUploadImg = async (files: File[]) => {
  const items: Array<{ name: string, base64: string }> = [];

  insertImage('\nuploading...', true);
  for await (const file of files) {
    const base64 = await fileToBase64(file);
    items.push({ name: file.name, base64 });
  }

  const { data } = await useFetch('/api/upload/md-image', {
    method: 'POST',
    body: { files: items, blogId: id },
  });

  for (const url of (data.value || [])) {
    insertImage(`\n<img src=\"${url}\" style="max-width: 300px" />\n`);
  }
};

useAuth();

queryPost();

watch(
  () => colorMode.preference,
  () => {
    theme.value = colorMode.preference === 'dark' ? 'dark' : 'light';
  },
  { immediate: true },
);
</script>

<style lang="postcss">
.md-editor-footer-right {
  display: none;
}

.md-editor-dark {
  --md-bk-color: rgb(15 23 42 / var(--tw-bg-opacity));
}
</style>
