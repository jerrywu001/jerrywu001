<template>
  <div class="flex items-center h-[62px] box-border border border-b-0 dark:border-slate-500">
    <div class="h-full w-[calc(100vw-200px)]" :class="{ 'w-full': !enableEdit }">
      <input
        :value="blogTitle"
        :readonly="!enableEdit"
        type="text"
        name="title"
        autocomplete="off"
        placeholder="enter title"
        class="block p-4 w-full h-full text-stale-900 placeholder:text-gray-400 outline-0 bg-white dark:bg-slate-900 dark:text-slate-100"
        @input="(event: any) => emit('on-title-change', event?.target?.value)"
      >
    </div>
    <bd-primary-button
      v-show="enableEdit"
      id="toggle-popover"
      class="!w-[100px] !h-[40px] !p-2 !mx-5"
      :name="blog?.postId ? 'update' : 'publish'"
      :disabled="disabled"
      @click="toggleConfirm"
    />
    <img
      class="w-10 h-10 rounded-full ring-2 ring-gray-300 dark:ring-gray-500"
      :class="{ 'mx-5': !enableEdit }"
      :src="(siteUser?.avatar as string)"
    >
  </div>

  <!-- popover -->
  <div
    id="popover"
    data-popover
    role="tooltip"
    class="absolute top-[58px] right-[78px] z-10 invisible inline-block text-sm transition-opacity duration-300 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 w-[520px] dark:bg-gray-800 dark:border-gray-600"
    :class="{ '!visible !opacity-100': showDialog }"
  >
    <div class="p-3 space-y-2 text-gray-900 dark:text-white">
      <h3 class="font-semibold text-lg px-3">
        Save Post
      </h3>
      <!-- props -->
      <div class="p-3">
        <div class="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <div class="sm:col-span-4">
            <label for="username" class="block text-sm font-medium leading-6">Tags</label>
            <div class="relative mt-2">
              <button
                type="button"
                class="relative w-full cursor-default rounded-md bg-transparent py-1.5 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6 dark:text-white/80"
                @click="showTags = !showTags"
              >
                <span class="flex items-center">
                  <span class="ml-3 block truncate">{{ selected.map(v => v.name).join(',') || 'please choose tags' }}</span>
                </span>
                <span class="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                  <icon-choose />
                </span>
              </button>
              <ul
                class="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white dark:bg-slate-900 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
                :class="{ 'hidden': !showTags }"
              >
                <li id="listbox-option-0" class="text-gray-900 dark:text-white relative cursor-default select-none py-2 pr-9" role="option">
                  <input
                    ref="tagInputRef"
                    type="text"
                    placeholder="press enter to create a tag"
                    class="py-1 outline-none px-3 rounded-md border border-solid border-cyan-800 bg-transparnet placeholder:text-slate-800 dark:placeholder:text-slate-600 dark:bg-white mx-3 w-full inset-0 text-indigo-600 dark:text-slate-600 focus:ring-indigo-500"
                    :readonly="creating"
                    @keyup.prevent.enter="createTag"
                  >
                </li>
                <template v-if="tags?.length > 0">
                  <li
                    v-for="item in tags"
                    :key="item.name"
                    class="text-gray-900 dark:text-white relative cursor-default select-none py-2 pr-9 active:opacity-70"
                    @click="toogleSelected(item)"
                  >
                    <div class="flex items-center">
                      <span class="font-normal ml-3 block truncate">{{ item.name }}</span>
                    </div>
                    <span
                      v-if="selected.findIndex(v => v.name === item.name) > -1"
                      class="text-indigo-600 absolute inset-y-0 right-0 flex items-center pr-4"
                    >
                      <icon-select />
                    </span>
                  </li>
                </template>
                <template v-else>
                  <li class="text-gray-900 dark:text-white relative cursor-default select-none py-2 pr-9" role="option">
                    <div class="flex items-center justify-center text-slate-400 dark:text-white/90">
                      <span class="font-normal ml-3 block truncate">no tags</span>
                    </div>
                  </li>
                </template>
              </ul>
            </div>
          </div>

          <div class="col-span-full">
            <label for="cover-photo" class="flex items-center text-sm font-medium leading-6">Cover
              <span
                v-show="cover"
                id="delete-cover"
                class="i-lucide-trash-2 w-4 h-4 inline-block ml-2 cursor-pointer hover:text-slate-500"
                @click="() => cover = ''"
              />
            </label>
            <bd-upload v-if="!cover" :uploading="uploading" @on-change="onUploadImg" />
            <div v-else class="flex mt-2 items-center justify-start w-full">
              <img
                class="rounded-md"
                :src="cover"
                alt="cover"
                style="max-height: 200px;"
              >
            </div>
          </div>

          <div class="col-span-full">
            <label for="about" class="block text-sm font-medium leading-6">Keywords</label>
            <div class="mt-2">
              <textarea
                v-model="keywords"
                name="desc"
                rows="3"
                placeholder="post description"
                class="px-3 !outline-none block resize-none w-full bg-transparent rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div class="col-span-full">
            <label for="about" class="block text-sm font-medium leading-6">Description</label>
            <div class="mt-2">
              <textarea
                v-model="desc"
                name="desc"
                rows="3"
                placeholder="post description"
                class="px-3 !outline-none block resize-none w-full bg-transparent rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>

            <p class="mt-3 text-sm leading-6 mb-6">
              Write a few sentences about Post.
            </p>
          </div>
        </div>

        <!-- buttons -->
        <div class="flex gap-2 items-center mx-4 justify-end">
          <bd-default-button
            v-show="enableEdit"
            class="!w-[100px] !h-[40px] !mt-0"
            name="Cancel"
            @click="toggleConfirm"
          />
          <bd-primary-button
            v-show="enableEdit"
            class="!w-[180px] !h-[40px]"
            name="Confirm"
            :disabled="disabledConfirm"
            :loading="saving"
            @click="emit('on-save')"
          />
        </div>
      </div>
      <div data-popper-arrow />
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { IBlog, Tag } from '~~/types';

const props = defineProps({
  title: String,
  source: String,
  saving: Boolean,
  blog: Object as PropType<IBlog | null>,
});

const emit = defineEmits<{
  (e: 'on-save'): void;
  (e: 'on-cover-change', val: string): void;
  (e: 'on-desc-change', val: string): void;
  (e: 'on-keywords-change', val: string): void;
  (e: 'on-tags-change', tags: Tag[]): void;
  (e: 'on-title-change', val: string): void;
}>();

const { siteUser } = useSyncUser();
const { $toast } = useNuxtApp();

const route = useRoute();
const { params: { slug } } = route;
const defaultId = slug?.[0];

const tagInputRef = ref<HTMLInputElement>();
const blogTitle = ref('');
const desc = ref('');
const keywords = ref('');
const cover = ref('');
const creating = ref(false);
const uploading = ref(false);
const showDialog = ref(false);
const showTags = ref(false);
const tags = ref<Tag[]>([]);
const selected = ref<Tag[]>([]);

const disabled = computed(() => !blogTitle.value?.trim() || !props.source?.trim());
const disabledConfirm = computed(() => !selected.value?.length);

const enableEdit = computed(() => {
  return siteUser?.value?.userId && props.blog?.authorId === siteUser?.value?.userId
    || siteUser?.value?.userId && !props.blog?.authorId;
});

const toggleConfirm = () => showDialog.value = !showDialog.value;

const toogleSelected = (item: Tag) => {
  const index = selected.value.findIndex((v) => v.name === item.name);

  if (index > -1) {
    selected.value.splice(index, 1);
  } else {
    selected.value.push(item);
  }
  emit('on-tags-change', toRaw(selected.value));
};

const fetchTags = async () => {
  const { data } = await useFetch('/api/tag/all', {
    key: 'tags',
    method: 'POST',
    cache: 'reload',
  });

  tags.value = data.value as Tag[];
};

const createTag = async () => {
  if (creating.value) return;

  creating.value = true;
  const { data } = await useFetch('/api/tag/create', {
    method: 'POST',
    body: { name: tagInputRef.value?.value },
  });

  creating.value = false;

  if (data.value?.msg) {
    $toast.error(data.value.msg);
    return;
  }

  if (tagInputRef.value) tagInputRef.value.value = '';
  tags.value.push(data.value?.tag as Tag);
};

const onUploadImg = async (file: File) => {
  const items: Array<{ name: string; base64: string }> = [];

  if (!file || uploading.value) return;

  uploading.value = true;
  const base64 = await fileToBase64(file);

  items.push({
    name: file.name,
    base64,
  });

  const { data } = await useFetch('/api/upload/md-image', {
    method: 'POST',
    body: {
      files: items,
      blogId: props.blog?.postId || defaultId,
    },
  });

  uploading.value = false;

  cover.value = (data.value as string[] || [])[0];
};

const popoverClick = (e: MouseEvent) => {
  const popover = document.getElementById('popover');

  if (!popover?.contains(e.target as Node) && !document.querySelector('#toggle-popover')?.contains(e.target as Node)) {
    showDialog.value = false;
  }
  if (document.querySelector('#delete-cover') === e.target) {
    showTags.value = true;
  }
};

fetchTags();

defineExpose({ toggleConfirm });

watchEffect(() => {
  emit('on-cover-change', cover.value || props.blog?.cover || '');
});

watch(
  () => props.title,
  () => {
    blogTitle.value = props.title || '';
  },
  { immediate: true },
);

watch(
  () => props.blog?.tags,
  () => {
    selected.value = toRaw(props.blog?.tags || []);
  },
);

watch(
  () => props.blog?.description,
  () => {
    desc.value = desc.value || props.blog?.description || '';
  },
);

watch(
  () => props.blog?.keywords,
  () => {
    keywords.value = keywords.value || props.blog?.keywords || '';
  },
);

watch(
  () => props.blog?.cover,
  () => {
    cover.value = props.blog?.cover || '';
  },
);

watch(
  selected,
  () => {
    emit('on-tags-change', toRaw(selected.value));
  },
);

watch(
  desc,
  () => {
    emit('on-desc-change', desc.value);
  },
);

watch(
  keywords,
  () => {
    emit('on-keywords-change', keywords.value);
  },
);

watch(
  cover,
  () => {
    emit('on-cover-change', cover.value);
  },
);

watch(
  showDialog,
  () => {
    selected.value = toRaw(props.blog?.tags || []);
    desc.value = desc.value || props.blog?.description || '';
    keywords.value = keywords.value || props.blog?.keywords || props.blog?.tags?.map((v) => v.name).join(',') || '';
    cover.value = props.blog?.cover || '';
  },
);

onBeforeMount(() => {
  if (import.meta.client) {
    document.body.removeEventListener('click', popoverClick, false);
  }
});

onMounted(() => {
  if (import.meta.client) {
    document.body.addEventListener('click', popoverClick, false);
  }
});
</script>
