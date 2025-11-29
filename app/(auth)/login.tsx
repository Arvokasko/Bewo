import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth } from '../../FirebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { router } from 'expo-router';
import { useThemedStyles } from '@/theme/useThemedStyles';
import { useError } from '@/components/ErrorModal';


export default function LoginScreen() {
    // add custom error popup for the page
    const { showError } = useError();

    // add theme and styles for the page
    const { theme, styles } = useThemedStyles();

    // input field values
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');


    // main register function to firebase using firebase function
    const signIn = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.replace('/(tabs)');

        } catch (error: any) {
            showError(error);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Login</Text>

            {/* all input fields */}
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

            {/* call main login function */}
            <TouchableOpacity style={styles.Button} onPress={signIn}>
                <Text style={styles.btnText}>Login</Text>
            </TouchableOpacity>

            {/* router to register page if user wants */}
            <TouchableOpacity
                onPress={() => router.replace('/(auth)/register')}
            >
                <Text style={styles.authLink}>Don't have an account?</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}
