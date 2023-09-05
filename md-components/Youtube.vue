<template>
  <div mt-2>
    <iframe
      :src="`https://www.youtube.com/embed/${props.id}`"
      class="w-full aspect-video"
      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
    >
      {{ slots.default() }}
    </iframe>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  id: {
    type: String,
    default: '',
  },
});

const slots = useSlots();
</script>
