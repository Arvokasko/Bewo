import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth, db } from '../../FirebaseConfig';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, getDocs, query, where, collection } from 'firebase/firestore';
import { router } from 'expo-router';
import { useThemedStyles } from '@/theme/useThemedStyles';
import { useError } from '@/components/ErrorModal';



export default function RegisterScreen() {
    // add custom error popup for the page
    const { showError } = useError();

    // add theme and styles for the page
    const { theme, styles } = useThemedStyles();

    // inputfield values
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // main register function
    const signUp = async () => {
        try {
            if (password !== confirmPassword) {
                showError("Passwords do not match");
                return;
            }

            // 1. Check if username is already taken
            const q = query(collection(db, "users"), where("username", "==", username));
            const snapshot = await getDocs(q);

            if (!username || !snapshot.empty) {
                showError("Username already taken!");

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
            showError(error);

        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Register</Text>

            {/* all textinput for the page */}
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

            {/* call the main create function */}
            <TouchableOpacity style={styles.Button} onPress={signUp}>
                <Text style={styles.btnText}>Make Account</Text>
            </TouchableOpacity>

            {/* route to login page if user wants */}
            <TouchableOpacity
                onPress={() => router.replace('/(auth)/login')}
            >
                <Text style={styles.authLink}>Already have an account?</Text>
            </TouchableOpacity>
        </SafeAreaView >
    );
}
