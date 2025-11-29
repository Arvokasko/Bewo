import { useEffect, useState } from 'react';
import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/FirebaseConfig';
import { ThemePreferenceProvider } from '@/components/ThemePreferenceContext';
import { useColorScheme } from '@/components/useColorScheme';
import { ErrorProvider } from '@/components/ErrorModal';
import { ConfirmProvider } from '@/components/ConfirmModal';
import 'react-native-get-random-values';



function NavigationStack({ user }: { user: User | null | undefined }) {
    // get the colorscheme that the user has declared for the app
    const colorScheme = useColorScheme();

    // loading screen when launching the app
    if (user === undefined) {
        return (
            <SafeAreaView style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: "#1B2028", flex: 1 }}>
            </SafeAreaView>
        );
    }

    // use theme dynamic header for the bottom navigation of the main pages
    return (
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name={user ? '(tabs)' : '(auth)'} />
            </Stack>
        </ThemeProvider>
    );
}

export default function RootLayout() {
    const [user, setUser] = useState<User | null | undefined>(undefined);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            setUser(firebaseUser ?? null);
        });
        return unsubscribe;
    }, []);

    return (
        <ThemePreferenceProvider>
            <ErrorProvider>
                <ConfirmProvider>
                    <NavigationStack user={user} />
                </ConfirmProvider>
            </ErrorProvider>
        </ThemePreferenceProvider>
    );
}
