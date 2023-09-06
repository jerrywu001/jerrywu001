export default function usePostCache() {
  const cacheKeys = useState('use-cache', () => ({}) as Record<string, boolean>);

  return {
    cacheKeys,
  };
}
