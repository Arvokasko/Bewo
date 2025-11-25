import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { TextInput } from 'react-native'
import { TouchableOpacity } from 'react-native'
import { ScrollView } from 'react-native'
import { StyleSheet } from 'react-native'
import { Modal } from 'react-native'
import { useState } from 'react'
import { db } from '../../FirebaseConfig'
import { doc, setDoc, getDocs, query, where, collection, serverTimestamp } from "firebase/firestore"
import { Alert } from 'react-native'
import { v4 as uuidv4 } from 'uuid';
import { auth } from '../../FirebaseConfig'
import { router } from 'expo-router'
import UsernameSearch from '@/components/UsernameSearch'
import { View } from 'react-native'

import { Text } from '@/components/Themed'
import { useColorScheme } from 'react-native';
import { useThemedStyles } from "../../theme/useThemedStyles";



export default function createCard() {
    const { styles, theme } = useThemedStyles();
    const [userSelected, setUserSelected] = useState<string[]>([]);

    const [selectedUsernames, setSelectedUsernames] = useState<string[]>([]);

    const [selectedUsers, setSelectedUsers] = useState<{ uid: string; username: string }[]>([]);

    const [notificationData, setNotificationData] = useState("");





    // notification and sharedUsers modal state
    const [notiVisible, setNotiVisible] = useState(false);
    const [shUserVisible, setShUserVisible] = useState(false);

    // taskCard variables
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");




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
            Alert.alert("Validation Error", "Title is required!");
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

            console.log()

            router.replace("/(tabs)")

        } catch (error: any) {
            Alert.alert("Error", error.message || "Something went wrong");
        }
    };



    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.backgroundDark }}>
            <ScrollView>
                <View style={{ alignItems: "center" }}>
                    <TextInput
                        style={styles.titleInput}
                        value={title}
                        onChangeText={setTitle}
                        placeholder='Title'
                        placeholderTextColor={theme.placeholderColor}
                    />


                    <TextInput
                        value={content}
                        onChangeText={setContent}
                        placeholder='Type your thoughts...'
                        placeholderTextColor={theme.placeholderColor}
                        style={styles.contentInput}
                        multiline={true}
                    // numberOfLines={200} // could be useful
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
                                    <Text style={{ fontSize: 25 }}>{item.checked ? "☑" : "☐"}</Text>
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
            </ScrollView >
        </SafeAreaView >

    )
}