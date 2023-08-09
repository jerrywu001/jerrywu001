<template>
  <div>
    <button @click="() => doLogin('github')">login</button>
  </div>
  <div>
    <button @click="() => doLogin('azure')">login with microsoft</button>
  </div>
  <div>
    <button @click="() => doLogin('google')">login with google</button>
  </div>
</template>

<script setup lang="ts">
import { AuthError, OAuthResponse } from '@supabase/supabase-js';
import useLoginAuth, { login } from '~~/composables/useLogin';

let authError = null as AuthError | null;
let authData = {} as OAuthResponse;
const { data, error } = useLoginAuth();

async function doLogin(provider = 'github') {
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

  if (!authError) {
    data.value = authData;
  } else {
    error.value = authError;
  }
}
</script>
