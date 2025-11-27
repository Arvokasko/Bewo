// theme/useTheme.ts
import { useColorScheme } from '@/components/useColorScheme';
import { darkTheme, lightTheme } from './theme';

export const useTheme = () => {
    const scheme = useColorScheme();
    return scheme === 'dark' ? darkTheme : lightTheme;
};
