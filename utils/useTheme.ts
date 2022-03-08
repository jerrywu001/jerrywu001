import { useDark, useToggle } from '@vueuse/core';

export function useTheme() {
  const isDark = useDark();
  const toggleDark = useToggle(isDark);

  return {
    toggleDark,
  };
}
