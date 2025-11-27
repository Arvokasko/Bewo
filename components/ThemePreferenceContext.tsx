import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';
import { ColorSchemeName, useColorScheme as useSystemColorScheme } from 'react-native';

type ThemePreference = 'light' | 'dark' | 'system';

type ThemePreferenceContextValue = {
  preference: ThemePreference;
  colorScheme: NonNullable<ColorSchemeName>;
  setPreference: (preference: ThemePreference) => void;
  hydrated: boolean;
};

const STORAGE_KEY = 'themePreference';

const ThemePreferenceContext = createContext<ThemePreferenceContextValue | undefined>(undefined);

export const ThemePreferenceProvider = ({ children }: { children: React.ReactNode }) => {
  const systemScheme = useSystemColorScheme() ?? 'light';
  const [preference, setPreferenceState] = useState<ThemePreference>('system');
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const readPreference = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored === 'light' || stored === 'dark' || stored === 'system') {
          setPreferenceState(stored);
        }
      } catch (error) {
        console.warn('Unable to read stored theme preference', error);
      } finally {
        setHydrated(true);
      }
    };

    readPreference();
  }, []);

  const setPreference = useCallback((nextPreference: ThemePreference) => {
    setPreferenceState(nextPreference);
    AsyncStorage.setItem(STORAGE_KEY, nextPreference).catch((error) =>
      console.warn('Unable to persist theme preference', error)
    );
  }, []);

  const value = useMemo<ThemePreferenceContextValue>(
    () => ({
      preference,
      colorScheme: preference === 'system' ? systemScheme : preference,
      setPreference,
      hydrated,
    }),
    [preference, setPreference, systemScheme, hydrated]
  );

  return <ThemePreferenceContext.Provider value={value}>{children}</ThemePreferenceContext.Provider>;
};

export const useThemePreference = () => {
  const context = useContext(ThemePreferenceContext);
  if (!context) {
    throw new Error('useThemePreference must be used within a ThemePreferenceProvider');
  }
  return context;
};

export type { ThemePreference };

