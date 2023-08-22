<template>
  <div
    class="w-full h-full relative bg-gray-200 rounded-full dark:bg-gray-700"
    :class="[{ 'animate-pulse': !avatar, hidden: !siteUser.userId }]"
  >
    <img
      :src="avatar"
      alt="avatar"
      class="rounded-full w-full h-full"
      :class="[{ 'opacity-0': !avatar }]"
    />
  </div>
</template>

<script setup lang="ts">
const { siteUser } = useSyncUser();

const avatar = computed(() => (siteUser?.value?.avatar as string));
</script>
