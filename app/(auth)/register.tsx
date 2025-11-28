// app/(auth)/login.tsx
import { Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { doc, setDoc, getDocs, query, where, collection } from "firebase/firestore";
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import { auth, db } from '../../FirebaseConfig';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { router } from 'expo-router';
import { useThemedStyles } from '@/theme/useThemedStyles';

export default function RegisterScreen() {
    const { theme, styles } = useThemedStyles();

    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const signUp = async () => {
        try {
            if (password !== confirmPassword) {
                Alert.alert("Passwords do not match");
                return;
            }

            // 1. Check if username is already taken
            const q = query(collection(db, "users"), where("username", "==", username));
            const snapshot = await getDocs(q);

            if (!username || !snapshot.empty) {
                Alert.alert("Username already taken");
                return;
            }

            // 2. Create user
            const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredentials.user;

            // 3. Update Auth profile (optional)
            await updateProfile(user, { displayName: username });

            // 4. Save to Firestore
            await setDoc(doc(db, "users", user.uid), {
                username,
                email,
            });

            // 5. Navigate to app
            router.replace("/(tabs)");
        } catch (error: any) {
            Alert.alert("Register failed", error.message);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Register</Text>
            <TextInput
                style={styles.titleInput}
                placeholderTextColor={theme.placeholderColor}
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
            />
            <TextInput
                style={styles.titleInput}
                placeholderTextColor={theme.placeholderColor}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
            />
            <TextInput
                style={styles.titleInput}
                placeholderTextColor={theme.placeholderColor}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <TextInput
                style={styles.titleInput}
                placeholderTextColor={theme.placeholderColor}
                placeholder="Confirm password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
            />
            <TouchableOpacity style={styles.Button} onPress={signUp}>
                <Text style={styles.text}>Make Account</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => router.replace('/(auth)/login')}
            >
                <Text style={styles.authLink}>Already have an account?</Text>
            </TouchableOpacity>
        </SafeAreaView >
    );
}
