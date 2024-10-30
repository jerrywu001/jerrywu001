<template>
  <div mt-2>
    <video class="w-full aspect-video" controls allowfullscreen>
      <source :src="vedioUrl" type="video/mp4" />
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
  return import.meta.client ? `${window.location.origin}/videos/` : '/';
});

const vedioUrl = computed(() => {
  const isHttp = props.path.includes('http') || props.path.includes('https');

  return isHttp
    ? decodeURIComponent(props.path)
    : `${host.value}/${props.path}.${props.type}`;
});
</script>
