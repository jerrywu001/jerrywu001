import { type OAuthResponse, AuthError } from '@supabase/supabase-js';

interface LoginOptions<T> {
  provider?: 'google' | 'apple' | 'github';
  onSuccess?: (data: T) => void;
  onFail?: (error: AuthError | null) => void;
}
function getRedirectPath() {
  return location.href.split('redirect=')[1] || '/';
}

export default function useLogin<T = OAuthResponse>(props?: LoginOptions<T>) {
  const { public: runtimeConfig } = useRuntimeConfig();

  console.warn(
    'runtimeConfig--->',
    runtimeConfig,
    process.env.BASE_URL,
    process.env.HOST
  );

  try {
    console.error(
      'runtimeConfig--->',
      runtimeConfig,
      process.env.BASE_URL,
      process.env.HOST
    );
  } catch (e) {}

  const { provider = 'github', onSuccess, onFail } = props || {};
  const supabase = useSupabaseClient();
  const user = useSupabaseUser();

  const data = useState('login-data', () => null as T);
  const error = useState('login-error', () => null as AuthError | null);

  async function login() {
    const { error: authError, data: authData } =
      await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${
            runtimeConfig.baseUrl
          }/login?redirect=${getRedirectPath()}`,
        },
      });

    if (!error) {
      data.value = authData as T;
      if (onSuccess) onSuccess(data.value);
    } else {
      error.value = authError;
      if (onFail) onFail(authError);
    }
  }

  watch(
    user,
    () => {
      if (user.value) {
        const redirectTo = getRedirectPath();
        navigateTo(decodeURIComponent(redirectTo));
      }
    },
    { immediate: true }
  );

  return {
    error,
    data,
    login,
  };
}
