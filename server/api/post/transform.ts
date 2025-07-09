import { getTransformedVNode } from '~/utils/markdown';

export default defineEventHandler(async (event) => {
  const { source } = await readBody<{
    key: string;
    source: string; 
  }>(event);

  const { tocs, content } = await getTransformedVNode(source);

  return {
    tocs,
    content,
  };
});
