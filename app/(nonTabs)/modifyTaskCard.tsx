import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Modal, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { db, auth } from '../../FirebaseConfig';
import { doc, getDoc, updateDoc, serverTimestamp, deleteDoc } from "firebase/firestore";
import { router, useLocalSearchParams } from 'expo-router';
import UsernameSearch from '@/components/UsernameSearch';

export default function ModifyTaskCard() {
    const { taskId } = useLocalSearchParams(); // 👈 get doc id from route
    const { sharedState } = useLocalSearchParams(); //  get taskcard sharedstate from route
    const shared = sharedState === "true";
    const [selectedUsers, setSelectedUsers] = useState<{ uid: string; username: string }[]>([]);
    const [shUserVisible, setShUserVisible] = useState(false);

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [checklist, setChecklist] = useState([{ label: "", checked: false }]);

    // 🔹 Load existing data
    useEffect(() => {
        const fetchTask = async () => {
            try {
                const ref = doc(db, "taskcards", taskId as string);
                const snap = await getDoc(ref);
                if (snap.exists()) {
                    const data = snap.data();
                    setTitle(data.title || "");
                    setContent(data.content || "");
                    setChecklist(data.checklist?.length ? data.checklist : [{ label: "", checked: false }]);
                    setSelectedUsers((data.sharedUsers || []).map((uid: string) => ({ uid, username: "" })));
                }
            } catch (err: any) {
                Alert.alert("Error", err.message);
            }
        };
        if (taskId) fetchTask();
    }, [taskId]);

    // checklist handling
    const handleChecklistChange = (text: string, index: number) => {
        const updated = [...checklist];
        updated[index].label = text;
        setChecklist(updated);

        if (index === checklist.length - 1 && text.trim() !== "") {
            setChecklist([...updated, { label: "", checked: false }]);
        }
    };

    const toggleChecklist = (index: number) => {
        const updated = [...checklist];
        updated[index].checked = !updated[index].checked;
        setChecklist(updated);
    };

    const handleSubmit = async () => {
        if (!title.trim()) {
            Alert.alert("Validation Error", "Title is required!");
            return;
        }
        try {
            const ref = doc(db, "taskcards", taskId as string);
            const filteredChecklist = checklist.filter(item => item.label.trim() !== "");
            await updateDoc(ref, {
                title,
                content,
                checklist: filteredChecklist,
                sharedUsers: selectedUsers.map(u => u.uid),
                updatedAt: serverTimestamp()
            });
            router.replace("/(tabs)");
        } catch (err: any) {
            Alert.alert("Error", err.message);
        }
    };

    const deleteTaskCard = async (taskId: string) => {
        Alert.alert(
            "Are you sure?",
            "This cannot be undone.",
            [
                {
                    text: "Cancel",
                    style: "cancel", // 👈 closes alert, does nothing
                },
                {
                    text: "Delete",
                    style: "destructive", // 👈 red button on iOS
                    onPress: async () => {
                        try {
                            const ref = doc(db, "taskcards", taskId);
                            await deleteDoc(ref);
                            router.replace("/(tabs)"); // navigate back after deletion
                        } catch (err: any) {
                            Alert.alert("Error", err.message || "Failed to delete taskcard");
                        }
                    },
                },
            ],
            { cancelable: true }
        );
    };

    return (
        <SafeAreaView>
            <ScrollView>
                <View style={{ alignItems: "center" }}>
                    <TextInput
                        value={title}
                        onChangeText={setTitle}
                        placeholder='Title'
                        style={{ backgroundColor: "grey", width: "80%", borderRadius: 8, padding: 10, margin: 20 }}
                    />

                    <TextInput
                        value={content}
                        onChangeText={setContent}
                        placeholder='Type your thoughts...'
                        style={{ width: "80%", backgroundColor: "grey", minHeight: 200, borderRadius: 8, textAlignVertical: "top", padding: 10 }}
                        multiline
                    />

                    {checklist.map((item, index) => (
                        <View key={index} style={{ flexDirection: "row", alignItems: "center", marginVertical: 6, width: "80%" }}>
                            <TouchableOpacity onPress={() => toggleChecklist(index)}>
                                <Text style={{ fontSize: 18 }}>{item.checked ? "☑" : "☐"}</Text>
                            </TouchableOpacity>
                            <TextInput
                                value={item.label}
                                onChangeText={(text) => handleChecklistChange(text, index)}
                                placeholder={`Task ${index + 1}`}
                                style={{ marginLeft: 10, borderBottomWidth: 1, flex: 1, paddingVertical: 4 }}
                            />
                            <TouchableOpacity
                                onPress={() => {
                                    const updated = checklist.filter((_, i) => i !== index);
                                    setChecklist(updated.length ? updated : [{ label: "", checked: false }]);
                                }}
                                style={{ marginLeft: 10, paddingHorizontal: 8, paddingVertical: 4, backgroundColor: "darkred", borderRadius: 4 }}
                            >
                                <Text style={{ color: "white" }}>✕</Text>
                            </TouchableOpacity>
                        </View>
                    ))}

                    <TouchableOpacity style={styles.bigButton} onPress={() => setShUserVisible(true)}>
                        <Text style={styles.text}>Shared users</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={handleSubmit} style={styles.Button}>
                        <Text style={styles.text}>Save</Text>
                    </TouchableOpacity>

                    {shared && (
                        <TouchableOpacity onPress={() => deleteTaskCard(taskId as string)} style={styles.Button}>
                            <Text style={styles.text}>Delete</Text>
                        </TouchableOpacity>
                    )}


                    {/* Shared users popup */}
                    <Modal visible={shUserVisible} transparent animationType="fade" onRequestClose={() => setShUserVisible(false)}>
                        <View style={{ flex: 1, justifyContent: "center", padding: 20, backgroundColor: "#00000050" }}>
                            <Text style={{ color: "white" }}>Shared taskcard with users</Text>
                            <UsernameSearch onSelectionChange={setSelectedUsers} />
                            <TouchableOpacity style={styles.Button} onPress={() => setShUserVisible(false)}>
                                <Text style={{ textAlign: "center" }}>Okay</Text>
                            </TouchableOpacity>
                        </View>
                    </Modal>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    text: { textAlign: "center" },
    Button: { width: "50%", padding: 10, backgroundColor: "grey", margin: 10, borderRadius: 8 },
    bigButton: { width: "80%", padding: 10, backgroundColor: "grey", margin: 10, borderRadius: 8 },
});
