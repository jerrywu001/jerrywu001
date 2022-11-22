<template>
  <Sandpack template="react" :files="{ '/App.js': code }" />
</template>

<script setup lang="ts">
import { Sandpack } from 'sandpack-vue3';

const code = `export default function App() {
  return <h1>Hello Sandpack</h1>
}`;
</script>
