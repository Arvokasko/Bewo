import { useEffect, useState } from 'react';
import { ThemeProvider, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/FirebaseConfig';
import { useColorScheme } from '@/components/useColorScheme';
import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import 'react-native-get-random-values';
// import * as Notifications from "expo-notifications";

export default function RootLayout() {
    const colorScheme = useColorScheme();
    const [user, setUser] = useState<User | null | undefined>(undefined);


    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            console.log("Auth state changed:", firebaseUser);
            setUser(firebaseUser ?? null);
        });
        return unsubscribe;
    }, []);

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