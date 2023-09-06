import { prisma } from '~~/utils/server';
import { IBlog } from '~~/types';

let cache: IBlog[] | null = null;

export default defineEventHandler(async (event) => {
  let result: IBlog[] = [];
  const body = await readBody<{ cacheKeys?: Record<string, boolean> }>(event);
  const useCache = !!body?.cacheKeys?.recently;

  if (useCache && cache) {
    return cache;
  }

  try {
    const rs = await prisma.post.findMany({
      where: {
        NOT: {
          content: { equals: [] },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    // @ts-ignore
    result = rs as IBlog[];
    // @ts-ignore
    cache = rs as IBlog[];
  } catch (e) {
    console.error(e);
  }

  return result as IBlog[];
});
