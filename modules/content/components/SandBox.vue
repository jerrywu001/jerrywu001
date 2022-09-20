<template>
  <Sandpack
    :theme="theme"
    :template="template"
    :files="files"
    :options="{
      showConsoleButton: true,
      showLineNumbers: true,
      showTabs: true,
      closableTabs,
      showReadOnly,
      readOnly,
    }"
    :custom-setup="{
      dependencies: {
        'animate.css': '~4.1.1',
        'vue3-toastify': '^0.0.1',
      },
    }"
    rtl
  />
</template>

<script setup lang="ts">
/* eslint-disable prettier/prettier */
import {
  Sandpack,
  type SandpackPredefinedTheme,
  type SandpackFiles,
  type SandpackPredefinedTemplate,
  type SandpackThemeProp,
} from 'codesandbox-sandpack-vue3';
import { nightOwl } from '@codesandbox/sandpack-themes';
import { type PropType, ref } from 'vue';

const theme = ref<SandpackThemeProp>('light');
const slots = useSlots();

const props = defineProps({
  template: {
    type: String as PropType<SandpackPredefinedTemplate>,
    default: 'vue3',
  },
  readOnly: {
    type: Boolean,
    reuqired: false,
    default: undefined,
  },
  closableTabs: {
    type: Boolean,
    reuqired: false,
    default: undefined,
  },
  showReadOnly: {
    type: Boolean,
    default: false,
  },
});

const getDefaultFileName = () => {
  let defaultFilePath = '/src/index.js';

  console.log('props.template', props.template);

  switch (props.template) {
    case 'vanilla-ts':
      defaultFilePath = '/src/index.ts';
      break;
    case 'angular':
      defaultFilePath = '/src/app/app.component.ts';
      break;
    case 'react':
      defaultFilePath = '/App.js';
      break;
    case 'react-ts':
      defaultFilePath = '/App.tsx';
      break;
    case 'vue':
      defaultFilePath = '/src/App.vue';
      break;
    case 'vue3':
      defaultFilePath = '/src/App.vue';
      break;
    case 'svelte':
      defaultFilePath = '/index.js';
      break;
    case 'solid':
      defaultFilePath = '/App.tsx';
      break;
    default:
      break;
  }
  return defaultFilePath;
};

const files = computed<SandpackFiles>(() => {
  const items = {} as SandpackFiles;
  const codeItems = slots.default().filter((v) => v.type === 'div');
  if (Array.isArray(codeItems)) {
    codeItems.forEach((v) => {
      const { active, hidden, code = '', readonly, readOnly } = v.props || {};
      let filename = v.props?.filename as string;
      filename = filename || getDefaultFileName();
      filename = filename.startsWith('/') ? filename : `/${filename}`;
      if (
        typeof active !== 'undefined' ||
        typeof hidden !== 'undefined' ||
        typeof readonly !== 'undefined'
      ) {
        const editable = !(
          typeof readonly !== 'undefined' || typeof readOnly !== 'undefined'
        );
        items[filename] = {
          code,
          active: typeof active !== 'undefined',
          hidden: typeof hidden !== 'undefined',
          readOnly: props.readOnly || !editable,
        };
      } else {
        items[filename] = code;
      }
    });
  }
  return items;
});

onMounted(() => {
  theme.value = (
    document.documentElement.className ? nightOwl : 'light'
  ) as SandpackThemeProp;

  nextTick(() => {
    setTimeout(() => {
      const target = document.documentElement;
      const mb = new MutationObserver((mutationRecord) => {
        const dom = mutationRecord[0].target as HTMLDivElement;
        console.log(dom.className);
        theme.value = (dom.className ? nightOwl : 'light') as SandpackThemeProp;
      });
      mb.observe(target, {
        attributes: true, // 观察node对象的属性
        attributeFilter: ['class'], // 只观察class属性
      });
    });
  });
});
</script>
