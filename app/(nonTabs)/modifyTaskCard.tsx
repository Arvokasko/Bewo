import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Modal } from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { db } from '../../FirebaseConfig';
import { doc, getDoc, updateDoc, serverTimestamp, deleteDoc } from "firebase/firestore";
import { router, useLocalSearchParams } from 'expo-router';
import UsernameSearch from '@/components/UsernameSearch';
import { useThemedStyles } from '@/theme/useThemedStyles';
import { useError } from '@/components/ErrorModal';
import { useConfirm } from '@/components/ConfirmModal';


export default function ModifyTaskCard() {
    // add custom error popup for the page
    const { showError } = useError();

    // add a custom confirm popup for the page
    const { showConfirm } = useConfirm();

    // add theme and styles for the page
    const { theme, styles } = useThemedStyles();


    // get id for the taskcard to be modified
    const { taskId } = useLocalSearchParams();

    //  get taskcard sharedstate from route
    const { sharedState } = useLocalSearchParams();
    // declare shared variable
    const shared = sharedState === "true";


    // declare the shared users from UsernameSearch.tsx
    const [selectedUsers, setSelectedUsers] = useState<{ uid: string; username: string }[]>([]);

    // declare shared users modal visibility
    const [shUserVisible, setShUserVisible] = useState(false);

    // textinput data
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [checklist, setChecklist] = useState([{ label: "", checked: false }]);

    // Load existing data of the taskcard
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
            } catch (error: any) {
                showError(error);
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

    // main submit function
    const handleSubmit = async () => {
        if (!title.trim()) {
            showError("Title is required!");
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
        } catch (error: any) {
            showError(error);
        }
    };

    // delete task card function
    const deleteTaskCard = async (taskId: string) => {
        showConfirm({
            title: "Are you sure?",
            message: "This cannot be undone.",
            confirmText: "Delete",
            cancelText: "Cancel",
            onConfirm: async () => {
                try {
                    const ref = doc(db, "taskcards", taskId);
                    await deleteDoc(ref);
                    router.replace("/(tabs)");
                } catch (error: any) {
                    showError("Failed to delete taskcard");
                }
            },
        });
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

                        {/* render all the existing and new checklist lines */}
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


                    {/* buttons for the page */}
                    <TouchableOpacity style={styles.bigButton} onPress={() => setShUserVisible(true)}>
                        <Text style={styles.text}>Shared users</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={handleSubmit} style={styles.Button}>
                        <Text style={styles.btnText}>Save</Text>
                    </TouchableOpacity>

                    {/* having the button delete recarding if the user is the owner of the taskcard */}
                    {shared && (
                        <TouchableOpacity onPress={() => deleteTaskCard(taskId as string)} style={styles.logoutButton}>
                            <Text style={styles.btnText}>Delete</Text>
                        </TouchableOpacity>
                    )}


                    {/* Shared users popup panel */}
                    <Modal
                        visible={shUserVisible}
                        transparent
                        animationType="fade"
                        onRequestClose={() => setShUserVisible(false)}
                    >
                        <View style={styles.overlay}>
                            <View style={[styles.modalContent, { backgroundColor: theme.backgroundDark }]}>
                                <Text style={styles.text}>Share this taskcard with any user</Text>

                                {/* search for usernames to add to the shared users */}
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