<template>
  <NuxtLayout name="auth" title="Sign Up">
    <template #header>Sign Up</template>

    <div class="relative flex items-center mt-6">
      <span class="absolute">
        <icon-email class="mx-3" />
      </span>

      <input
        id="email"
        v-model.trim="email"
        autocomplete="on"
        type="text"
        class="bd-input"
        placeholder="Email address"
      />
    </div>

    <div class="relative flex items-center mt-4">
      <span class="absolute">
        <icon-password />
      </span>

      <input
        id="password"
        v-model.trim="password"
        type="password"
        class="bd-input"
        placeholder="Password: at least 6 chars"
      />
    </div>

    <div class="relative flex items-center mt-4">
      <span class="absolute">
        <icon-password />
      </span>

      <input
        id="repassword"
        v-model.trim="rePassword"
        type="password"
        class="bd-input"
        placeholder="Confirm Password"
      />
    </div>

    <div class="mt-6">
      <bd-primary-button
        name="Sign up"
        :loading="authing"
        :disabled="disabledSignUp"
        @click="signUpWithEmailPassword"
      />

      <p class="mt-4 text-center text-gray-600 dark:text-gray-400">
        or just
      </p>

      <bd-default-button
        name="Sign up with email link"
        :loading="loading"
        :disabled="disabledSignUpWithEmail"
        @click="signUpWithEmail"
      >
        <icon-email class="mx-2" :class="{ hidden: loading }" />
      </bd-default-button>

      <div class="mt-6 text-center">
        <NuxtLink
          to="/login"
          replace
          class="text-sm text-blue-500 hover:underline dark:text-blue-400"
        >
          Already have an account? Sign in
        </NuxtLink>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { AuthError } from '@supabase/supabase-js';
import { validEmail } from '~~/utils/utils';
import { useAuthCallbackError } from '~~/composables/useAuth';
import useLoginAuth from '~~/composables/useLogin';

const supabase = useSupabaseClient();
const { public: runtimeConfig } = useRuntimeConfig();
const { $toast } = useNuxtApp();

const email = ref('');
const password = ref('');
const rePassword = ref('');
const authing = ref(false);
const loading = ref(false);

const disabledSignUpWithEmail = computed(() => !validEmail(email.value));

const disabledSignUp = computed(() => {
  return (
    disabledSignUpWithEmail.value ||
    password.value.length < 6 ||
    password.value !== rePassword.value
  );
});

async function signUpWithEmailPassword() {
  authing.value = true;

  const { error: resError } = await supabase.auth.signUp({
    email: email.value,
    password: password.value,
  });

  resolveSuccess(resError);
}

async function signUpWithEmail() {
  loading.value = true;

  const { error: resError } = await supabase.auth.signInWithOtp({
    email: email.value,
    options: {
      emailRedirectTo: `${runtimeConfig.baseUrl}/create-password`,
    },
  });

  resolveSuccess(resError);
}

/** see: https://supabase.com/docs/reference/javascript/auth-signup */
function resolveSuccess(resError: AuthError | null) {
  authing.value = false;
  loading.value = false;

  const errMsg = getAuthErrorMsg(resError);
  if (errMsg) {
    $toast.error(errMsg);
  } else {
    email.value = '';
    password.value = '';
    rePassword.value = '';
    $toast.success('A confirm link has been sent to your email, please check it.', {
      autoClose: 5000,
    });
  }
}

useLoginAuth();
useAuthCallbackError();
</script>
