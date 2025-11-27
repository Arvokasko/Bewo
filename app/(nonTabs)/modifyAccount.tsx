import { View, TouchableOpacity, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { auth, db } from '../../FirebaseConfig'
import { updateProfile, onAuthStateChanged, updatePassword, verifyBeforeUpdateEmail } from 'firebase/auth'
import { router } from 'expo-router'
import { doc, setDoc, getDocs, query, where, collection } from "firebase/firestore";
import { Text, TextInput, Image } from 'react-native'
import { FontAwesome5 } from '@expo/vector-icons';
import { useThemedStyles } from '@/theme/useThemedStyles'



// Images that where the users has chosen its own
const pfpMap: Record<string, any> = {
    pfp1: require("../../assets/images/profilePictures/pfp.png"),
    pfp2: require("../../assets/images/profilePictures/pfp2.png"),
    pfp3: require("../../assets/images/profilePictures/pfp3.png"),
    pfp4: require("../../assets/images/profilePictures/pfp4.png"),
    pfp5: require("../../assets/images/profilePictures/pfp5.png"),
    pfp6: require("../../assets/images/profilePictures/pfp6.png"),
    pfp7: require("../../assets/images/profilePictures/pfp7.png"),
    pfp8: require("../../assets/images/profilePictures/pfp8.png"),
    pfp9: require("../../assets/images/profilePictures/pfp9.png"),
    pfp10: require("../../assets/images/profilePictures/pfp10.png"),
    pfp11: require("../../assets/images/profilePictures/pfp11.png"),
    pfp12: require("../../assets/images/profilePictures/pfp12.png"),
    pfp13: require("../../assets/images/profilePictures/pfp13.png"),
    pfp14: require("../../assets/images/profilePictures/pfp14.png"),
    pfp15: require("../../assets/images/profilePictures/pfp15.png"),
};

export default function modifyAccount() {
    const { theme, styles } = useThemedStyles();

    const [user, setUser] = useState<any>(null);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const currentPfp = pfpMap[user?.photoURL || "pfp1"];

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
            if ((username && username !== user.displayName)) {
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

        // Normalize input for uniqueness check
        const normalizedInput = newUsername.trim().toLowerCase();

        // 1. Check if username exists (case-insensitive)
        const q = query(collection(db, "users"));
        const snapshot = await getDocs(q);

        // Loop through and compare normalized values
        snapshot.forEach(docSnap => {
            const existingUsername = docSnap.data().username;
            if (existingUsername && existingUsername.toLowerCase() === normalizedInput) {
                throw new Error("Username already taken");
            }
        });

        // 2. Update Auth profile (store original casing for display)
        await updateProfile(auth.currentUser, { displayName: newUsername });

        // 3. Update Firestore user doc (store only original casing)
        await setDoc(
            doc(db, "users", auth.currentUser.uid),
            {
                username: newUsername, // only original casing stored
                email: auth.currentUser.email,
            },
            { merge: true }
        );
    };

    return (
        <View style={{ backgroundColor: theme.backgroundDark, flex: 1 }}>
            <SafeAreaView style={{ alignItems: 'center' }}>
                <TouchableOpacity onPress={() => router.push('/modifyPfp')}>
                    <FontAwesome5 name="pen" size={20} color={theme.text} solid />
                    <Image
                        style={{ width: 150, height: 150, borderRadius: 150 }}
                        source={pfpMap[user?.photoURL || "pfp1"]} // userPfp if user hasnt changed it, default is pfp.png
                    ></Image>
                </TouchableOpacity>

                <Text style={styles.title}>Edit profile</Text>

                <Text style={styles.text}>Username</Text>
                <TextInput
                    style={styles.titleInput}
                    placeholder={user?.displayName ?? '…'}
                    placeholderTextColor={theme.placeholderColor}
                    value={username}
                    onChangeText={setUsername}
                />

                <Text style={styles.text}>Current password</Text>
                <TextInput
                    style={styles.titleInput}
                    placeholder="********"
                    placeholderTextColor={theme.placeholderColor}
                    value={currentPassword}
                    onChangeText={setCurrentPassword}
                    secureTextEntry
                />

                <Text style={styles.text}>Password</Text>
                <TextInput
                    style={styles.titleInput}
                    placeholder="********"
                    placeholderTextColor={theme.placeholderColor}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />

                <Text style={styles.text}>Confirm password</Text>
                <TextInput
                    style={styles.titleInput}
                    placeholder="********"
                    placeholderTextColor={theme.placeholderColor}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                />

                <TouchableOpacity
                    style={styles.Button}
                    onPress={updateUserData}>
                    <Text style={styles.btnText}>Save</Text>
                </TouchableOpacity>

            </SafeAreaView>

        </View>
    )
}