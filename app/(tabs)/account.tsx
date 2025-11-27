import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../../FirebaseConfig';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'react-native';
import { useThemedStyles } from '@/theme/useThemedStyles';

export default function AccountScreen() {
    const { styles, theme } = useThemedStyles();

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

    const user = auth.currentUser;

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            console.log('User signed out');
            // ✅ optional: instant redirect
            router.replace('/(auth)/login');
            // root _layout.tsx will also detect user=null and keep you in (auth)
        } catch (error: any) {
            console.log(error);
            alert('Logout failed: ' + error.message);
        }
    };

    return (
        <View style={{ backgroundColor: theme.backgroundDark, flex: 1 }}>

            <SafeAreaView style={styles.container}>

                {/* profile info */}
                <View style={{ alignItems: 'center', flex: 1, top: 100 }}>
                    <Image
                        style={{ width: 150, height: 150, borderRadius: 150 }}
                        source={pfpMap[user?.photoURL || "pfp1"]}
                    />
                    <Text style={styles.title}>{user?.displayName ?? '…'}</Text>
                    <Text style={{ color: theme.text }}>{user?.email ?? '…'}</Text>
                </View>


                {/* accountpage links */}
                <View style={{ width: "100%", alignItems: "center", flex: 1 }}>
                    <TouchableOpacity
                        onPress={() => router.push('/(nonTabs)/modifyAccount')}
                        style={styles.bigButton}
                    >
                        <Text style={styles.text}>Edit profile</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => router.push('/(nonTabs)/colors')}
                        style={styles.bigButton}
                    >
                        <Text style={styles.text}>Colors</Text>
                    </TouchableOpacity>
                </View>


                {/* sign out button */}
                <TouchableOpacity style={styles.logoutButton} onPress={handleSignOut}>
                    <Text style={styles.btnText}>Sign Out</Text>
                </TouchableOpacity>

            </SafeAreaView>
        </View>
    );
}
