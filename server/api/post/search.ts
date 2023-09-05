import { prisma } from '~~/utils/server';
import { IBlog, IQueyPosts } from '~~/types';

export default defineEventHandler(async (event) => {
  let result: IBlog[] = [];
  const body = await readBody<IQueyPosts>(event);

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
