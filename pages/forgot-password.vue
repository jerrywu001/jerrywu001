<template>
  <NuxtLayout name="auth" title="Forgot Passowrd">
    <template #header>
      Forgot Passowrd
    </template>

    <div class="w-full max-w-md mx-auto mt-6">
      <label
        class="mt-6 block mb-2 text-sm font-medium text-gray-600 dark:text-gray-200"
        for="LoggingEmailAddress"
      >
        Email Address
      </label>
      <div class="relative flex items-center mt-2">
        <span class="absolute">
          <icon-email />
        </span>

        <input
          id="email"
          v-model.trim="email"
          autocomplete="on"
          type="text"
          class="bd-input"
          placeholder="Enter your email address"
        />
      </div>

      <bd-primary-button
        name="Send a magic link"
        class="mt-4"
        :disabled="disabledSubmit"
        :loading="loading"
        @click="resetPassword"
      />
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { validEmail } from '~~/utils/utils';
import { useAuthCallbackError } from '~~/composables/useAuth';
import { AuthError } from '@supabase/supabase-js';

const { $toast } = useNuxtApp();
const supabase = useSupabaseClient();
const { public: runtimeConfig } = useRuntimeConfig();

const loading = ref(false);
const email = ref('');

const disabledSubmit = computed(() => !validEmail(email.value));

async function resetPassword() {
  loading.value = true;
  const { data, error } = await supabase.auth.resetPasswordForEmail(email.value, { redirectTo: `${runtimeConfig.baseUrl}/create-password` });

  loading.value = false;
  resolveSuccess(error);
}

/** see: https://supabase.com/docs/reference/javascript/auth-resetpasswordforemail */
function resolveSuccess(resError: AuthError | null) {
  const errMsg = getAuthErrorMsg(resError);

  if (errMsg) {
    $toast.error(errMsg);
  } else {
    email.value = '';
    $toast.success('A reset link has been sent to your email, please check it.', { autoClose: 5000 });
  }
}

useAuthCallbackError();
</script>
