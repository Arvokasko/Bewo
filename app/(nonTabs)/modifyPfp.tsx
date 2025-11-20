import React, { useState, useEffect } from "react";
import { ScrollView, Image, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { auth } from "../../FirebaseConfig";
import { updateProfile, onAuthStateChanged } from "firebase/auth";

// ✅ Local static assets
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

// ✅ Map identifiers to assets
const pfpMap: Record<string, any> = {
    pfp1: pfps[0],
    pfp2: pfps[1],
    pfp3: pfps[2],
    pfp4: pfps[3],
    pfp5: pfps[4],
    pfp6: pfps[5],
    pfp7: pfps[6],
    pfp8: pfps[7],
    pfp9: pfps[8],
    pfp10: pfps[9],
    pfp11: pfps[10],
    pfp12: pfps[11],
    pfp13: pfps[12],
    pfp14: pfps[13],
    pfp15: pfps[14],
};

export default function PfpGrid() {
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            setUser(firebaseUser);
        });
        return unsubscribe;
    }, []);

    // ✅ Save identifier instead of file:// URI
    const selectPfp = async (index: number) => {
        try {
            if (auth.currentUser) {
                await updateProfile(auth.currentUser, {
                    photoURL: `pfp${index + 1}`, // store identifier
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
                        onPress={() => selectPfp(index)}
                    >
                        <Image style={styles.image} source={pfp} />
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}

// ✅ Example usage elsewhere (showing user’s profile picture)
export function UserAvatar({ size = 100 }) {
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            setUser(firebaseUser);
        });
        return unsubscribe;
    }, []);

    return (
        <Image
            source={pfpMap[user?.photoURL || "pfp1"]} // fallback to pfp1
            style={{ width: size, height: size, borderRadius: 9999 }}
        />
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
