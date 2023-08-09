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

  <br />
  <br />
  <hr />
  <br />
  <br />

  <div>
    <h3>login with email/password</h3>
    <br />
    <div>
      <input
        v-model.lazy="email"
        type="text"
        placeholder="enter email"
        autocomplete="autocomplete"
      />
    </div>
    <div>
      <input
        v-model.lazy="password"
        type="password"
        placeholder="enter password"
      />
    </div>
    <br />
    <div>
      <button :disabled="!email || !password" @click="() => doLogin('email')">
        submit
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { AuthError, OAuthResponse } from '@supabase/supabase-js';
import useLoginAuth, { login } from '~~/composables/useLogin';

let authError = null as AuthError | null;
let authData = {} as OAuthResponse;

const supabase = useSupabaseClient();
const { data, error } = useLoginAuth();

const email = ref('');
const password = ref('');

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

  if (provider === 'email') {
    // https://supabase.com/docs/reference/javascript/auth-signup
    const { data: resData, error: resError } =
      await supabase.auth.signInWithPassword({
        email: email.value,
        password: password.value,
      });

    authError = resError;
    // @ts-ignore
    authData = (resData || {}) as OAuthResponse;
  }

  if (!authError) {
    data.value = authData;
  } else {
    error.value = authError;
    console.log(error.value.message);
  }
}
</script>
