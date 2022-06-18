<template>
  <div mt-2>
    <iframe
      :src="href"
      sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"
      class="h-full w-full min-h-[500px] overflow-hidden"
    />
  </div>
</template>

<script setup lang="ts">
defineProps({
  href: {
    type: String,
    default: '',
  },
});
</script>
