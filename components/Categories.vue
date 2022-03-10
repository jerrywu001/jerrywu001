<template>
  <div>
    <ul class="py-4 px-4 lg:pt-0">
      <li>
        <h5 class="transition duration-100 font-bold py-2">Code style</h5>
        <ul class="mb-2">
          <li>
            <NuxtLink
              to="/posts/code-styles/less-code-style"
              class="transition duration-100 relative inline-flex items-center justify-between pl-3 py-1 border-l border-gray-100 dark:border-dark-400 text-sm text-gray-700 dark:text-gray-400 hover:text-primary hover:dark:text-primary"
            >
              less
            </NuxtLink>
          </li>
          <li>
            <NuxtLink
              to="/posts/code-styles/html-style-guide"
              class="transition duration-100 relative inline-flex items-center justify-between pl-3 py-1 border-l border-gray-100 dark:border-dark-400 text-sm text-gray-700 dark:text-gray-400 hover:text-primary hover:dark:text-primary"
            >
              html
            </NuxtLink>
          </li>
          <li>
            <NuxtLink
              to="/posts/code-styles/airbnb-javascript-style-guide"
              class="transition duration-100 relative inline-flex items-center justify-between pl-3 py-1 border-l border-gray-100 dark:border-dark-400 text-sm text-gray-700 dark:text-gray-400 hover:text-primary hover:dark:text-primary"
            >
              javascript
            </NuxtLink>
          </li>
          <li>
            <NuxtLink
              to="/posts/code-styles/es-next-style-guide"
              class="transition duration-100 relative inline-flex items-center justify-between pl-3 py-1 border-l border-gray-100 dark:border-dark-400 text-sm text-gray-700 dark:text-gray-400 hover:text-primary hover:dark:text-primary"
            >
              esnext
            </NuxtLink>
          </li>
        </ul>
      </li>
      <li>
        <h5 class="transition duration-100 font-bold py-2">React</h5>
        <ul class="mb-2">
          <li>
            <NuxtLink
              to="/posts/react/about-react"
              class="transition duration-100 relative inline-flex items-center justify-between pl-3 py-1 border-l border-gray-100 dark:border-dark-400 text-sm text-gray-700 dark:text-gray-400 hover:text-primary hover:dark:text-primary"
            >
              关于React的6点建议
            </NuxtLink>
          </li>
          <li>
            <NuxtLink
              to="/posts/react/react-resource-debug"
              class="transition duration-100 relative inline-flex items-center justify-between pl-3 py-1 border-l border-gray-100 dark:border-dark-400 text-sm text-gray-700 dark:text-gray-400 hover:text-primary hover:dark:text-primary"
            >
              React源码调试环境搭建
            </NuxtLink>
          </li>
        </ul>
      </li>
      <li>
        <h5 class="transition duration-100 font-bold py-2">Vue</h5>
        <ul class="mb-2">
          <li>
            <NuxtLink
              to="/posts/vue/test"
              class="transition duration-100 relative inline-flex items-center justify-between pl-3 py-1 border-l border-gray-100 dark:border-dark-400 text-sm text-gray-700 dark:text-gray-400 hover:text-primary hover:dark:text-primary"
            >
              vue test
            </NuxtLink>
          </li>
          <li>
            <NuxtLink
              to="/posts/vue/full"
              class="transition duration-100 relative inline-flex items-center justify-between pl-3 py-1 border-l border-gray-100 dark:border-dark-400 text-sm text-gray-700 dark:text-gray-400 hover:text-primary hover:dark:text-primary"
            >
              full usage
            </NuxtLink>
          </li>
          <li>
            <NuxtLink
              to="/posts/vue/uuu"
              class="transition duration-100 relative inline-flex items-center justify-between pl-3 py-1 border-l border-gray-100 dark:border-dark-400 text-sm text-gray-700 dark:text-gray-400 hover:text-primary hover:dark:text-primary"
            >
              uuu
            </NuxtLink>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
export default {
  props: {},
  mounted() {
    console.log(111111111);
  },
};
// active !text-primary dark:text-primary !border-primary dark:border-primary
</script>
