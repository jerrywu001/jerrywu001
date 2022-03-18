<template>
  <Html>
    <Head>
      <Title>index</Title>
    </Head>
  </Html>
  <div
    class="bg-white-50 h-100vh p-6 font-montserrat dark:bg-[#001e26]/95 dark:text-white/80"
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
      <p class="text-left">
        Nuxt offers a compelling solution and a great ecosystem to help you ship
        fullstack Vue apps that are performant and SEO friendly. The flexibility
        to choose between SSR and SSG is icing on the cake.
      </p>
      <div class="flex w-full justify-between items-center">
        <a href="https://twitter.com/youyuxi" target="_blank" rel="noopener">
          <img
            loading="lazy"
            src="https://nuxtjs.org/img/home/testimonials/evan.png"
            alt="Evan You"
            width="48"
            height="48"
            class="h-12 w-12"
          />
        </a>
        <a
          href="https://twitter.com/youyuxi"
          target="_blank"
          rel="noopener"
          class="flex flex-1 pl-4 text-left flex-col"
        >
          <span class="font-bold text-base">Evan You</span>
          <span class="text-sm">Creator of Vue.js </span>
        </a>
        <a i-carbon-logo-github text-3xl />
      </div>
    </div>

    <div mt-20 text-center flex select-none all:transition-400>
      <div ma>
        <div
          text-5xl
          fw100
          animate-bounce-alt
          animate-count-infinite
          animate-1s
        >
          unocss
        </div>
        <div op30 text-lg fw200 m1>
          The instant on-demand Atomic CSS engine.
        </div>

        <div flex class="dark:text-white/90 my-5 justify-center">
          <span>toggle theme</span>
          <span
            class="cursor-pointer mx-2 !w-6 !h-6 block text-gray-600 i-ph-sun-fill hover:opacity-80 dark:i-ph-moon-fill dark:text-[#92adad]"
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
          to="/posts/other/full"
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
definePageMeta({
  layout: false,
  key: 'index',
  pageTransition: false,
  layoutTransition: false,
});

const size = ref(13);

const { toggleDark } = useDarkTheme();
</script>
