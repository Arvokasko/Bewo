import React, { useState, useEffect } from "react";
import { ScrollView, Image, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { auth } from "../../FirebaseConfig";
import { updateProfile, onAuthStateChanged } from "firebase/auth";
import { useThemedStyles } from "@/theme/useThemedStyles";

// list of the available static profile pictures
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

// Map identifiers to assets
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

    // add theme and styles for the page
    const { theme, styles } = useThemedStyles();

    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            setUser(firebaseUser);
        });
        return unsubscribe;
    }, []);

    // save identifiers for the images
    const selectPfp = async (index: number) => {
        try {
            // checks if user is logged in
            if (auth.currentUser) {
                await updateProfile(auth.currentUser, {
                    photoURL: `pfp${index + 1}`, // store identifier
                });
                // if succesfully changed profile picture, router back to account page
                router.replace("/(nonTabs)/modifyAccount");
            } else {
                console.error("No user is signed in.");
            }
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    };

    return (
        <SafeAreaView style={{ backgroundColor: theme.backgroundDark, flex: 1 }}>
            <ScrollView contentContainerStyle={styles.grid}>
                {/* render all of the available profile pictures to the page */}
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
