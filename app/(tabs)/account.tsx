import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../../FirebaseConfig';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'react-native';


import { Text } from '@/components/Themed';


export default function AccountScreen() {

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
        <SafeAreaView style={styles.container}>

            {/* profile info */}
            <View style={{ alignItems: 'center', flex: 1, top: 100 }}>
                <Image
                    style={{ width: 150, height: 150, borderRadius: 150 }}
                    source={pfpMap[user?.photoURL || "pfp1"]}
                />
                <Text style={styles.title}>{user?.displayName ?? '…'}</Text>
                <Text>{user?.email ?? '…'}</Text>
            </View>


            {/* accountpage links */}
            <View style={{ width: "100%", alignItems: "center", flex: 1 }}>
                <TouchableOpacity
                    onPress={() => router.push('/(nonTabs)/modifyAccount')}
                    style={styles.profileLink}
                >
                    <Text>Edit profile</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => router.push('/(nonTabs)/colors')}
                    style={styles.profileLink}
                >
                    <Text>Colors</Text>
                </TouchableOpacity>
            </View>


            {/* sign out button */}
            <TouchableOpacity style={styles.logoutButton} onPress={handleSignOut}>
                <Text style={styles.btnText}>Sign Out</Text>
            </TouchableOpacity>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        marginBottom: 5
    },
    logoutButton: {
        width: '80%',
        backgroundColor: '#E53935',
        padding: 20,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#E53935',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 5,
        elevation: 5,
        bottom: 50,
    },
    btnText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '600'
    },
    profileLink: {
        width: '80%',
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: 1,
    },
});
