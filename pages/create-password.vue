<template>
  <NuxtLayout name="auth" title="Set Your Passowrd">
    <template #header>Hello, {{ email }}</template>

    <div class="flex items-center mt-6">
      <div class="flex items-center mx-2">
        <span class="text-gray-800 dark:text-white">Please set your password</span>
      </div>
    </div>

    <div class="w-full max-w-md mx-auto mt-6">
      <div>
        <div>
          <input
            id="password"
            v-model.trim="password"
            type="password"
            placeholder="Password: at least 6 chars"
            class="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
          />
        </div>

        <div>
          <input
            id="repassword"
            v-model.trim="rePassword"
            placeholder="Confirm Password"
            type="password"
            class="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
          />
        </div>

        <bd-primary-button
          name="Sign in"
          class="mt-4"
          :disabled="disabledSubmit"
          :loading="loading"
          @click="submit"
        />
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { User } from '@supabase/supabase-js';
import { useAuthCallbackError } from '~~/composables/useAuth';

const user = useSupabaseUser() as Ref<User>;
const supabase = useSupabaseClient();
const { $toast } = useNuxtApp();

const password = ref('');
const rePassword = ref('');
const loading = ref(false);

const email = computed(() => user.value?.role === 'authenticated' ? user.value?.email ?? '' : '');

const disabledSubmit = computed(() => (
  !email.value ||
    password.value.length < 6 ||
    rePassword.value !== password.value
));

const submit = async () => {
  loading.value = true;

  // https://supabase.com/docs/guides/auth/auth-password-reset#update-password
  const { error: resError } = await supabase.auth.updateUser({
    password: password.value,
  });

  loading.value = false;

  const errMsg = getAuthErrorMsg(resError);
  if (errMsg) {
    $toast.error(errMsg);
  } else {
    $toast.success('Password set successfully, and also logined.');
    navigateTo('/');
  }
};

useAuthCallbackError();
</script>

<style lang="postcss">
body {
  @apply min-h-screen bg-white dark:bg-gray-800 dark:text-gray-200;
}
</style>
