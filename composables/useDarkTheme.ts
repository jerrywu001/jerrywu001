export function useDarkTheme() {
  const dark = useLocalStorage('dark-theme', false);

  function toggleDark() {
    dark.value = !dark.value;
  }

  watch(
    dark,
    () => {
      if (process.client && document) {
        if (dark.value) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
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
