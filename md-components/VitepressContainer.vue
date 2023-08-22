<template>
  <div v-if="type !== 'details'" class="custom-block vc" :class="[type]">
    <p class="custom-block-title">{{ title || type.toUpperCase() }}</p>
    <div class="py-2">
      <Markdown :use="$slots.default" unwrap="p" />
    </div>
  </div>
  <details v-else class="custom-block vc details" :open="false">
    <summary>{{ title || type.toUpperCase() }}</summary>
    <div class="py-2">
      <Markdown :use="$slots.default" unwrap="p" />
    </div>
  </details>
</template>

<script setup lang="ts">
defineProps({
  title: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    default: 'info',
  },
});
</script>

<style lang="postcss">
.vc {
  --vp-c-bg-alt: #f6f6f7;
  --vp-c-text-1: rgba(60, 60, 67);
  --vp-c-text-2: rgba(60, 60, 67, .78);
  --vp-custom-block-code-font-size: 13px;
  --vp-code-block-bg: var(--vp-c-bg-alt);

  --vp-c-gray-soft: rgba(142, 150, 170, .14);
  --vp-c-indigo-soft: rgba(100, 108, 255, .14);
  --vp-c-yellow-soft: rgba(234, 179, 8, .14);
  --vp-c-green-soft: rgba(16, 185, 129, .14);

  --vp-c-indigo-1: #3451b2;
  --vp-c-indigo-2: #3a5ccc;
  --vp-c-indigo-3: #5672cd;
  --vp-c-yellow-1: #915930;
  --vp-c-yellow-2: #946300;
  --vp-c-red-1: #b8272c;
  --vp-c-red-2: #d5393e;
  --vp-c-green-1: #18794e;
  --vp-c-green-2: #299764;
  --vp-c-gray-1: #dddde3;
  --vp-c-gray-2: #e4e4e9;

  --vp-c-brand-1: var(--vp-c-indigo-1);
  --vp-c-brand-2: var(--vp-c-indigo-2);
  --vp-c-warning-1: var(--vp-c-yellow-1);
  --vp-c-warning-2: var(--vp-c-yellow-2);
  --vp-c-danger-1: var(--vp-c-red-1);
  --vp-c-danger-2: var(--vp-c-red-2);
  --vp-c-success-1: var(--vp-c-green-1);
  --vp-c-success-2: var(--vp-c-green-2);

  --vp-c-default-soft: var(--vp-c-gray-soft);
  --vp-c-brand-soft: var(--vp-c-indigo-soft);
  --vp-c-warning-soft: var(--vp-c-yellow-soft);
  --vp-c-red-soft: rgba(244, 63, 94, .14);
  --vp-c-danger-soft: var(--vp-c-red-soft);
  --vp-c-success-soft: var(--vp-c-green-soft);

  --vp-custom-block-info-border: transparent;
  --vp-custom-block-info-text: var(--vp-c-text-1);
  --vp-custom-block-info-bg: var(--vp-c-default-soft);
  --vp-custom-block-info-code-bg: var(--vp-c-default-soft);

  --vp-custom-block-tip-border: transparent;
  --vp-custom-block-tip-text: var(--vp-c-text-1);
  --vp-custom-block-tip-bg: var(--vp-c-brand-soft);
  --vp-custom-block-tip-code-bg: var(--vp-c-brand-soft);

  --vp-custom-block-warning-border: transparent;
  --vp-custom-block-warning-text: var(--vp-c-text-1);
  --vp-custom-block-warning-bg: var(--vp-c-warning-soft);
  --vp-custom-block-warning-code-bg: var(--vp-c-warning-soft);

  --vp-custom-block-danger-border: transparent;
  --vp-custom-block-danger-text: var(--vp-c-text-1);
  --vp-custom-block-danger-bg: var(--vp-c-danger-soft);
  --vp-custom-block-danger-code-bg: var(--vp-c-danger-soft);

  --vp-custom-block-success-border: transparent;
  --vp-custom-block-success-text: var(--vp-c-text-1);
  --vp-custom-block-success-bg: var(--vp-c-success-soft);
  --vp-custom-block-success-code-bg: var(--vp-c-success-soft);

  --vp-custom-block-details-border: var(--vp-custom-block-info-border);
  --vp-custom-block-details-text: var(--vp-custom-block-info-text);
  --vp-custom-block-details-bg: var(--vp-custom-block-info-bg);
  --vp-custom-block-details-code-bg: var(--vp-custom-block-info-code-bg);
}

.custom-block {
  border: 1px solid transparent;
  border-radius: 8px;
  padding: 16px 16px 8px;
  line-height: 24px;
  margin: 16px 0;
  font-size: 13px;
  color: var(--vp-c-text-2);

  pre {
    background-color: var(--vp-code-block-bg) !important;
    border: none !important;
    box-shadow: none !important;

    code {
      background-color: transparent !important;
    }
  }

  table, pre {
    margin: 8px 0;
  }

  table {
    font-size: 13px;

    thead {
      th {
        background-color: transparent !important;
        font-size: 15px !important;
      }
    }

    th, td {
      border-color: rgb(99 99 99 / 10%) !important;
    }
  }

  :not(pre)>code {
    border-radius: 4px !important;
    padding: 3px 6px !important;
    transition: color .25s, background-color .5s !important;
  }

  .custom-block-title {
    font-weight: 600;
    font-size: 14px;
    margin: 0;
  }

  a {
    color: inherit !important;
    font-weight: 600 !important;
    text-decoration: underline;
    text-underline-offset: 2px;
    transition: opacity .25s;
    padding: 0 3px;

    &:hover {
      opacity: .75;
    }
  }

  code {
    font-size: var(--vp-custom-block-code-font-size) !important;
  }

  th,
  blockquote>p {
    color: inherit;
  }

  p+p {
    margin: 8px 0;
  }

  &.info {
    border-color: var(--vp-custom-block-info-border);
    color: var(--vp-custom-block-info-text);
    background-color: var(--vp-custom-block-info-bg);

    a, code {
      color: var(--vp-c-brand-1) !important;
    }

    a:hover {
      color: var(--vp-c-brand-2) !important;
    }

    code {
      background-color: var(--vp-custom-block-info-code-bg) !important;
    }
  }

  &.tip {
    border-color: var(--vp-custom-block-tip-border);
    color: var(--vp-custom-block-tip-text);
    background-color: var(--vp-custom-block-tip-bg);

    a, code {
      color: var(--vp-c-brand-1) !important;
    }

    a:hover {
      color: var(--vp-c-brand-2) !important;
    }

    code {
      background-color: var(--vp-custom-block-tip-code-bg) !important;
    }
  }

  &.warning {
    border-color: var(--vp-custom-block-warning-border);
    color: var(--vp-custom-block-warning-text);
    background-color: var(--vp-custom-block-warning-bg);

    a, code {
      color: var(--vp-c-warning-1) !important;
    }

    a:hover {
      color: var(--vp-c-warning-2) !important;
    }

    code {
      background-color: var(--vp-custom-block-warning-code-bg) !important;
    }
  }

  &.danger {
    border-color: var(--vp-custom-block-danger-border);
    color: var(--vp-custom-block-danger-text);
    background-color: var(--vp-custom-block-danger-bg);

    a, code {
      color: var(--vp-c-danger-1) !important;
    }

    a:hover {
      color: var(--vp-c-danger-2) !important;
    }

    code {
      background-color: var(--vp-custom-block-danger-code-bg) !important;
    }
  }

  &.success {
    border-color: var(--vp-custom-block-success-border);
    color: var(--vp-custom-block-success-text);
    background-color: var(--vp-custom-block-success-bg);

    a, code {
      color: var(--vp-c-success-1) !important;
    }

    a:hover {
      color: var(--vp-c-success-2) !important;
    }

    code {
      background-color: var(--vp-custom-block-danger-code-bg) !important;
    }
  }

  &.details {
    border-color: var(--vp-custom-block-details-border);
    color: var(--vp-custom-block-details-text);
    background-color: var(--vp-custom-block-details-bg);

    a {
      color: var(--vp-c-brand-1) !important;

      &:hover {
        color: var(--vp-c-brand-2) !important;
      }
    }

    code {
      background-color: var(--vp-custom-block-details-code-bg) !important;
    }

    summary {
      margin: 0 0 8px;
      font-weight: 700;
      cursor: pointer;

      &+p {
        margin: 8px 0;
      }
    }
  }
}

html.dark {
  .vc {
    --vp-c-bg-alt: #161618;
    --vp-c-text-1: rgba(255, 255, 245, .86);
    --vp-c-text-2: rgba(235, 235, 245, .6);
    --vp-c-indigo-1: #a8b1ff;
    --vp-c-indigo-2: #5c73e7;
    --vp-c-indigo-3: #3e63dd;
    --vp-c-yellow-1: #f9b44e;
    --vp-c-yellow-2: #da8b17;
    --vp-c-red-1: #f66f81;
    --vp-c-red-2: #f14158;
    --vp-c-green-1: #3dd68c;
    --vp-c-green-2: #30a46c;
    --vp-c-gray-1: #515c67;
    --vp-c-gray-2: #414853;

    --vp-c-yellow-soft: rgba(234, 179, 8, .16);
    --vp-c-red-soft: rgba(244, 63, 94, .16);
    --vp-c-green-soft: rgba(16, 185, 129, .16);
    --vp-c-indigo-soft: rgba(100, 108, 255, .16);
    --vp-c-gray-soft: rgba(101, 117, 133, .16);

    table {
      th, td {
        border-color: rgb(99 99 99 / 30%) !important;
      }
    }
  }
}
</style>
