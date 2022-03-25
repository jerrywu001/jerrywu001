export function useDarkTheme() {
  const dark = useLocalStorage('dark-theme', false);

  function toggleDark() {
    dark.value = !dark.value;
  }

  watch(
    dark,
    () => {
      if (process.client && document) {
        const doc = document.documentElement;
        if (dark.value) {
          doc.dataset.theme = 'dark';
          doc.classList.add('dark');
        } else {
          doc.dataset.theme = '';
          doc.classList.remove('dark');
        }
      }
    },
    { immediate: true }
  );

  return {
    dark,
    toggleDark,
  };
}
