import { prisma } from '~~/utils/server';
import { Tag } from '~/types';

let caches = [] as any[];

export default defineEventHandler(async (event) => {
  let result = [] as Tag[];
  const body = await readBody<{ cacheKeys?: Record<string, boolean> }>(event);
  const useCache = !!body?.cacheKeys?.['tags-all'];

  if (useCache && caches.length) {
    return caches;
  }

  try {
    const rs = await prisma.tag.findMany({
      include: {
        _count: {
          select: { blogs: true },
        },
      },
    });
    // @ts-ignore
    result = rs as Tag[];
    caches = rs;
  } catch (e) {
    console.error(e);
  }

  return result;
});
