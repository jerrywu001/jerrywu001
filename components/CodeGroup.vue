<template>
  <div ref="codeRef" class="code-group">
    <div
      class="relative text-white rounded-t-lg d-code-group-header-bg overflow-x-auto"
    >
      <div ref="tabsRef" class="relative z-0 px-2 w-max">
        <button
          v-for="(label, i) in tabs"
          :key="`${i}${label}`"
          class="relative inline-block px-3 py-1.5 xs:py-3 my-1.5 xs:my-0 text-sm font-medium tracking-tight focus:outline-none"
          :class="[
            activeTabIndex === i
              ? 'active text-gray-800 dark:text-white'
              : 'd-prose-code-filename-text',
          ]"
          @click="updateTabs(i)"
        >
          {{ label }}
        </button>
      </div>
    </div>
    <p>
      <slot />
    </p>
  </div>
</template>

<script setup lang="ts">
const tabsRef = ref(null);
const codeRef = ref(null);
const slots = useSlots();
const activeTabIndex = ref(0);

const slotBoxs = computed(() =>
  slots.default().filter((v) => v.type === 'div')
);

const tabs = getTabs();

function getTabs() {
  const list = [];
  for (const box of slotBoxs.value) {
    const children = box.children || [];
    // @ts-ignore
    const dom = children.find(
      (v) => v.props && v.props.class && v.props.class.includes('filename')
    );
    if (dom && dom.children && dom.children[0]) {
      list.push(dom.children[0]);
    }
  }
  return list;
}

function updateTabs(index = 0) {
  activeTabIndex.value = index;
  if (codeRef.value) {
    const boxs = codeRef.value.querySelectorAll('.remark-highlight');
    if (boxs) {
      boxs.forEach((element, idx) => {
        element.style.display = idx === index ? 'block' : 'none';
      });
    }
  }
}
</script>

<style lang="scss">
.code-group {
  margin-top: 1rem;
  margin-bottom: 1rem;
  p {
    margin: 0;
  }
  .remark-highlight {
    display: none;
    margin-top: 0;
    margin-bottom: 1rem;
    position: relative;

    &:first-child {
      display: block;
    }

    pre[class*='language-'] {
      border-top-left-radius: 0;
      border-top-right-radius: 0;
    }
  }

  .d-code-group-header-bg {
    background-color: rgba(228, 228, 231, 1);
    .dark & {
      background-color: #003543;
    }
    &::-webkit-scrollbar {
      display: none;
    }
  }
  button {
    border-radius: 8px;

    &.d-prose-code-filename-text {
      color: rgba(82, 82, 91, 0.8);
      .dark & {
        color: rgba(113, 162, 176, 1);
      }
    }
    &.active {
      background-color: #d4d4d8;
      transition: backgroundColor 0.15s;

      .dark & {
        background-color: #255461;
      }
    }
  }
}
</style>
