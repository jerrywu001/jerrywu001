<template>
  <Html>
    <Head>
      <Title>Home</Title>
    </Head>
  </Html>
  <NuxtLayout name="default" title="Home">
    <div
      class="bg-white h-100vh p-6 dark:bg-slate-900 dark:text-white/80"
    >
      <div class="p-4 pb-2">
        <select
          v-model="colorMode.preference"
          class="border w-24 h-8 dark:bg-gray-900 dark:text-white dark:border-gray-700"
        >
          <option value="system">System</option>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </div>

      <div class="w-16 h-16">
        <BdAvatar />
      </div>

      <div class="my-4">{{ siteUser?.nickname }}</div>
      <a
        v-if="!!siteUser?.userId"
        href="javascript:;"
        class="bg-blue-400 hover:bg-blue-500 text-lg text-white font-light py-2 px-4 rounded"
        @click="logout"
      >
        logout
      </a>

      <NuxtLink
        v-else
        class="bg-blue-400 hover:bg-blue-500 text-lg text-white font-light py-2 px-4 rounded"
        to="/login"
      >
        login
      </NuxtLink>

      <br />

      <br />

      <div>
        <NuxtLink
          class="bg-blue-400 hover:bg-blue-500 text-lg text-white font-light py-2 px-4 my-3 rounded"
          :to="`/post-edit/${uuid()}`"
        >
          create a post
        </NuxtLink>
      </div>

      <div v-if="loading">loading...</div>
      <template v-else>
        <div
          v-for="item in blogs"
          :key="item.postId"
          class="mt-8 text-center flex select-none all:transition-400"
        >
          <div class="">
            <NuxtLink class="flex gap-5" :to="`/post/${item.postId}`">
              <div v-if="item.cover">
                <img class=" w-40 h-28 rounded-md object-cover" :src="item.cover" alt="cover">
              </div>
              <div class="flex flex-col gap-2 items-start">
                <div>{{ item.title }}</div>
                <p v-if="item.description" class="text-slate-400">{{ item.description }}</p>
              </div>
            </NuxtLink>
          </div>
        </div>
      </template>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { IBlog } from '~~/types';
import { uuid } from '~~/utils/utils';

const colorMode = useColorMode();
const { siteUser } = useSyncUser();

definePageMeta({ layout: false });

const { logout } = useLogout();
const blogs = ref<IBlog[]>([]);
const loading = ref(false);

const fetchAllPosts = async () => {
  loading.value = true;
  const { data } = await useFetch('/api/post/search', { method: 'POST', body: {} });
  // @ts-ignore
  blogs.value = data.value as IBlog[];
  loading.value = false;
};

fetchAllPosts();

useAuthCallbackError();
</script>
