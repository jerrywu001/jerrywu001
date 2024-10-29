import { prisma } from '~~/utils/server';

export default defineEventHandler(async (event) => {
  const userId = getRouterParam(event, 'id') as string;

  let result = {} as any;

  try {
    result = await prisma.user.findUnique({
      where: { userId },
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
  } catch (e) {
    console.error(e);
  }

  return result;
});
