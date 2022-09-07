<template>
  <div class="panel">
    <div>
      <div
        class="cursor-pointer flex toggle-link items-center justify-start"
        :title="visible ? '收起' : '展开'"
        @click="toggle"
      >
        <a
          class="text-sm mr-1 !text-black/80"
          :class="[
            visible ? 'i-carbon-chevron-down' : 'i-carbon-chevron-right',
          ]"
        />
        <span>{{ props.title }}</span>
      </div>
    </div>
    <div class="panel-content" :class="[visible ? 'visible' : 'hidden']">
      <div>
        <p class="leading-none !m-0"><slot></slot></p>
      </div>
    </div>
  </div>
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
  @apply border-transparent border rounded-md flex-none bg-sky-500 text-xs text-black py-1.5 px-3 ease-in-out duration-200 inline-flex items-center hover:bg-sky-400 focus:outline-transparent;
  transition-property: background-color, border-color, color, fill, stroke;
  padding: 0.35rem 1rem;
}
</style>
