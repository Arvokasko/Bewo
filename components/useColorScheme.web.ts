import { useThemePreference } from './ThemePreferenceContext';

export function useColorScheme() {
  const { colorScheme } = useThemePreference();
  return colorScheme;
}
