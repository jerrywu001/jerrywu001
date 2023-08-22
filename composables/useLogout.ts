import { AuthError } from '@supabase/supabase-js';
import { SiteUser } from 'types';

export default function useLogout() {
  const { siteUser } = useSyncUser();
  const supabase = useSupabaseClient();

  const error = useState('logout-error', () => null as AuthError | null);

  const logout = async () => {
    const { error: err } = await supabase.auth.signOut();

    if (err) {
      console.error(err);
      return;
    }

    const withCurrentPathUrl = `${encodeURIComponent(
      window.location.href.split(window.location.host)[1],
    )}`;

    navigateTo(`/login?redirect=${withCurrentPathUrl}`);
    siteUser.value = {} as SiteUser;
  };

  return {
    error,
    logout,
  };
}
