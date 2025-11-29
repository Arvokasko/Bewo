import React, { useState } from 'react';
import { Modal, ScrollView, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { auth, db } from '../../FirebaseConfig';
import { v4 as uuidv4 } from 'uuid';
import UsernameSearch from '@/components/UsernameSearch';
import { Text } from '@/components/Themed';
import { useThemedStyles } from '../../theme/useThemedStyles';
import { useError } from '@/components/ErrorModal';




export default function createCard() {
    // add custom error popup for the page
    const { showError } = useError();

    // add theme and styles for the page
    const { theme, styles } = useThemedStyles();

    // sets and calls the selected users from the usernamesearch component
    const [selectedUsers, setSelectedUsers] = useState<{ uid: string; username: string }[]>([]);

    // sharedUsers modal state
    const [shUserVisible, setShUserVisible] = useState(false);

    // taskCard variables
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    // checklist state
    const [checklist, setChecklist] = useState([{ label: "", checked: false }]);


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


    // Check if user has correct content
    const handleSubmit = () => {
        if (!title.trim()) {
            showError("Title is required!");
            return;
        }
        createTaskCard(auth.currentUser?.uid);
    };


    // taskCard creating function

    const createTaskCard = async (userId: any) => {
        try {
            const newCardRef = doc(db, "taskcards", uuidv4());

            // Filter out empty checklist items before saving✅✅✅✅
            const filteredChecklist = checklist.filter(item => item.label.trim() !== "");

            await setDoc(newCardRef, {
                title,
                content,
                checklist: filteredChecklist,
                sharedUsers: selectedUsers.map(u => u.uid),
                ownerId: userId,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            });

            router.replace("/(tabs)")

        } catch (error: any) {
            showError("Something went wrong");
        }
    };



    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.backgroundDark }}>
            <ScrollView>
                <View style={{ alignItems: "center" }}>
                    {/* card title textinput */}
                    <TextInput
                        style={styles.titleInput}
                        value={title}
                        onChangeText={setTitle}
                        placeholder='Title'
                        placeholderTextColor={theme.placeholderColor}
                    />

                    {/* main content textinput */}
                    <TextInput
                        value={content}
                        onChangeText={setContent}
                        placeholder='Type your thoughts...'
                        placeholderTextColor={theme.placeholderColor}
                        style={styles.contentInput}
                        multiline={true}
                    />

                    <View style={styles.checklistView}>

                        {/* maps all of the checklist lines that the user has typed on, each line adds a new line below it when typed on */}
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

                    {/* bottom buttons of the page */}
                    <TouchableOpacity style={styles.bigButton}
                        onPress={() => setShUserVisible(true)}
                    >
                        <Text style={styles.text}>Shared users</Text>
                    </TouchableOpacity>

                    <View style={{ flex: 1, marginBottom: 250 }}>
                        <TouchableOpacity
                            onPress={() => handleSubmit()}
                            style={styles.Button}
                        >
                            <Text style={styles.btnText}>Save</Text>
                        </TouchableOpacity>

                    </View>



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

                                {/* searches usernames for the taskcard that gets saved to the database and the users can access the info of the card themselfs */}
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
            </ScrollView >
        </SafeAreaView >

    )
}