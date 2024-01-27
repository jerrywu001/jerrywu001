import { prisma } from '~~/utils/server';
import type { Tag } from '~/types';

export default defineEventHandler(async (event) => {
  let result = [] as Tag[];

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
  } catch (e) {
    console.error(e);
  }

  return result;
});
