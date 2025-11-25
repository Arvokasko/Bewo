// useTheme.ts
import { useColorScheme } from 'react-native';
import { lightTheme, darkTheme } from "../app/constants/Colors";

export const useTheme = () => {
    const scheme = useColorScheme();
    return scheme === 'dark' ? darkTheme : lightTheme;
};
