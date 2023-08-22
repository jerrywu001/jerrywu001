import { prisma } from '~~/utils/server';
import { Tag } from '~/types';

export default defineEventHandler(async () => {
  let result = [] as Tag[];
  try {
    const rs = await prisma.tag.findMany();
    result = rs as Tag[];
  } catch (e) {
    console.error(e);
  }

  return result;
});
