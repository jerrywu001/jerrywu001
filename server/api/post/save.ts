import { serverSupabaseUser } from '#supabase/server';
import { formatSiteUser } from '~~/utils/utils';
import { prisma } from '~~/utils/server';
import type { ISavePost } from '~~/types';

export default defineEventHandler(async (event) => {
  const userSession = await serverSupabaseUser(event);
  const body = await readBody<ISavePost>(event);

  if (!userSession?.id) {
    throw createError({
      statusCode: 401,
      statusMessage: 'please login!',
    });
  }

  let result = null;
  const user = formatSiteUser(userSession);

  const {
    postId,
    title,
    content,
    source,
    tags,
    prevTags,
    tocs = [],
    keywords = '',
    description = null,
    cover = null,
  } = body;

  const disconnectTags = (prevTags || []).filter((p) => !(tags || []).find((t) => t.name === p.name));

  const data = {
    postId,
    title: decodeURIComponent(title.trim()),
    content,
    cover,
    description,
    keywords,
    tocs,
    tags: {
      connectOrCreate: tags.length > 0 ? tags?.map((tag) => ({
        where: { name: tag.name },
        create: { name: tag.name },
      })) : undefined,
      disconnect: disconnectTags?.length > 0 ? disconnectTags?.map((tag) => ({
        name: tag.name,
      })) : undefined,
    },
    source,
    author: {
      connect: {
        userId: userSession.id,
      },
    },
  };

  let message = '';

  try {
    const selected = await prisma.post.findUnique({ where: { postId } });
    if (selected) {
      // update
      if (selected?.title !== decodeURIComponent(title)) {
        const v = await prisma.post.findUnique({
          where: { title: decodeURIComponent(title) },
        });

        if (v && v.postId) {
          message = 'This title already exists, please update it~';
        }
      }

      if (!message) {
        result = await prisma.post.update({
          where: { postId, authorId: user.userId },
          data,
        });
      }
    } else {
      // create
      const v = await prisma.post.findUnique({
        where: { title: decodeURIComponent(title) },
      });

      if (v && v.postId) {
        message = 'Title already exists, please change it~';
      } else {
        result = await prisma.post.create({ data });
      }
    }
  } catch (e) {
    console.error(e);
  }

  return {
    message,
    data: result,
  };
});
