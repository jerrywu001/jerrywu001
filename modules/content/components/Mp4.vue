<template>
  <div mt-2>
    <video class="w-full aspect-video" controls allowfullscreen>
      <source :src="`${host}/${props.path}.${props.type}`" type="video/mp4" />
      not support video
    </video>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  path: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    default: 'mp4',
  },
});

const host = computed(() => {
  return process.client ? `${window.location.origin}/videos/` : '/';
});
</script>
