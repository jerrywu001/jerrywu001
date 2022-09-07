<template>
  <Body
    class="bg-white min-w-xs text-slate-500 antialiased d-scrollbar overflow-x-hidden dark:bg-slate-900 dark:text-slate-400"
  >
    <div
      class="font-montserrat text-sm w-full layout-container relative xl:text-base"
    >
      <slot />
    </div>
  </Body>
</template>

<style scoped>
.layout-container {
  max-width: var(--max-content-width);
  margin-left: auto;
  margin-right: auto;
}
</style>
