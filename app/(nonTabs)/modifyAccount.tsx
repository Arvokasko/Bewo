import React, { useEffect, useState, useRef } from 'react';
import { View, TouchableOpacity, Text, TextInput, Image, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth, db } from '../../FirebaseConfig';
import { updateProfile, onAuthStateChanged, updatePassword } from 'firebase/auth';
import { doc, setDoc, getDocs, query, collection } from 'firebase/firestore';
import { router } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import { useThemedStyles } from '@/theme/useThemedStyles';
import { useError } from '@/components/ErrorModal';



// list of all the Images sources that the user has chosen
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
    // add custom error and success popup for the page
    const { showError, showSuccess } = useError();

    // add theme and styles for the page
    const { theme, styles } = useThemedStyles();

    // all of the pages input field values
    const [user, setUser] = useState<any>(null);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");



    // declare scrollref for scrolling out of the way of the keyboard
    const scrollRef = useRef<ScrollView>(null);

    // scroll to bottom when any input is focused
    const handleFocus = () => {
        scrollRef.current?.scrollToEnd({ animated: true });
    };



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
            showError("Fill current password field");
            return;
        }

        // if somehow no user then return
        if (!user) return;

        // confirm if both of the passwords are the same
        if (password !== confirmPassword) {
            showError("Passwords do not match!");
            return;
        }

        // try to change the values of the userinfo
        try {
            // Update username if changed
            if (username && username !== user.displayName) {
                await updateUsername(username);
            }

            // Update password if provided
            if (password) {
                await updatePassword(user, password);
            }

            // Only show success if no errors were thrown
            showSuccess("Account updated successfully");

            // route to account page after succesful data update
            router.push('/(tabs)/account');

        } catch (err: any) {
            // show custom error popup if error popsup
            showError(err.message);
        }
    };

    // function that changes the username
    const updateUsername = async (newUsername: string) => {
        if (!auth.currentUser) return;

        // normalizes the username first to check use later
        const normalizedInput = newUsername.trim().toLowerCase();

        // searches the user table of the database
        const q = query(collection(db, "users"));
        const snapshot = await getDocs(q);

        // checks if new username is already taken
        for (const docSnap of snapshot.docs) {
            const existingUsername = docSnap.data().username;

            // if username is unique and valid else throw error 
            if (existingUsername && existingUsername.toLowerCase() === normalizedInput) {
                throw new Error("username already taken");
            }
        }

        // updates the users auth displayname
        await updateProfile(auth.currentUser, { displayName: newUsername });

        // updates the username to the database table that people can access
        await setDoc(
            doc(db, "users", auth.currentUser.uid),
            {
                username: newUsername,
                email: auth.currentUser.email,
            },
            { merge: true }
        );
    };


    return (
        <View style={{ flex: 1, backgroundColor: theme.backgroundDark }}>
            {/* avoids the view of the keyboard when textinput selected */}
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0} // adjust if you have a header
            >
                {/* scrolls to the bottom when textinput selected */}
                <ScrollView
                    ref={scrollRef}
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps="handled"
                >
                    <SafeAreaView style={{ alignItems: 'center', flex: 1 }}>
                        <TouchableOpacity onPress={() => router.push('/modifyPfp')}>
                            <FontAwesome5 name="pen" size={20} color={theme.text} solid />
                            <Image
                                style={{ width: 150, height: 150, borderRadius: 150 }}
                                source={pfpMap[user?.photoURL || "pfp1"]}
                            />
                        </TouchableOpacity>

                        <Text style={styles.title}>Edit profile</Text>


                        {/* all of the inputs of the page */}
                        <Text style={styles.text}>Username</Text>
                        <TextInput
                            style={styles.titleInput}
                            placeholder={user?.displayName ?? '…'}
                            placeholderTextColor={theme.placeholderColor}
                            value={username}
                            onChangeText={setUsername}
                            onFocus={handleFocus}
                        />

                        <Text style={styles.text}>Current password</Text>
                        <TextInput
                            style={styles.titleInput}
                            placeholder="********"
                            placeholderTextColor={theme.placeholderColor}
                            value={currentPassword}
                            onChangeText={setCurrentPassword}
                            secureTextEntry
                            onFocus={handleFocus}
                        />

                        <Text style={styles.text}>Password</Text>
                        <TextInput
                            style={styles.titleInput}
                            placeholder="********"
                            placeholderTextColor={theme.placeholderColor}
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            onFocus={handleFocus}
                        />

                        <Text style={styles.text}>Confirm password</Text>
                        <TextInput
                            style={styles.titleInput}
                            placeholder="********"
                            placeholderTextColor={theme.placeholderColor}
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry
                            onFocus={handleFocus}
                        />

                        {/* save button that calls the updateuser function */}
                        <TouchableOpacity style={styles.Button} onPress={updateUserData}>
                            <Text style={styles.btnText}>Save</Text>
                        </TouchableOpacity>
                    </SafeAreaView>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}