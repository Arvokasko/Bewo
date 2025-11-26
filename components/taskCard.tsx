import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { getDocs, query, where, collection, Timestamp } from "firebase/firestore";
import { auth, db } from '../FirebaseConfig';
import { doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { FontAwesome5 } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useThemedStyles } from "../theme/useThemedStyles";



export default function TaskCard({ shared }: { shared: boolean }) {
    const [visible, setVisible] = useState(false);
    const [selectedCard, setSelectedCard] = useState<any>(null);
    const [cards, setCards] = useState<any[]>([]);

    const [searchQuery, setSearchQuery] = useState("");
    const [sortOption, setSortOption] = useState<"latest" | "oldest" | "az" | "za">("latest");




    const userId = auth.currentUser?.uid;

    const filter = shared ? "ownerId" : "sharedUsers";

    useEffect(() => {
        if (!auth.currentUser) return;
        if (!userId || !filter) return;

        const q = shared
            ? query(
                collection(db, "taskcards"),
                where("ownerId", "==", userId)
            )
            : query(
                collection(db, "taskcards"),
                where("sharedUsers", "array-contains", userId)
            );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const results: any[] = [];
            snapshot.forEach(doc => results.push({ id: doc.id, ...doc.data() }));
            setCards(results);
            console.log("Realtime update received");
        }, (error) => {
            console.error("Error with onSnapshot:", error);
        });

        return () => unsubscribe();
    }, [userId, filter]);








    const filteredAndSortedCards = cards
        // 🔍 filter by search query
        .filter(card =>
            card.title?.toLowerCase().includes(searchQuery.toLowerCase())
        )
        // 🔃 sort based on option
        .sort((a, b) => {
            if (sortOption === "latest") {
                return b.updatedAt?.toMillis() - a.updatedAt?.toMillis();
            }
            if (sortOption === "oldest") {
                return a.title.localeCompare(b.title);
            }
            if (sortOption === "az") {
                return a.title.localeCompare(b.title);
            }
            if (sortOption === "za") {
                return b.title.localeCompare(a.title);
            }
            return 0;
        });



    const toggleChecklistItem = async (cardId: string, index: number) => {
        try {
            // Find the card in local state
            const card = cards.find(c => c.id === cardId);
            if (!card) return;

            // Toggle the item locally
            const updatedChecklist = card.checklist.map((item: any, i: number) =>
                i === index ? { ...item, checked: !item.checked } : item
            );

            // Update Firestore
            const cardRef = doc(db, "taskcards", cardId);
            await updateDoc(cardRef, { checklist: updatedChecklist });

            // Update local state
            setCards(prevCards =>
                prevCards.map(c =>
                    c.id === cardId ? { ...c, checklist: updatedChecklist } : c
                )
            );

            // Also update selectedCard if open
            if (selectedCard?.id === cardId) {
                setSelectedCard({ ...selectedCard, checklist: updatedChecklist });
            }


        } catch (err) {
            console.error("Error updating checklist:", err);
        }
    };

    return (
        <View style={{ width: "100%", alignItems: "center" }}>
            <View style={{ alignItems: "center", paddingVertical: 10 }}>

                {/* Search Row */}
                <View style={{ flexDirection: "row", alignItems: "center", }}>
                    <TextInput
                        placeholder="Search by title..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        style={{
                            backgroundColor: "grey",
                            width: "75%",
                            borderRadius: 8,
                            padding: 10,
                            margin: 20,
                        }}
                    />
                    {shared && (
                        <TouchableOpacity onPress={() => router.push("/(nonTabs)/createCard")}>
                            <FontAwesome5 name="plus" size={25} color="black" solid />
                        </TouchableOpacity>

                    )}
                </View>

                {/* Sort Options */}
                <View style={{ width: "100%", alignItems: "center" }}>
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-around",
                            width: 350,
                            paddingVertical: 10,
                        }}
                    >

                        <View style={{ width: 50, alignItems: "center" }}>
                            <TouchableOpacity onPress={() => setSortOption("latest")}>
                                <Text style={{ borderBottomWidth: sortOption === "latest" ? 2 : 0 }}>Latest</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ width: 50, alignItems: "center" }}>
                            <TouchableOpacity onPress={() => setSortOption("oldest")}>
                                <Text style={{ borderBottomWidth: sortOption === "oldest" ? 2 : 0 }}>Oldest</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ width: 50, alignItems: "center" }}>
                            <TouchableOpacity onPress={() => setSortOption("az")}>
                                <Text style={{ borderBottomWidth: sortOption === "az" ? 2 : 0 }}>A–Z</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ width: 50, alignItems: "center" }}>
                            <TouchableOpacity onPress={() => setSortOption("za")}>
                                <Text style={{ borderBottomWidth: sortOption === "za" ? 2 : 0 }}>Z–A</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </View>

            </View>




            {
                filteredAndSortedCards.map(card => (
                    <View key={card.id} style={{ width: "100%", alignItems: "center" }}>
                        <View
                            style={{
                                backgroundColor: "grey",
                                marginTop: 15,
                                width: "90%",
                                borderRadius: 8,
                                height: 150,
                                overflow: 'hidden'
                            }}>


                            <View style={{ justifyContent: "center", position: "absolute", height: 150, right: 0, zIndex: 15 }}>
                                <TouchableOpacity
                                    style={{ padding: 20, backgroundColor: "transparent" }}
                                    hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
                                    onPress={() =>
                                        router.push(
                                            `/(nonTabs)/modifyTaskCard?taskId=${card.id}&sharedState=${shared}`
                                        )
                                    }
                                >
                                    <FontAwesome5 name="pen" size={20} color="black" solid />
                                </TouchableOpacity>

                            </View>

                            <TouchableOpacity
                                style={{ width: "85%", padding: 10, height: 150 }}
                                onPress={() => {
                                    setSelectedCard(card);
                                    setVisible(true);
                                }}
                            >
                                <Text style={styles.title}>{card.title}</Text>
                                <Text>{card.updatedAt?.toDate().toLocaleDateString()}</Text>


                                {card.content !== "" && (
                                    <Text>{card.content}</Text>
                                )}




                                {card.checklist?.map((item: any, index: number) => (
                                    <View key={index} style={{ flexDirection: "row", alignItems: "center" }}>
                                        <Text style={{ fontSize: 18 }}>{item.checked ? "☑" : "☐"}</Text>
                                        <Text style={{ marginLeft: 10 }}>{item.label}</Text>
                                    </View>
                                ))}
                            </TouchableOpacity>

                            <LinearGradient
                                colors={['rgba(128, 128, 128, 1)', 'transparent']}
                                start={{ x: 0.5, y: 1 }}
                                end={{ x: 0.5, y: 0 }}
                                style={styles.innerShadow}
                            />

                        </View>
                    </View>
                ))
            }

            <Modal
                visible={visible}
                transparent
                onRequestClose={() => setVisible(false)}
            >
                <View style={{ backgroundColor: "#00000050", flex: 1, justifyContent: "center", alignItems: "center" }}>
                    {selectedCard && (
                        <>
                            <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                                {selectedCard.title}
                            </Text>

                            <Text>{selectedCard.updatedAt?.toDate().toLocaleDateString()}</Text>

                            {selectedCard.content !== "" && (
                                <Text style={{ marginVertical: 10 }}>{selectedCard.content}</Text>
                            )}

                            {selectedCard.checklist?.map((item: any, index: number) => (
                                <TouchableOpacity
                                    key={index}
                                    style={{ flexDirection: "row", alignItems: "center" }}
                                    onPress={() => toggleChecklistItem(selectedCard.id, index)}
                                >
                                    <Text style={{ fontSize: 18 }}>{item.checked ? "☑" : "☐"}</Text>
                                    <Text style={{ marginLeft: 10 }}>{item.label}</Text>
                                </TouchableOpacity>
                            ))}
                        </>
                    )}

                    <TouchableOpacity
                        onPress={() => setVisible(false)}
                        style={{ width: "50%", padding: 10, backgroundColor: "grey", margin: 10, borderRadius: 8, alignItems: "center" }}
                    >
                        <Text>Close</Text>
                    </TouchableOpacity>
                </View>
            </Modal >
        </View >
    );
}

const styles = StyleSheet.create({
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        width: "90%",
    },
    innerShadow: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 40,
        zIndex: 10,
    },
});
