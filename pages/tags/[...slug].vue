<template>
  <Html>
    <Head>
      <Title>Tags {{ id }}</Title>
    </Head>
  </Html>
  <blog-header />
  <div class="h-[calc(100vh-56px)] top-[56px] overflow-y-auto fixed w-screen box-border">
    tags {{ id }}
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const { public: runtimeConfig } = useRuntimeConfig();

const { params: { slug } } = route;
const [id] = slug || [];
</script>
