<template>
  <div
    class="h-[80vh] mt-2 px-4 article-skeleton overflow-hidden sm:px-6 xl:mr-$tocs-width xl:mt-0"
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
