<template>
  <Body
    class="min-w-xs tracking-semitight d-body-bg d-body-text-color antialiased d-scrollbar overflow-x-hidden"
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
