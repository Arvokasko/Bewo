import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Modal, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { db, auth } from '../../FirebaseConfig';
import { doc, getDoc, updateDoc, serverTimestamp, deleteDoc } from "firebase/firestore";
import { router, useLocalSearchParams } from 'expo-router';
import UsernameSearch from '@/components/UsernameSearch';
import { useThemedStyles } from '@/theme/useThemedStyles';
import { stringify } from 'uuid';

export default function ModifyTaskCard() {
    const { theme, styles } = useThemedStyles();
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
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.backgroundDark }}>

            <ScrollView>
                <View style={{ alignItems: "center" }}>
                    <TextInput
                        value={title}
                        onChangeText={setTitle}
                        placeholder='Title'
                        style={styles.titleInput}
                        placeholderTextColor={theme.placeholderColor}
                    />

                    <TextInput
                        value={content}
                        onChangeText={setContent}
                        placeholder='Type your thoughts...'
                        placeholderTextColor={theme.placeholderColor}
                        style={styles.contentInput}
                        multiline
                    />

                    <View style={styles.checklistView}>
                        {checklist.map((item, index) => (
                            <View
                                key={index}
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    marginVertical: 6,
                                    width: "80%",
                                }}
                            >
                                {/* Checkbox toggle */}
                                <TouchableOpacity onPress={() => toggleChecklist(index)}>
                                    <Text style={{ fontSize: 25, color: theme.text }}>{item.checked ? "☑" : "☐"}</Text>
                                </TouchableOpacity>

                                {/* Text input */}
                                <TextInput
                                    value={item.label}
                                    onChangeText={(text) => handleChecklistChange(text, index)}
                                    placeholder={`Task ${index + 1}`}
                                    placeholderTextColor={theme.placeholderColor}
                                    style={styles.checkListInput}
                                />

                                {/* Delete button */}
                                <TouchableOpacity
                                    onPress={() => {
                                        const updated = checklist.filter((_, i) => i !== index);
                                        setChecklist(updated.length ? updated : [{ label: "", checked: false }]);
                                    }}
                                    style={styles.deleteBtn}
                                >
                                    <Text style={styles.btnText}>✕</Text>
                                </TouchableOpacity>
                            </View>
                        ))}

                    </View>

                    <TouchableOpacity style={styles.bigButton} onPress={() => setShUserVisible(true)}>
                        <Text style={styles.text}>Shared users</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={handleSubmit} style={styles.Button}>
                        <Text style={styles.text}>Save</Text>
                    </TouchableOpacity>

                    {shared && (
                        <TouchableOpacity onPress={() => deleteTaskCard(taskId as string)} style={styles.logoutButton}>
                            <Text style={styles.text}>Delete</Text>
                        </TouchableOpacity>
                    )}


                    {/* Shared users popup panel */}
                    <Modal
                        visible={shUserVisible}
                        transparent
                        animationType="fade"
                        onRequestClose={() => setShUserVisible(false)}
                    >
                        {/* Overlay to center content */}
                        <View style={styles.overlay}>
                            {/* Inner container card */}
                            <View style={[styles.modalContent, { backgroundColor: theme.backgroundDark }]}>
                                <Text style={styles.text}>Share this taskcard with any user</Text>

                                {/* UsernameSearch stays the same */}
                                <UsernameSearch onSelectionChange={setSelectedUsers} />

                                <View style={{ alignItems: "center", marginTop: 20 }}>
                                    <TouchableOpacity
                                        style={styles.Button}
                                        onPress={() => setShUserVisible(false)}
                                    >
                                        <Text style={styles.btnText}>Okay</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
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
