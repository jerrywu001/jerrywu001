<template>
  <div ref="codeRef" class="code-group">
    <div
      class="rounded-t-lg text-white relative d-code-group-header-bg overflow-x-auto"
    >
      <div class="w-max px-2 z-0 relative">
        <button
          v-for="(label, i) in tabs"
          :key="`${i}${label}`"
          class="font-medium my-1.5 text-sm tracking-tight py-1.5 px-3 relative inline-block xs:py-3 xs:my-0 focus:outline-none"
          :class="[
            activeTabIndex === i
              ? 'text-gray-800 dark:text-white'
              : 'd-prose-code-filename-text',
          ]"
          @click="updateTabs(i)"
        >
          {{ label }}
        </button>
        <span
          ref="highlightUnderline"
          class="-z-[1] highlight-underline absolute xs:py-1.5"
          :style="{
            transform: `scale(0)`,
            opacity: 0,
          }"
        >
          <span
            class="rounded-lg flex h-full bg-[#d4d4d8] w-full dark:bg-[#255461]"
          />
        </span>
      </div>
    </div>
    <p>
      <slot />
    </p>
  </div>
</template>

<script setup lang="ts">
const highlightUnderline = ref();
const activeTabIndex = ref(0);
const codeRef = ref(null);

function updateHighlightUnderlinePosition() {
  const index = activeTabIndex.value;
  const box = codeRef.value;

  if (box) {
    const btns = box.querySelectorAll('button');
    const activeTab = btns[index];
    highlightUnderline.value.style.left = `${activeTab.offsetLeft}px`;
    highlightUnderline.value.style.top = `${activeTab.offsetTop}px`;
    highlightUnderline.value.style.width = `${activeTab.clientWidth}px`;
    highlightUnderline.value.style.height = `${activeTab.clientHeight}px`;
    highlightUnderline.value.style.transform = 'scale(1)';
    highlightUnderline.value.style.opacity = 1;
  }
}

const slots = useSlots();

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
      list.push(dom.children[0].children);
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
    nextTick(() => updateHighlightUnderlinePosition());
  }
}

tryOnMounted(() => {
  nextTick(() => {
    updateHighlightUnderlinePosition();
  });
});
</script>

<style lang="scss">
.highlight-underline {
  transition: left 150ms, top 150ms, width 150ms, height 150ms, transform 100ms,
    opacity 100ms;
}

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
  }
}
</style>
