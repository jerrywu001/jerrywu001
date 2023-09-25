<template>
  <algola-search :index="index" />
  <a
    v-if="siteUser?.userId"
    class="i-lucide-log-out w-[22px] h-[22px] ml-3 cursor-pointer max-md:mr-3 max-md:hidden"
    @click="logout"
  />
  <NuxtLink
    :to="`/post-edit/${uuid()}`"
    title="create a post"
    class="i-lucide-file-plus-2 w-[22px] h-[22px] mr-3 ml-3 max-md:hidden"
  />
  <NuxtLink
    to="https://github.com/jerrywu001"
    external
    target="_blank"
    class="i-mdi-github w-[24px] h-[24px] mr-3 max-md:hidden"
  />
  <blog-switch-theme />

  <button
    type="button"
    class="hamburger hidden max-md:block"
    @click="toggleNavScreen"
  >
    <span class="container">
      <span class="top" />
      <span class="middle" />
      <span class="bottom" />
    </span>
  </button>

  <blog-nav-screen :blog="blog" :visible="visible" />
</template>

<script setup lang="ts">
import { uuid } from '~~/utils/utils';

defineProps({
  index: {
    type: Boolean,
    default: false,
  },
  blog: {
    type: Boolean,
    default: false,
  },
});

const route = useRoute();
const { siteUser } = useSyncUser();
const { logout } = useLogout();

const visible = ref(false);

const toggleNavScreen = () => {
  const hamburger = document.querySelector('.hamburger');
  const navScreen = document.querySelector('#nav-screen');
  const active = hamburger?.classList.contains('active');

  if (!active) {
    hamburger?.classList.add('active');
    navScreen?.classList.remove('hidden');
    navScreen?.classList.remove('fade-leave-active');
    navScreen?.classList.remove('fade-leave-to');

    setTimeout(() => {
      navScreen?.classList.add('fade-enter-active');
      navScreen?.classList.add('fade-enter-to');
    }, 0);
  } else {
    hamburger?.classList.remove('active');
    navScreen?.classList.remove('fade-enter-active');
    navScreen?.classList.remove('fade-enter-to');
    navScreen?.classList.add('fade-leave-active');
    navScreen?.classList.add('fade-leave-to');

    setTimeout(() => {
      navScreen?.classList.add('hidden');
      navScreen?.classList.remove('fade-enter-active');
      navScreen?.classList.remove('fade-enter-to');
    }, 300);
  }
};

watch(
  () => route.path,
  () => {
    const hamburger = document.querySelector('.hamburger');
    const navScreen = document.querySelector('#nav-screen');

    hamburger?.classList?.remove('active');
    navScreen?.classList?.add('hidden');
    navScreen?.classList?.remove('fade-enter-active');
    navScreen?.classList?.remove('fade-enter-to');
    navScreen?.classList?.remove('fade-leave-active');
    navScreen?.classList?.remove('fade-leave-to');
  },
);

</script>

<style lang="postcss">
.hamburger {
  --vp-c-text-1: rgba(60, 60, 67);
  --vp-c-text-2: rgba(60, 60, 67, .78);

  @apply h-7 ml-4;

  .container {
    @apply relative w-4 h-[14px] overflow-hidden block;
  }

  .top,
  .middle,
  .bottom {
    @apply absolute w-4 h-[2px];

    background-color: var(--vp-c-text-1);
    transition: top .25s, background-color .5s, transform .25s
  }

  .top {
    @apply top-0 left-0;
    transform: translate(0);
  }

  .middle {
    @apply top-[6px] left-0;
      transform: translate(8px);
  }

  .bottom {
    @apply top-3 left-0;
    transform: translate(4px);
  }

  &:hover {
    .top {
      @apply top-0 left-0;
      transform: translate(4px);
    }

    .middle {
      @apply top-[6px] left-0;
      transform: translate(0);
    }

    .bottom {
      @apply top-3 left-0;
      transform: translate(8px)
    }
  }

  &.active {
    .top {
      top: 6px;
      transform: translate(0) rotate(225deg)
    }

    .middle {
      top: 6px;
      transform: translate(16px)
    }

    .bottom {
      top: 6px;
      transform: translate(0) rotate(135deg)
    }

    &:hover {
      .top,
      .middle,
      .bottom {
        background-color: var(--vp-c-text-2);
        transition: top .25s, background-color .25s, transform .25s
      }
    }
  }
}

html.dark {
  .hamburger {
    --vp-c-text-1: rgba(255, 255, 245, .86);
    --vp-c-text-2: rgba(235, 235, 245, .6);
  }
}
</style>
