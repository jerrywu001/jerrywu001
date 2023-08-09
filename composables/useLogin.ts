import { type OAuthResponse, AuthError } from '@supabase/supabase-js';

interface AuthOption {
  /** A URL to send the user to after they are confirmed. */
  redirectTo?: string;
  /** A space-separated list of scopes granted to the OAuth application. */
  scopes?: string;
  /** An object of query params */
  queryParams?: { [key: string]: string };
  /** If set to true does not immediately redirect the current browser context to visit the OAuth authorization page for the provider. */
  skipBrowserRedirect?: boolean;
}

interface LoginOptions<T = OAuthResponse> {
  provider?: 'google' | 'azure' | 'github';
  onSuccess?: (data: T) => void;
  onFail?: (error: AuthError | null) => void;
  authOptions?: AuthOption;
}

function getRedirectPath() {
  return location.href.split('redirect=')[1] || '/';
}

export async function login<T = OAuthResponse>(
  props?: LoginOptions<T>
): Promise<{ authError: AuthError | null; authData: T }> {
  const supabase = useSupabaseClient();
  const { public: runtimeConfig } = useRuntimeConfig();

  const { provider = 'github', authOptions = {} } = props || {};

  const { error: authError, data } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${
        runtimeConfig.baseUrl
      }/login?redirect=${getRedirectPath()}`,
      ...authOptions,
    },
  });

  const authData = data || ({} as T);

  // @ts-ignore
  return { authData, authError };
}

export default function useLoginAuth<T = OAuthResponse>() {
  const user = useSupabaseUser();

  const data = useState('login-data', () => null as T);
  const error = useState('login-error', () => null as AuthError | null);

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

  watch(error, () => {
    if (error && error.value && error.value.message) {
      alert(error.value.message);
    }
  });

  return {
    error,
    data,
  };
}
