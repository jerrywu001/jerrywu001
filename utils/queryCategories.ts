import { createStorage } from 'unstorage';
import { IArticleData, ICategory } from '~~/types';

const storage = createStorage({});

/**
 * Retrieves the categories from the storage cache or fetches them from the API.
 *
 * @return {Promise<ICategory[]>} The categories retrieved from the storage cache or the API.
 */
export default async function queryCategories(forceUpdate = false) {
  const categoriesCache = await storage.getItem<ICategory[]>('site:catefories');
  let result = categoriesCache || [];

  console.log('categories cache:', categoriesCache);

  if (!result.length || forceUpdate) {
    console.log('update categories cache');
    try {
      const res = await useFetch<IArticleData>('/api/post?postname=other_full');
      result = res.data?.value?.categories || [];
      updateCategoriesCache(result);
    } catch (err) {
      console.warn(err);
    }
  }

  return result;
}

/**
 * Updates the categories cache with the given items.
 *
 * @param {ICategory[]} items - The items to update the cache with.
 */
export const updateCategoriesCache = (items: ICategory[]) => {
  storage.setItem('site:catefories', items);
};
