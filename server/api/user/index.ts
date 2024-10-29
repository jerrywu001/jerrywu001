import { prisma } from '~~/utils/server';
import { serverSupabaseUser } from '#supabase/server';

export default defineEventHandler(async (event) => {
  const userSession = await serverSupabaseUser(event);

  if (!userSession?.id) return null;

  let result = [] as any[];

  try {
    const rs = await prisma.user.findMany({
      where: { userId: userSession.id },
      include: {
        posts: {
          include: {
            tags: { include: { blogs: true } },
            favorites: true,
            likes: true,
            comments: true,
            reads: true,
            topic: true,
            author: true,
          },
        },
      },
    });

    result = rs as any[];
  } catch (e) {
    console.error(e);
  }

  return result;
});
