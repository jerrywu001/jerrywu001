<template>
  <div
    class="article-skeleton h-[80vh] overflow-hidden px-4 sm:px-6 mt-2 xl:mt-0 xl:mr-$tocs-width"
  >
    <skeleton-image effect="wave" :width="400" :height="200" />
    <skeleton-text effect="wave" tag="h1">
      XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
    </skeleton-text>
    <skeleton-block tag="p" width="80%" effect="wave" />
    <skeleton-block tag="p" width="80%" effect="wave" />
    <skeleton-text effect="wave" tag="h2">
      XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
    </skeleton-text>
    <skeleton-block tag="p" width="80%" effect="wave" />
    <skeleton-block tag="p" width="80%" effect="wave" />
    <skeleton-text effect="wave" tag="h3">
      XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
    </skeleton-text>
    <skeleton-block tag="p" effect="wave" />
    <skeleton-block tag="p" effect="wave" width="80%" />
    <skeleton-block tag="p" effect="wave" width="60%" />
  </div>
</template>

<script setup lang="ts">
import {
  SkeletonBlock,
  SkeletonImage,
  SkeletonText,
} from 'skeleton-elements/vue';
</script>
