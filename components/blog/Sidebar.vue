<template>
  <aside id="siderbar" class="aside aside-lg-xl" :class="{ 'slide-in': slideIn }">
    <div class="pb-8 text-slate-800 font-semibold dark:text-slate-200">
      All Tags
    </div>
    <blog-tags v-if="!loading" :data="tags" />

    <blog-skeleton :visible="loading" :padding="false" />
  </aside>

  <div
    v-show="slideIn"
    class="opacity-0 z-40 fixed inset-0 bg-black/20 backdrop-blur-sm dark:bg-slate-900/80 transition-opacity duration-1200 xl:hidden"
    :class="{ '!opacity-100': slideIn }"
    @click="$emit('close')"
  />
</template>

<script setup lang="ts">
import { type Tag } from '~~/types';

defineProps({
  slideIn: {
    type: Boolean,
    default: false,
  },
});

defineEmits(['close']);

const { tagList } = usePostCache();
const tags = ref([] as Tag[]);
const loading = ref(false);

const fetchTags = async () => {
  if (tagList.value.length) {
    tags.value = tagList.value as Tag[];
    return;
  }

  loading.value = true;
  const { data } = await useFetch<Tag[]>('/api/tag/all', { method: 'POST' });

  tags.value = data.value as Tag[];
  tagList.value = data.value as Tag[];
  loading.value = false;
};

fetchTags();

</script>

<style lang="postcss">
.aside {
  @apply z-30 overflow-y-auto w-[270px] transition-transform bg-white p-4 box-border h-[calc(100vh-56px)] xl:sticky xl:top-0 dark:bg-slate-900/75 dark:text-slate-400;
}

.aside-lg-xl {
  @apply max-xl:fixed max-xl:top-0 max-xl:w-[270px] max-xl:h-screen max-xl:translate-y-0 max-xl:translate-x-[-270px] max-xl:z-50 max-xl:dark:bg-slate-800 max-xl:dark:text-slate-400 max-xl:dark:hover:text-slate-300;

  &.slide-in {
    @apply max-xl:translate-x-[0]
  }
}

</style>
