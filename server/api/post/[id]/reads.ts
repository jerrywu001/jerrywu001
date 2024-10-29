import { prisma } from '~~/utils/server';

export default defineEventHandler(async (event) => {
  try {
    const { req } = event.node;
    const ip = req.headers['x-forwarded-for'] as string || req.socket.remoteAddress as string;
    const id = getRouterParam(event, 'id') as string;

    if (!['::1', '127.0.0.1', '::ffff:127.0.0.1'].includes(ip)) {
      await prisma.post.update({
        where: { postId: id },
        data: {
          totalReads: { increment: 1 },
          reads: { create: { ip } },
        },
      });
    }
  } catch (e) {
    console.error(e);
  }

  return { ok: true };
});
