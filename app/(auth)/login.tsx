// app/(auth)/login.tsx
import { Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import { auth } from '../../FirebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { router } from 'expo-router';
import { useThemedStyles } from '@/theme/useThemedStyles';

export default function LoginScreen() {
    const { theme, styles } = useThemedStyles();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const signIn = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.replace('/(tabs)');

        } catch (error: any) {
            alert('Sign in failed: ' + error.message);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Login</Text>
            <TextInput
                style={styles.titleInput}
                placeholder="Email"
                placeholderTextColor={theme.placeholderColor}
                value={email}
                onChangeText={setEmail}
            />
            <TextInput
                style={styles.titleInput}
                placeholder="Password"
                placeholderTextColor={theme.placeholderColor}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <TouchableOpacity style={styles.Button} onPress={signIn}>
                <Text style={styles.text}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => router.replace('/(auth)/register')}
            >
                <Text style={styles.authLink}>Don't have an account?</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}
