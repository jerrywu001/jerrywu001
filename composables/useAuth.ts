import { AuthError, type User } from '@supabase/supabase-js';

export default function useAuth(saveCurrentPath = true) {
  const user = useSupabaseUser() as Ref<User>;

  function toLogin() {
    if (!user.value && import.meta.client) {
      const withCurrentPathUrl = `${encodeURIComponent(
        window.location.href.split(window.location.host)[1],
      )}`;

      navigateTo(
        saveCurrentPath ? `/login?redirect=${withCurrentPathUrl}` : '/login',
      );
    }
  }

  onBeforeMount(() => {
    toLogin();
  });

  watch(
    user,
    () => {
      toLogin();
    },
    { immediate: true },
  );
}

export function useAuthCallbackError() {
  const route = useRoute();
  const { $toast } = useNuxtApp();

  onBeforeMount(() => {
    const callbackError = (route.hash || route.fullPath)?.split('error_description=')[1] || '';

    if (callbackError) {
      $toast.error(callbackError.replace(/\+/g, ' '));
    }
  });
}

export function getAuthErrorMsg(error: AuthError | null) {
  let errorMsg = '';
  const msg = error?.message || '';

  if (msg) {
    errorMsg =
      msg === 'Invalid login credentials' ? 'email or password error' : msg;
  }
  return errorMsg;
}
