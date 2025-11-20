// app/(auth)/login.tsx
import { Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { doc, setDoc, getDocs, query, where, collection } from "firebase/firestore";
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import { auth, db } from '../../FirebaseConfig';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { router } from 'expo-router';

export default function RegisterScreen() {
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
            <TextInput style={styles.textInput} placeholder="Username" value={username} onChangeText={setUsername} />
            <TextInput style={styles.textInput} placeholder="Email" value={email} onChangeText={setEmail} />
            <TextInput style={styles.textInput} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
            <TextInput style={styles.textInput} placeholder="Confirm password" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry />
            <TouchableOpacity style={styles.button} onPress={signUp}>
                <Text style={styles.text}>Make Account</Text>
            </TouchableOpacity>
            <TouchableOpacity>
                <Text
                    onPress={() => router.replace('/(auth)/login')}
                >Already have an account?</Text>
            </TouchableOpacity>
        </SafeAreaView >
    );
}


const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FAFAFA' },
    title: { fontSize: 28, fontWeight: '800', marginBottom: 40, color: '#1A237E' },
    textInput: {
        height: 50,
        width: '90%',
        backgroundColor: '#FFFFFF',
        borderColor: '#E8EAF6',
        borderWidth: 2,
        borderRadius: 15,
        marginVertical: 15,
        paddingHorizontal: 25,
        fontSize: 16,
        color: '#3C4858',
        shadowColor: '#9E9E9E',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 4,
    },
    button: {
        width: '90%',
        marginVertical: 15,
        backgroundColor: '#5C6BC0',
        padding: 20,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#5C6BC0',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 5,
        elevation: 5,
    },
    text: { color: '#FFFFFF', fontSize: 18, fontWeight: '600' },
});
