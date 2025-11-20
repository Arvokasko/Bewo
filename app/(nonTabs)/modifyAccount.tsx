import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { auth, db } from '../../FirebaseConfig'
import { updateProfile, onAuthStateChanged, updatePassword, verifyBeforeUpdateEmail } from 'firebase/auth'
import { router } from 'expo-router'
import { doc, setDoc, getDocs, query, where, collection } from "firebase/firestore";
import { Image } from 'react-native'

export default function modifyAccount() {
    const [user, setUser] = useState<any>(null);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // declares the user auth
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);

        });
        return unsubscribe;
    }, []);

    // main userdata update function
    const updateUserData = async () => {

        if (!currentPassword.trim()) {
            Alert.alert('Fill current password field');
            return
        } else {
            // Proceed with your logic
            console.log('Submitted:');
        }


        if (!user) return;

        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match!');
            return;
        }


        try {
            // Update username if changed
            if (username && username !== user.displayName) {
                await updateUsername(username);
            }

            // Update password if provided
            if (password) {
                await updatePassword(user, password);
            }

            Alert.alert('Success', 'Account updated successfully');
            router.push('/(tabs)/account');

        } catch (err: any) {
            Alert.alert('Error', err.message);
        }
    };



    const updateUsername = async (newUsername: string) => {
        if (!auth.currentUser) return;

        // 1. Check if username exists
        const q = query(collection(db, "users"), where("username", "==", newUsername));
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
            throw new Error("Username already taken");
        }

        // 2. Update Auth profile
        await updateProfile(auth.currentUser, { displayName: newUsername });

        // 3. Update Firestore user doc
        await setDoc(doc(db, "users", auth.currentUser.uid), {
            username: newUsername,
            email: auth.currentUser.email,
        }, { merge: true });
    };

    return (
        <SafeAreaView style={{ alignItems: 'center' }}>
            <TouchableOpacity onPress={() => router.push('/modifyPfp')}>
                <Image
                    style={{ width: 150, height: 150, borderRadius: 150 }}
                    source={require("../../assets/images/profilePictures/pfp.png")}
                />
            </TouchableOpacity>

            <Text style={{ fontSize: 50 }}>Edit profile</Text>

            <Text>Username</Text>
            <TextInput placeholder={user?.displayName ?? '…'} value={username} onChangeText={setUsername} />

            <Text>Current password</Text>
            <TextInput placeholder="********" value={currentPassword} onChangeText={setCurrentPassword} secureTextEntry />

            <Text>Password</Text>
            <TextInput placeholder="********" value={password} onChangeText={setPassword} secureTextEntry />

            <Text>Confirm password</Text>
            <TextInput placeholder="********" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry />

            <TouchableOpacity onPress={updateUserData}>
                <Text>Save</Text>
            </TouchableOpacity>

        </SafeAreaView>
    )
}