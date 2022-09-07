<template>
  <details class="custom-details">
    <summary>{{ props.title }}</summary>
    <div class="panel-content">
      <div>
        <p class="leading-none !m-0"><slot></slot></p>
      </div>
    </div>
  </details>
</template>

<script setup lang="ts">
const props = defineProps({
  title: {
    type: String,
    default: '',
  },
});

const visible = ref(false);

function toggle() {
  visible.value = !visible.value;
}
</script>

<style lang="postcss" scoped>
.toggle-link {
  @apply border-transparent border rounded-md flex-none bg-sky-500 text-xs py-1.5 px-3 ease-in-out text-white/90 duration-200 inline-flex items-center hover:bg-sky-400 focus:outline-transparent;
  transition-property: background-color, border-color, color, fill, stroke;
  padding: 0.35rem 1rem;
}

.custom-details {
  border: 1px solid transparent;
  border-radius: 8px;
  padding: 12px 16px 12px;
  line-height: 24px;
  margin: 16px 0;
  border-color: rgb(203 205 209 / 17%);

  summary {
    @apply font-bold;
  }

  @apply bg-light-500 text-[#666] select-none dark:bg-[#1e293b] dark:text-[#e2e2e2];
}
</style>
