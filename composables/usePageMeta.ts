import { IMeta } from '~~/types';

export default function usePageMeta() {
  const meta = useState('pageMeta', () => ({}) as IMeta);

  function updatePageMeta(data = {} as IMeta) {
    meta.value = data;
  }

  return {
    meta,
    updatePageMeta,
  };
}
