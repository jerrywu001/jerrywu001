<template>
  <div mt-2>
    <iframe
      :src="`https://www.youtube.com/embed/${props.id}`"
      width="560"
      height="377"
      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
      class="w-full"
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
