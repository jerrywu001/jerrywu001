import { prisma } from '~~/utils/server';
import type { IBlog } from '~~/types';

export default defineEventHandler(async (event) => {
  let rs = {} as any;

  const id = getRouterParam(event, 'id') as string;

  try {
    rs = await prisma.post.findUnique({
      where: {
        postId: id,
        invalid: false,
      },
      include: {
        tags: true,
        author: true,
        comments: true,
        likes: true,
      },
    });
  } catch (e) {
    console.error(e);
  }

  return rs as IBlog;
});
