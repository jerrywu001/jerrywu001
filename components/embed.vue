<template>
  <div mt-2>
    <iframe
      :src="href"
      sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"
      class="w-full h-full min-h-[500px] overflow-hidden"
    />
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  href: {
    type: String,
    default: '',
  },
});
</script>
