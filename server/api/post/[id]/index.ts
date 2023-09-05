import { prisma } from '~~/utils/server';
import { IBlog } from '~~/types';
import { isUUID } from '~~/utils/utils';

export default defineEventHandler(async (event) => {
  let rs = {} as any;

  const id = getRouterParam(event, 'id') as string;
  const condition = isUUID(id) ? { postId: id } : { title: decodeURIComponent(id) };

  try {
    rs = await prisma.post.findUnique({
      where: {
        ...condition,
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
