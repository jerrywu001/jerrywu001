import { prisma } from '~~/utils/server';
import { serverSupabaseClient } from '#supabase/server';

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event);
  const { data: { user: userSession } } = await client.auth.getUser();

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
