import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { getDocs, query, where, collection, Timestamp } from "firebase/firestore";
import { auth, db } from '../FirebaseConfig';
import { doc, updateDoc, onSnapshot } from 'firebase/firestore';

export default function TaskCard({ shared }: { shared: boolean }) {
    const [visible, setVisible] = useState(false);
    const [selectedCard, setSelectedCard] = useState<any>(null);
    const [cards, setCards] = useState<any[]>([]);



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
            {cards.map(card => (
                <View key={card.id} style={{ width: "100%", alignItems: "center" }}>
                    <TouchableOpacity
                        onPress={() => {
                            setSelectedCard(card);
                            setVisible(true);
                        }}
                        style={{
                            backgroundColor: "grey",
                            marginTop: 15,
                            width: "90%",
                            borderRadius: 8,
                            padding: 10,
                            height: 150,
                            overflow: 'hidden'
                        }}
                    >
                        <Text style={styles.title}>{card.title}</Text>
                        <Text>{card.updatedAt?.toDate().toLocaleDateString()}</Text>


                        {card.content !== "" && (
                            <Text>{card.content}</Text>
                        )}




                        <LinearGradient
                            colors={['rgba(128, 128, 128, 1)', 'transparent']}
                            start={{ x: 0.5, y: 1 }}
                            end={{ x: 0.5, y: 0 }}
                            style={styles.innerShadow}
                        />

                        {card.checklist?.map((item: any, index: number) => (
                            <View key={index} style={{ flexDirection: "row", alignItems: "center" }}>
                                <Text style={{ fontSize: 18 }}>{item.checked ? "☑" : "☐"}</Text>
                                <Text style={{ marginLeft: 10 }}>{item.label}</Text>
                            </View>
                        ))}
                    </TouchableOpacity>
                </View>
            ))}

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
