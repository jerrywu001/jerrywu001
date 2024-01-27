<template>
  <div
    id="nav-screen"
    class="hidden md:!hidden"
  >
    <div class="container mx-aut0 py-6 px-8" :class="[blog ? 'pt-14' : '']">
      <nav class="menu">
        <NuxtLink
          class="link"
          href="/tags/all"
          rel="nofollow"
        >
          Tags
        </NuxtLink>
        <NuxtLink
          class="link"
          href="/about-me"
          rel="nofollow"
        >
          About me
        </NuxtLink>
        <NuxtLink
          class="link"
          href="/sponsor-me"
          rel="nofollow"
        >
          Sponsor me
        </NuxtLink>
      </nav>
      <div class="mt-6 flex items-center justify-center">
        <a
          v-if="siteUser?.userId"
          class="i-lucide-log-out w-[22px] h-[22px] ml-3 cursor-pointer"
          @click="logout"
        />
        <NuxtLink
          rel="nofollow"
          :to="`/post-edit/${uuid()}`"
          title="create a post"
          class="i-lucide-file-plus-2 w-[22px] h-[22px] mr-3 ml-3"
        />
        <NuxtLink
          to="https://github.com/jerrywu001"
          rel="nofollow"
          external
          target="_blank"
          class="i-mdi-github w-[24px] h-[24px] mr-3"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { uuid } from '~~/utils/utils';

const { siteUser } = useSyncUser();
const { logout } = useLogout();

defineProps({
  blog: {
    type: Boolean,
    default: false,
  },
});
</script>

<style lang="postcss">
#nav-screen {
  @apply fixed right-0 bottom-0 left-0 px-8 w-full h-[calc(100vh-56px)] bg-white text-slate-800 z-50 overflow-y-auto top-[56px] dark:bg-slate-900 dark:text-white/80;

  opacity: 0;
  transform: translateY(-10px);
  transition: all .3s ease-in-out;

  .link {
    @apply block border-b border-solid border-b-slate-600/20 font-medium text-sm text-slate-800 dark:text-white/80 dark:border-b-slate-200/20;

    padding: 12px 0 11px;
    line-height: 24px;
    transition: border-color .25s,color .25s;
  }

  &.fade-enter-active,
  &.fade-leave-active {
    opacity: 1;
    transform: translateY(0);
  }

  &.fade-enter-from,
  &.fade-leave-to {
    opacity: 0;
  }

  &.fade-enter-from,
  &.fade-leave-to {
      transform: translateY(-10px);
  }
}
</style>
