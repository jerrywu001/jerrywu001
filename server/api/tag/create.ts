import { prisma } from '~~/utils/server';
import type { Tag } from '~/types';

export default defineEventHandler(async (event) => {
  const { name } = await readBody<{ name: string }>(event);

  let tag = {} as Tag;
  let msg = '';

  try {
    const selected = await prisma.tag.findFirst({ where: { name } });

    if (selected) {
      msg = 'tag exists';
    } else {
      const rs = await prisma.tag.create({ data: { name } });

      tag = rs as Tag;
    }
  } catch (e) {
    console.error(e);
  }

  return {
    msg,
    tag,
  };
});
