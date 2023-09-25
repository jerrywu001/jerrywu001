<template>
  <NuxtLayout name="auth" title="Sign In">
    <template #header>Sign In</template>

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
        placeholder="Email address"
      />
    </div>

    <div class="mt-4 flex justify-between">
      <label
        class="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-200"
        for="loggingPassword"
      >
        Password
      </label>
      <NuxtLink
        to="/forgot-password"
        class="text-xs text-blue-500 dark:text-gray-300 hover:underline"
      >
        Forget Password?
      </NuxtLink>
    </div>
    <div class="relative flex items-center">
      <span class="absolute">
        <icon-password />
      </span>

      <input
        id="password"
        v-model.trim="password"
        type="password"
        class="bd-input"
        placeholder="Password"
      />
    </div>

    <div class="mt-6">
      <bd-primary-button
        name="Sign in"
        :loading="loging"
        :disabled="disabledSignIn"
        @click="loginWithEmailPassword"
      />

      <p class="mt-4 text-center text-gray-600 dark:text-gray-400">
        or just
      </p>

      <bd-default-button
        name="Sign in with Github"
        :loading="authing"
        @click="() => doAuth('github')"
      >
        <icon-github class="mx-2" :class="{ hidden: authing }" />
      </bd-default-button>

      <bd-default-button
        name="Sign in with Microsoft"
        :loading="authing"
        @click="() => doAuth('azure')"
      >
        <icon-azure class="mx-2" :class="{ hidden: authing }" />
      </bd-default-button>

      <bd-default-button
        name="Sign in with Google"
        :loading="authing"
        @click="() => doAuth('google')"
      >
        <icon-google class="mx-2" :class="{ hidden: authing }" />
      </bd-default-button>

      <div class="mt-6 text-center">
        <NuxtLink
          to="/signup"
          replace
          class="text-sm text-blue-500 hover:underline dark:text-blue-400"
        >
          Don’t have an account yet? Sign up
        </NuxtLink>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { AuthError, type OAuthResponse } from '@supabase/supabase-js';
import useLoginAuth, { login } from '~~/composables/useLogin';
import { useAuthCallbackError } from '~~/composables/useAuth';
import { validEmail } from '~~/utils/utils';

let authError = null as AuthError | null;
let authData = {} as OAuthResponse;

const { data } = useLoginAuth();
const supabase = useSupabaseClient();
const { $toast } = useNuxtApp();

const email = ref('');
const password = ref('');
const loging = ref(false);
const authing = ref(false);

const disabledSignIn = computed(() => {
  return (
    !password.value || !validEmail(email.value) || password.value.length < 6
  );
});

async function doAuth(provider = 'github') {
  authing.value = true;

  if (provider === 'github') {
    ({ authError, authData } = await login());
  }

  if (provider === 'google') {
    ({ authError, authData } = await login({
      provider: 'google',
      authOptions: {
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    }));
  }

  if (provider === 'azure') {
    ({ authError, authData } = await login({
      provider: 'azure',
      authOptions: {
        scopes: 'email',
      },
    }));
  }

  authing.value = false;

  if (!authError) {
    data.value = authData;
  }

  const errMsg = getAuthErrorMsg(authError);
  if (errMsg) {
    $toast.error(errMsg);
  }
}

async function loginWithEmailPassword() {
  loging.value = true;

  const { data: resData, error: resError } =
    await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    });

  authError = resError;
  // @ts-ignore
  authData = (resData || {}) as OAuthResponse;
  loging.value = false;

  if (!authError) {
    data.value = authData;
  }

  const errMsg = getAuthErrorMsg(authError);
  if (errMsg) {
    $toast.error(errMsg);
  }
}

useAuthCallbackError();
</script>
