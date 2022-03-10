import { ICategory } from '~~/types';

export default function useCategories() {
  const dirs = useState('categories', () => [] as ICategory[]);

  function updateDirs(items: ICategory[] = []) {
    dirs.value = items;
  }

  return {
    dirs,
    updateDirs,
  };
}
