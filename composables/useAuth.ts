import { type User } from '@supabase/supabase-js';

export default function useAuth(saveCurrentPath = true) {
  const user = useSupabaseUser() as Ref<User>;

  function toLogin() {
    if (!user.value && process.client) {
      const withCurrentPathUrl = `${encodeURIComponent(
        window.location.href.split(window.location.host)[1]
      )}`;

      navigateTo(
        saveCurrentPath ? `/login?redirect=${withCurrentPathUrl}` : '/login'
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
    { immediate: true }
  );
}
