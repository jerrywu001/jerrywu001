import { ICategory } from '~~/types';

export default function useCategories() {
  const categories = useState('categories', () => ({
    data: [] as ICategory[],
  }));

  function updateCategories(items: ICategory[] = []) {
    categories.value.data = toRaw(items);
  }

  return {
    categories,
    updateCategories,
  };
}
