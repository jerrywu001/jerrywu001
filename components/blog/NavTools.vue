<template>
  <a
    v-if="siteUser?.userId"
    class="i-lucide-log-out w-[22px] h-[22px] ml-3 cursor-pointer"
    @click="logout"
  />
  <NuxtLink
    :to="`/post-edit/${uuid()}`"
    title="create a post"
    class="i-lucide-file-plus-2 w-[22px] h-[22px] mr-3 ml-3"
  />
  <NuxtLink
    to="https://github.com/jerrywu001"
    external
    target="_blank"
    class="i-mdi-github w-[24px] h-[24px] mr-3"
  />
  <blog-switch-theme />
</template>

<script setup lang="ts">
import { uuid } from '~~/utils/utils';

const { siteUser } = useSyncUser();
const { logout } = useLogout();
</script>
