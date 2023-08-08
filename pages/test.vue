<template>
  <Html>
    <Head>
      <Title>test</Title>
    </Head>
  </Html>
  <div
    class="bg-white font-montserrat h-100vh p-6 dark:bg-slate-900 dark:text-white/80"
  >
    <p>{{ user?.email }}</p>
    <p>{{ runtimeConfig?.baseUrl }}</p>
    <p>{{ runtimeConfig?.dev }}</p>
    <p>{{ runtimeConfig?.host }}</p>
    <p>{{ runtimeConfig?.port }}</p>
    <button @click="logout">logout</button>
  </div>
</template>

<script setup lang="ts">
import { User } from '@supabase/supabase-js';

definePageMeta({
  layout: false,
  key: 'index',
  pageTransition: false,
  layoutTransition: false,
});

const { logout } = useLogout();

const user = ref({} as User);

const { public: runtimeConfig } = useRuntimeConfig();

const { data } = await useFetch('/api/me', {
  headers: useRequestHeaders(['cookie']),
});

user.value = data.value as User;

useAuth();
</script>
