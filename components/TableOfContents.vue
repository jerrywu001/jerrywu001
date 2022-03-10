<template>
  <div
    v-show="tocs.length > 0"
    class="tocs overflow-hidden sticky bg-white/95 z-10 top-$header-height left-0 flex-none w-full text-xs lg:left-60 px-4 sm:px-6 dark:bg-[#001e26]/95"
    :class="`${isPc ? 'h-auto' : 'h-10'}`"
  >
    <a
      class="relative tocs-btn cursor-pointer hover:text-opacity-60 hover:no-underline z-10 flex items-center w-full text-xs font-semibold text-gray-900 focus:outline-none dark:text-gray-100 dark:border-b-white/30"
      :class="[
        !isPc ? 'border-dashed border-b border-b-gray-900/30 ' : '',
        isPc ? 'h-auto' : 'h-10',
      ]"
      @click="
        () => {
          if (!isPc) {
            toggleTocs();
          }
        }
      "
    >
      IN THIS ARTICLE
      <a
        v-show="!isPc"
        class="text-sm text-black/80 mr-1 i-carbon-chevron-right dark:text-white/80"
      />
    </a>
    <div class="flex-col justify-between overflow-y-auto sticky pb-2">
      <div
        class="overflow-x-hidden overflow-y-auto d-scrollbar"
        :class="`${!isPc ? 'max-h-[50vh]' : 'h-$tocs-height-xl'}`"
      >
        <ol class="table-of-contents">
          <li v-for="item in tocs" :key="item.archor">
            <a
              :href="item.archor"
              :class="item.class"
              @click="scrollToHeading($event, item.archor)"
            >
              {{ item.label }}
            </a>
            <ol
              v-if="item.children && item.children.length > 0"
              class="table-of-contents font-medium"
            >
              <li v-for="child in item.children" :key="child.archor">
                <a
                  :href="child.archor"
                  :class="child.class"
                  @click="scrollToHeading($event, child.archor)"
                >
                  {{ child.label }}
                </a>
                <ol
                  v-if="child.children && child.children.length > 0"
                  class="table-of-contents font-medium"
                >
                  <li v-for="h4 in child.children" :key="h4.archor">
                    <a
                      :href="h4.archor"
                      :class="h4.class"
                      @click="scrollToHeading($event, h4.archor)"
                    >
                      {{ h4.label }}
                    </a>
                  </li>
                </ol>
              </li>
            </ol>
          </li>
        </ol>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ITableOfContent } from '~~/types';
import { toggleTocs, scrollToHeading } from '~~/utils/toc';

const props = defineProps({
  children: {
    type: Array,
    default() {
      return [] as ITableOfContent[];
    },
  },
  isPc: {
    type: Boolean,
    default: false,
  },
});

const tocs = computed(() => (props.children as ITableOfContent[]) || []);
</script>

<style lang="postcss" scoped>
.toc-link.active {
  font-weight: 700;
}

.dark {
  .toc-link.toc-link.active {
    color: #fff;
  }
}
</style>
