import { type SiteUser } from '~~/types';

export default function useSyncUser() {
  const siteUser = useState('site-user', () => ({}) as SiteUser);

  return { siteUser };
}
