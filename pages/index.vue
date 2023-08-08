<template>
  <Html>
    <Head>
      <Title>index</Title>
    </Head>
  </Html>
  <div
    class="bg-white font-montserrat h-100vh p-6 dark:bg-slate-900 dark:text-white/80"
  >
    <div
      relative
      flex
      flex-col
      items-center
      justify-between
      space-y-12
      shadow
      rounded-md
      bg-gray-100
      hover:bg-gray-300
      p-8
      class="dark:bg-[#1d5f72]/90 dark:hover:bg-[#1d5f72]"
    >
      <div flex items-center>
        Hover the icon:
        <a
          inline-block
          text-3xl
          ml-3
          i-twemoji-grinning-face-with-smiling-eyes
          hover:i-twemoji-face-with-tears-of-joy
        />
      </div>
      <a
        v-if="!!user"
        href="javascript:;"
        bg-blue-400
        hover:bg-blue-500
        text-lg
        text-white
        font-light
        py-2
        px-4
        my-3
        rounded
        @click="logout"
      >
        logout
      </a>
      <div class="flex w-full justify-between items-center">
        <img
          loading="lazy"
          :src="useMetaData.avatar_url"
          :alt="useMetaData.user_name"
          width="48"
          height="48"
          class="h-12 w-12 rounded-full"
        />
        <a class="flex flex-col flex-1 text-left pl-4">
          <span class="font-bold text-base">
            {{ useMetaData.user_name }}
          </span>
          <span class="text-sm">{{ user?.email }}</span>
        </a>
        <a
          v-if="user?.app_metadata?.provider === 'github'"
          i-carbon-logo-github
          text-3xl
          target="_blank"
          :href="`https://github.com/${useMetaData.user_name}`"
        />
      </div>
    </div>

    <div mt-20 text-center flex select-none all:transition-400>
      <div ma>
        <div flex class="my-5 justify-center dark:text-white/90">
          <span>toggle theme</span>
          <span
            class="cursor-pointer mx-2 text-gray-600 block i-ph-sun-fill !h-6 !w-6 dark:text-[#92adad] dark:i-ph-moon-fill hover:opacity-80"
            @click="toggleDark"
          />
        </div>

        <NuxtLink
          bg-blue-400
          hover:bg-blue-500
          text-lg
          text-white
          font-light
          py-2
          px-4
          my-3
          rounded
          to="/posts/other_full"
        >
          查看项目md语法
        </NuxtLink>
      </div>
    </div>
    <div absolute bottom-5 right-0 left-0 text-center op30 fw300>
      on-demand · instant · fully customizable
    </div>
  </div>
</template>

<script setup lang="ts">
import { type User } from '@supabase/supabase-js';

definePageMeta({
  layout: false,
  key: 'index',
  pageTransition: false,
  layoutTransition: false,
});

const user = useSupabaseUser() as Ref<User>;
const useMetaData = computed(() => user?.value?.user_metadata || {});

const { toggleDark } = useDarkTheme();
const { logout } = useLogout();
</script>
