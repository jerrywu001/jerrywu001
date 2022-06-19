<template>
  <div
    class="rounded-lg mt-2 text-sm mb-2 leading-relaxed p-4 alert"
    :class="[type]"
  >
    <div class="flex items-start">
      <template v-if="iconName">
        <span
          v-if="isSvgIconStr"
          class="h-5 mr-2 w-5 inline-flex justify-center items-center"
        >
          <span :class="iconName" class="h-6 w-6" />
        </span>
        <span
          v-else
          class="h-5 mr-2 text-1.2rem w-5 inline-flex justify-center items-center"
        >
          {{ iconName }}
        </span>
      </template>
      <div class="flex-grow alert-content">
        <Markdown :use="$slots.default" unwrap="p" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
type AlertType = 'info' | 'success' | 'warning' | 'danger';

const props = defineProps({
  icon: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    default: 'info',
    validator(value: AlertType) {
      return ['info', 'success', 'warning', 'danger'].includes(value);
    },
  },
});

const iconName = computed(() =>
  props.icon !== 'none'
    ? props.icon ||
      {
        info: '💡',
        success: '✅',
        warning: '🚧',
        danger: '🚨',
      }[props.type]
    : ''
);

const isSvgIconStr = computed(
  () => iconName.value && iconName.value.includes('i-')
);
</script>

<style lang="postcss">
.alert {
  &.success {
    @apply bg-green-50 text-green-600 dark:bg-green-800 dark:bg-opacity-25 dark:text-green-200;

    code {
      @apply bg-green-100 shadow-none text-current dark:bg-green-900 dark:bg-opacity-50;
    }

    a:hover {
      code {
        @apply border-green-400 dark:border-green-700;
      }
    }
  }

  &.info {
    @apply bg-blue-50 text-blue-600 dark:bg-blue-800 dark:bg-opacity-25 dark:text-blue-200;

    code {
      @apply bg-blue-100 shadow-none text-current dark:bg-blue-900 dark:bg-opacity-50;
    }

    a:hover {
      code {
        @apply border-blue-400 dark:border-blue-700;
      }
    }
  }

  &.warning {
    @apply bg-yellow-50 text-yellow-600 dark:bg-yellow-800 dark:bg-opacity-25 dark:text-yellow-100;

    code {
      @apply bg-yellow-100 shadow-none text-current dark:bg-yellow-900 dark:bg-opacity-50;
    }

    a:hover {
      code {
        @apply border-yellow-400 dark:border-yellow-700;
      }
    }
  }

  &.danger {
    @apply bg-red-50 text-red-600 dark:bg-red-800 dark:bg-opacity-25 dark:text-red-100;

    code {
      @apply bg-red-100 shadow-none text-current dark:bg-red-900 dark:bg-opacity-50;
    }

    a:hover {
      code {
        @apply border-red-400 dark:border-red-700;
      }
    }
  }
}

.alert {
  a {
    @apply border-none font-semibold underline !border-none !text-current !underline;

    code {
      @apply border border-transparent border-dashed;
    }
  }

  p {
    @apply mb-0 !mt-0;
  }

  strong {
    @apply font-semibold text-current;
  }
}

.dark {
  .alert {
    a {
      @apply text-current;
    }
  }
}
</style>
