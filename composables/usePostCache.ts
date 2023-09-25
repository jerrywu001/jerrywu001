import type { IBlog, Tag } from '~/types';

export default function usePostCache() {
  const posts = useState('use-cache', () => ([]) as IBlog[]);
  const tagList = useState('use-tag-list', () => ([]) as Tag[]);
  const postMap = useState('use-post-map', () => ({} as Record<string, IBlog>));
  const scrollTop = useState('use-scroll-top', () => 0);

  return {
    posts,
    tagList,
    postMap,
    scrollTop,
  };
}
