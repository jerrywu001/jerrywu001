<script setup lang="ts">
import docsearch from '@docsearch/js';
import { getCurrentInstance, onMounted, watch } from 'vue';
import type { DocSearchHit } from '@docsearch/react/dist/esm/types';
import { AlgoliaSearchOptions } from '~~/types';

const props = defineProps<{
  options: AlgoliaSearchOptions;
  multilang?: boolean;
}>();

const vm = getCurrentInstance();
const route = useRoute();
const router = useRouter();

watch(
  () => props.options,
  (value) => {
    update(value);
  }
);

onMounted(() => {
  initialize(props.options);
});

function isSpecialClick(event: MouseEvent) {
  return (
    event.button === 1 ||
    event.altKey ||
    event.ctrlKey ||
    event.metaKey ||
    event.shiftKey
  );
}

function update(options: any) {
  if (vm && vm.vnode.el) {
    vm.vnode.el.innerHTML =
      '<div class="algolia-search-box" id="docsearch"></div>';
    initialize(options);
  }
}

// if the user has multiple locales, the search results should be filtered
const facetFilters: string[] = [];

if (props.options.searchParameters?.facetFilters) {
  facetFilters.push(...props.options.searchParameters.facetFilters);
}

function initialize(userOptions: any) {
  docsearch(
    Object.assign({}, userOptions, {
      container: '#docsearch',

      searchParameters: Object.assign({}, userOptions.searchParameters, {
        // https://github.com/algolia/docsearch-configs/pull/3942
        facetFilters,
      }),

      navigator: {
        navigate: ({ itemUrl }: { itemUrl: string }) => {
          console.log(itemUrl, route.path);
          router.push(itemUrl);
        },
      },

      hitComponent: ({
        hit,
        children,
      }: {
        hit: DocSearchHit;
        children: any;
      }) => {
        const relativeHit = hit.url;

        return {
          type: 'a',
          ref: undefined,
          constructor: undefined,
          key: undefined,
          props: {
            href: relativeHit,
            onClick: (event: MouseEvent) => {
              if (isSpecialClick(event)) {
                return;
              }
              if (route.path === relativeHit) {
                return;
              }
              if (route.path !== relativeHit) {
                event.preventDefault();
              }
              router.push(relativeHit);
            },
            children,
          },
          __v: null,
        };
      },
    })
  );
}
</script>

<template>
  <div id="docsearch" class="algolia-search-box" />
</template>

<style lang="scss">
@import url('../assets/search.scss');
</style>
