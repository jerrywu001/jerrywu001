<template>
  <div>
    <div v-for="(item, i) in getLists()" :key="i" class="flex mt-3 items-center">
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
        <Markdown :use="() => item" unwrap="li" />
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useUnwrap } from '~~/utils/utils';

const props = defineProps({
  icon: {
    type: String,
    default: null,
  },
  /**
   * Type of list
   */
  type: {
    type: String,
    default: 'primary',
    validator: (value: string) => ['primary', 'info', 'success', 'warning', 'danger'].includes(value),
  },
});

const tag = 'ul';
const { flatUnwrap, unwrap } = useUnwrap();

const slots = useSlots();

const getLists = () => {
  const slotNodes = (slots.default && slots.default()) ?? [];
  const node = slotNodes.find((v) => v.type === tag);

  // @ts-ignore
  return flatUnwrap(node?.children || [], [tag]).map((li) => unwrap(li, ['li']));
};

const iconName = computed(() => props.icon !== 'none'
  ? props.icon ||
  {
    primary: 'i-carbon-align-box-middle-center',
    info: 'i-carbon-information',
    success: 'i-carbon-checkmark-outline',
    warning: 'i-carbon-tropical-warning',
    danger: 'i-carbon-warning-alt',
  }[props.type]
  : '');

const isSvgIconStr = computed(
  () => iconName.value && iconName.value.includes('i-'),
);
</script>

<style lang="postcss">
/* Primary */
.list-primary {
  @apply text-blue-600 dark:text-blue-600;
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
