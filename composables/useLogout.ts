import { AuthError } from '@supabase/supabase-js';

export default function useLogout() {
  const supabase = useSupabaseClient();

  const error = useState('logout-error', () => null as AuthError | null);

  const logout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error(error);
      return;
    }

    const withCurrentPathUrl = `${encodeURIComponent(
      window.location.href.split(window.location.host)[1]
    )}`;

    await navigateTo(`/login?redirect=${withCurrentPathUrl}`);
  };

  return {
    error,
    logout,
  };
}
