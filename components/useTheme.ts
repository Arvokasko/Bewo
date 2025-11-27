// useTheme.ts
import { darkTheme, lightTheme } from "@/app/constants/Colors";
import { useColorScheme } from '@/components/useColorScheme';

export const useTheme = () => {
    const scheme = useColorScheme();
    return scheme === 'dark' ? darkTheme : lightTheme;
};
