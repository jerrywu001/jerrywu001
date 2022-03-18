<template>
  <div class="panel">
    <div>
      <div
        class="toggle-link flex items-center justify-start cursor-pointer"
        :title="visible ? '收起' : '展开'"
        @click="toggle"
      >
        <a
          class="text-sm !text-black/80 mr-1"
          :class="[
            visible ? 'i-carbon-chevron-down' : 'i-carbon-chevron-right',
          ]"
        />
        <span>{{ props.title }}</span>
      </div>
    </div>
    <div class="panel-content" :class="[visible ? 'visible' : 'hidden']">
      <div>
        <p class="!m-0 leading-none"><slot></slot></p>
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
  @apply border-transparent inline-flex items-center flex-none text-xs px-3 py-1.5 border-1 rounded-md text-black bg-[var(--primary-500)] duration-200 ease-in-out hover:bg-[var(--primary-400)] focus:outline-transparent;
  transition-property: background-color, border-color, color, fill, stroke;
  padding: 0.35rem 1rem;
}
</style>
