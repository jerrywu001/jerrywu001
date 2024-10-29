<template>
  <slot />
</template>

<script setup lang="ts">
import { type SiteUser } from '~~/types';
import { isCDNAvatar } from '~~/utils/utils';

const { siteUser } = useSyncUser();
const supabase = useSupabaseClient();

async function syncUserToDB() {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !user?.id) return;

  const newUser = formatSiteUser(user);

  if (isUserSynced(newUser)) {
    siteUser.value = newUser;
    return;
  }

  siteUser.value = {
    ...newUser,
    nickname: null,
    avatar: null,
  };

  // sync user to database
  try {
    useFetch('/api/user/sync').then((r) => {
      const rs = r.data?.value as SiteUser;

      if (rs && rs.userId) {
        siteUser.value = rs;
      }
    });
  } catch (error) {
    // console.log(error);
  }
}

function isUserSynced(newUser: SiteUser) {
  return isCDNAvatar(newUser?.avatar || '');
}

syncUserToDB();
</script>
