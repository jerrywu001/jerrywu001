import { prisma } from '~~/utils/server';
import { IBlog } from '~~/types';

const caches = {} as Record<string, any>;

export default defineEventHandler(async (event) => {
  let rs = {} as any;

  const id = getRouterParam(event, 'id') as string;
  const body = await readBody<{ cacheKeys: Record<string, boolean> }>(event);
  const useCache = !!body?.cacheKeys?.[id];

  if (useCache && caches[id]) {
    return caches[id];
  }

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

    caches[id] = rs;
  } catch (e) {
    console.error(e);
  }

  return rs as IBlog;
});
