import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { query, where, collection } from "firebase/firestore";
import { auth, db } from '../FirebaseConfig';
import { doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { FontAwesome5 } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useThemedStyles } from "../theme/useThemedStyles";



export default function TaskCard({ shared }: { shared: boolean }) {

    // add custom theme and style to the page
    const { styles, theme } = useThemedStyles();

    // modal visible state
    const [visible, setVisible] = useState(false);


    // checkbox state
    const [selectedCard, setSelectedCard] = useState<any>(null);
    const [cards, setCards] = useState<any[]>([]);

    // search bar input
    const [searchQuery, setSearchQuery] = useState("");

    // declaring sorting options
    const [sortOption, setSortOption] = useState<"latest" | "oldest" | "az" | "za">("latest");




    const userId = auth.currentUser?.uid;

    // change the taskcard visibility recarding if its called as shared
    const filter = shared ? "ownerId" : "sharedUsers";

    useEffect(() => {
        // if user isnt available return
        if (!auth.currentUser) return;
        if (!userId || !filter) return;

        // change the databse query recarding shared state
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
        }, (error) => {
            console.error("Error with onSnapshot:", error);
        });

        return () => unsubscribe();
    }, [userId, filter]);







    // displayed card sorting and filtering
    const filteredAndSortedCards = cards
        // filter by search query
        .filter(card =>
            card.title?.toLowerCase().includes(searchQuery.toLowerCase())
        )
        // sort based on option
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


    // checklist item handling
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
                        style={styles.titleInput}
                        placeholderTextColor={theme.placeholderColor}
                    />
                    {shared && (
                        <TouchableOpacity
                            style={{ marginRight: 20 }}
                            onPress={() => router.push("/(nonTabs)/createCard")}>
                            <FontAwesome5 name="plus" size={25} color={theme.text} solid />
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
                                <Text style={[styles.text, { borderBottomWidth: sortOption === "latest" ? 2 : 0 }]}>Latest</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ width: 50, alignItems: "center" }}>
                            <TouchableOpacity onPress={() => setSortOption("oldest")}>
                                <Text style={[styles.text, { borderBottomWidth: sortOption === "oldest" ? 2 : 0 }]}>Oldest</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ width: 50, alignItems: "center" }}>
                            <TouchableOpacity onPress={() => setSortOption("az")}>
                                <Text style={[styles.text, { borderBottomWidth: sortOption === "az" ? 2 : 0 }]}>A–Z</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ width: 50, alignItems: "center" }}>
                            <TouchableOpacity onPress={() => setSortOption("za")}>
                                <Text style={[styles.text, { borderBottomWidth: sortOption === "za" ? 2 : 0 }]}>Z–A</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </View>

            </View>


            {
                filteredAndSortedCards.map(card => (
                    <View key={card.id} style={{ width: "100%", alignItems: "center" }}>
                        <View
                            style={styles.taskCard}>


                            <View style={{ justifyContent: "center", position: "absolute", height: 150, right: 0, zIndex: 15 }}>
                                <TouchableOpacity
                                    style={{ padding: 20, backgroundColor: "transparent", right: 10 }}
                                    hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
                                    onPress={() =>
                                        router.push(
                                            `/(nonTabs)/modifyTaskCard?taskId=${card.id}&sharedState=${shared}`
                                        )
                                    }
                                >
                                    <FontAwesome5 name="pen" size={20} color={theme.text} solid />
                                </TouchableOpacity>

                            </View>

                            <TouchableOpacity
                                style={{ width: "85%", padding: 10, height: 150 }}
                                onPress={() => {
                                    setSelectedCard(card);
                                    setVisible(true);
                                }}
                            >
                                <Text style={styles.cardTitle}>{card.title}</Text>
                                <Text style={{ color: theme.text }}>{card.updatedAt?.toDate().toLocaleDateString()}</Text>


                                {card.content !== "" && (
                                    <Text style={{ color: theme.text }}>{card.content}</Text>
                                )}




                                {card.checklist?.map((item: any, index: number) => (
                                    <View key={index} style={{ flexDirection: "row", alignItems: "center" }}>
                                        <Text style={{ fontSize: 18, color: theme.text }}>{item.checked ? "☑" : "☐"}</Text>
                                        <Text style={{ marginLeft: 10, color: theme.text }}>{item.label}</Text>
                                    </View>
                                ))}
                            </TouchableOpacity>

                            <LinearGradient
                                colors={[theme.backgroundLight, 'transparent']}
                                start={{ x: 0.5, y: 1 }}
                                end={{ x: 0.5, y: 0 }}
                                style={styles.cardFade}
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
                <View style={{ backgroundColor: theme.backgroundDark, flex: 1, justifyContent: "center", padding: 20 }}>
                    <View style={styles.modalContent}>
                        {selectedCard && (
                            <>
                                <Text style={styles.cardTitle}>
                                    {selectedCard.title}
                                </Text>

                                <Text style={{ color: theme.text }}>{selectedCard.updatedAt?.toDate().toLocaleDateString()}</Text>

                                {selectedCard.content !== "" && (
                                    <Text style={{ marginVertical: 10, color: theme.text }}>{selectedCard.content}</Text>
                                )}

                                {selectedCard.checklist?.map((item: any, index: number) => (
                                    <TouchableOpacity
                                        key={index}
                                        style={{ flexDirection: "row", alignItems: "center" }}
                                        onPress={() => toggleChecklistItem(selectedCard.id, index)}
                                    >
                                        <Text style={{ fontSize: 18, color: theme.text }}>{item.checked ? "☑" : "☐"}</Text>
                                        <Text style={{ marginLeft: 10, color: theme.text }}>{item.label}</Text>
                                    </TouchableOpacity>
                                ))}
                            </>
                        )}

                    </View>

                    <View style={{ alignItems: "center", width: "100%" }}>
                        <TouchableOpacity
                            onPress={() => setVisible(false)}
                            style={styles.bigButton}
                        >
                            <Text style={styles.btnText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal >
        </View >
    );
}
