import React, { useState, useEffect } from "react";
import { ScrollView, Image, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { auth } from "../../FirebaseConfig";
import { updateProfile, onAuthStateChanged } from "@firebase/auth";

const pfps = [
    require("../../assets/images/profilePictures/pfp.png"),
    require("../../assets/images/profilePictures/pfp2.png"),
    require("../../assets/images/profilePictures/pfp3.png"),
    require("../../assets/images/profilePictures/pfp4.png"),
    require("../../assets/images/profilePictures/pfp5.png"),
    require("../../assets/images/profilePictures/pfp6.png"),
    require("../../assets/images/profilePictures/pfp7.png"),
    require("../../assets/images/profilePictures/pfp8.png"),
    require("../../assets/images/profilePictures/pfp9.png"),
    require("../../assets/images/profilePictures/pfp10.png"),
    require("../../assets/images/profilePictures/pfp11.png"),
    require("../../assets/images/profilePictures/pfp12.png"),
    require("../../assets/images/profilePictures/pfp13.png"),
    require("../../assets/images/profilePictures/pfp14.png"),
    require("../../assets/images/profilePictures/pfp15.png"),
];

export default function PfpGrid() {
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            setUser(firebaseUser);
        });
        return unsubscribe;
    }, []);

    const selectPfp = async (pfp: any) => {
        try {
            const photoURL = Image.resolveAssetSource(pfp).uri;

            if (auth.currentUser) {
                await updateProfile(auth.currentUser, {
                    photoURL: photoURL, // ✅ must be photoURL, not pfpimage
                });
                router.replace("/(nonTabs)/modifyAccount");
            } else {
                console.error("No user is signed in.");
            }
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.grid}>
                {pfps.map((pfp, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.item}
                        onPress={() => selectPfp(pfp)}
                    >
                        <Image style={styles.image} source={pfp} />
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        padding: 30,
        gap: 12,
    },
    item: {
        width: 100,
        marginBottom: 12,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 9999,
    },
});
