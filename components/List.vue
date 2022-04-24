<template>
  <div>
    <div v-for="(item, i) in listItems" :key="i" class="flex mt-3 items-center">
      <template v-if="iconName">
        <span
          v-if="isSvgIconStr"
          :class="`list-${type}`"
          class="flex mt-px mr-2 items-center"
        >
          <span :class="iconName" class="h-6 w-6" />
        </span>
        <span v-else :class="`list-${type}`" class="mt-px mr-2">
          <span class="h-10 w-10">{{ iconName }}</span>
        </span>
      </template>
      <span>
        <Markdown :use="item" />
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { flatUnwrap, nodeTextContent } from '~~/utils/utils';

type Type = 'primary' | 'info' | 'success' | 'warning' | 'danger';

const textContent = ref('');
const slots = useSlots();

const props = defineProps({
  /**
   * Array of string
   */
  items: {
    type: Array,
    default: () => [],
  },
  icon: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    default: 'primary',
    validator(value: Type) {
      return ['primary', 'info', 'success', 'warning', 'danger'].includes(
        value
      );
    },
  },
});

const iconName = computed(() =>
  props.icon !== 'none'
    ? props.icon ||
      {
        primary: 'i-carbon-align-box-middle-center',
        info: 'i-carbon-information',
        success: 'i-carbon-checkmark-outline',
        warning: 'i-carbon-tropical-warning',
        danger: 'i-carbon-warning-alt',
      }[props.type]
    : ''
);

const isSvgIconStr = computed(
  () => iconName.value && iconName.value.includes('i-')
);

const listItems = computed(() => {
  // A simple variable to fix HMR reload
  // eslint-disable-next-line no-unused-expressions
  textContent;
  return flatUnwrap(slots.default(), ['p', 'ul', 'li']);
});

onUpdated(() => {
  textContent.value = nodeTextContent(slots.default);
});
</script>

<style lang="postcss">
/* Primary */
.list-primary {
  color: #1f98af;
}

/* Info */
.list-info {
  @apply text-blue-500 dark:text-blue-400;
}

/* Success */
.list-success {
  @apply text-green-500 dark:text-green-400;
}

/* Warning */
.list-warning {
  @apply text-yellow-500 dark:text-yellow-400;
}

/* Danger */
.list-danger {
  @apply text-red-500 dark:text-red-400;
}
</style>
