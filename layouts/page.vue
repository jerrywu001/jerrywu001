<template>
  <Body
    class="d-body-bg d-body-text-color text-root min-w-base antialiased tracking-semitight d-scrollbar min-w-xs overflow-x-hidden"
  >
    <div
      class="layout-container relative w-full font-montserrat text-sm xl:text-base"
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
