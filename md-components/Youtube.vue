<template>
  <div mt-2>
    <iframe
      :src="`https://www.youtube.com/embed/${id}`"
      class="w-full aspect-video"
      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
    />
  </div>
</template>

<script setup lang="ts">
defineProps({
  id: {
    type: String,
    default: '',
  },
});
</script>
