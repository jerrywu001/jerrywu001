<template>
  <DropdownToolbar title="emoji" :visible="state.visible" @on-change="onChange">
    <template #overlay>
      <div class="emoji-container">
        <ol class="emojis">
          <li
            v-for="(emoji, index) of emojis"
            :key="`emoji-${index}`"
            @click="emojiHandler(emoji)"
            v-text="emoji"
          />
        </ol>
      </div>
    </template>
    <template #trigger>
      <span class="relative top-[2px] i-lucide-smile" />
    </template>
  </DropdownToolbar>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';
import type { PropType } from 'vue';
import { DropdownToolbar } from 'md-editor-v3';
import type { InsertContentGenerator } from 'md-editor-v3';
import { emojis } from './data';

const props = defineProps({
  insert: {
    type: Function as PropType<(generator: InsertContentGenerator) => void>,
    default: () => null,
  },
});

const state = reactive({
  visible: false,
});

const emojiHandler = (emoji: string) => {
  const generator: InsertContentGenerator = () => ({
    targetValue: emoji,
    deviationStart: 0,
    deviationEnd: 0,
  });

  props.insert(generator);
};

const onChange = (visible: boolean) => {
  state.visible = visible;
};
</script>

<script lang="ts">
export default {
  name: 'EmojiExtension',
};
</script>

<style lang="postcss" scoped>
.emoji-container {
  border-radius: 3px;
  border-left: 1px solid #e6e6e6;
}

.emojis {
  position: relative;
  width: 341px;
  margin: 0;
  padding: 0;
  background-color: #fff;

  li {
    cursor: pointer;
    float: left;
    border: 1px solid #e8e8e8;
    overflow: hidden;
    margin: -1px 0 0 -1px;
    text-align: center;
    list-style: none;
    z-index: 11;
    box-sizing: border-box;
    padding: 4px;

    &:hover {
      position: relative;
      opacity: 0.7;
      z-index: 12;
    }
  }

  &::after {
    content: '';
    clear: left;
    display: block;
  }

  * {
    user-select: none;
  }
}

html.dark {
  .emoji-container {
    border-left: 1px solid #0f172a;
  }

  .emojis {
    background-color: #0f172a;

    li {
      border: 1px solid #64748b;
    }
  }
}
</style>
