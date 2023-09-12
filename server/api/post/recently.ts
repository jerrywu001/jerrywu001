import { prisma } from '~~/utils/server';
import { IBlog } from '~~/types';

export default defineEventHandler(async (event) => {
  let result: IBlog[] = [];

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
  } catch (e) {
    console.error(e);
  }

  return result as IBlog[];
});
