<template>
  <Body
    class="d-body-bg d-body-text-color text-root min-w-base antialiased tracking-semitight min-w-xs"
  >
    <div
      class="layout-container relative d-scrollbar"
      font-montserrat
      text-sm
      overflow-x-hidden
      xl:text-base
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
  height: 100vh;
  overflow-x: hidden;
  overflow-y: auto;
}
</style>
