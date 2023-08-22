import { serverSupabaseUser } from '#supabase/server';
import { formatSiteUser } from '~~/utils/utils';
import { prisma, uploadSupabaseAvatar, updateSupabaseAvatar } from '~~/utils/server';

// save supabase user to postgrel database, and uoload auth avatar(eg. github/google) to imagekit
export default defineEventHandler(async (event) => {
  const userSession = await serverSupabaseUser(event);
  if (!userSession?.id) return null;

  let result = null;

  try {
    let dbAvatar: string | null = null;
    const user = formatSiteUser(userSession);

    const dbUser = await prisma.user.findUnique({
      where: { userId: user.userId },
    });

    if (dbUser?.userId) {
      dbAvatar = dbUser.avatar;
      result = dbUser;

      console.error('user returned from db', dbUser?.avatar);
    } else {
      dbAvatar = await uploadSupabaseAvatar({
        avatar: user.avatar,
        userId: user.userId,
      });

      user.avatar = dbAvatar;
      result = await prisma.user.upsert({
        where: { userId: user.userId },
        update: user,
        create: user,
      });

      console.error('sync user to server', result?.avatar);
    }

    updateSupabaseAvatar(dbAvatar, event);
  } catch (e) {
    console.error(e);
  }

  return result;
});
