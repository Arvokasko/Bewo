import { auth } from '@/FirebaseConfig';
import { ThemePreferenceProvider } from '@/components/ThemePreferenceContext';
import { useColorScheme } from '@/components/useColorScheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { User, onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { Text } from 'react-native';
import 'react-native-get-random-values';
import { SafeAreaView } from 'react-native-safe-area-context';
// import * as Notifications from "expo-notifications";

function NavigationStack({ user }: { user: User | null | undefined }) {
    const colorScheme = useColorScheme();

    if (user === undefined) {
        return <SafeAreaView style={{ alignItems: 'center', justifyContent: "center" }}>
            <Text style={{ fontSize: 50 }}>Loading...</Text>
        </SafeAreaView>;
    }

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
            console.log("Auth state changed:", firebaseUser);
            setUser(firebaseUser ?? null);
        });
        return unsubscribe;
    }, []);

    return (
        <ThemePreferenceProvider>
            <NavigationStack user={user} />
        </ThemePreferenceProvider>
    );
}