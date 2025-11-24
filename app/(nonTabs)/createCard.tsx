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


export default function createCard() {
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



    // // checkbox handling
    // const [selected, setSelected] = useState<{ [key: string]: boolean }>({
    //     Mon: false,
    //     Tue: false,
    //     Wed: false,
    //     Thu: false,
    //     Fri: false,
    //     Sat: false,
    //     Sun: false,
    // });

    // const toggleCheckbox = (key: string) => {
    //     setSelected((prev) => ({ ...prev, [key]: !prev[key] }));
    // };


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
        <SafeAreaView>
            <Text style={{ fontSize: 25, textAlign: "center" }}>Create taskcard</Text>
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
                        style={{ width: "80%", backgroundColor: "grey", height: "auto", minHeight: 200, borderRadius: 8, textAlignVertical: "top", padding: 10 }}
                        multiline={true}
                    // numberOfLines={200} // could be useful
                    />

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
                                <Text style={{ fontSize: 18 }}>{item.checked ? "☑" : "☐"}</Text>
                            </TouchableOpacity>

                            {/* Text input */}
                            <TextInput
                                value={item.label}
                                onChangeText={(text) => handleChecklistChange(text, index)}
                                placeholder={`Task ${index + 1}`}
                                style={{
                                    marginLeft: 10,
                                    borderBottomWidth: 1,
                                    flex: 1,
                                    paddingVertical: 4,
                                }}
                            />

                            {/* Delete button */}
                            <TouchableOpacity
                                onPress={() => {
                                    const updated = checklist.filter((_, i) => i !== index);
                                    setChecklist(updated.length ? updated : [{ label: "", checked: false }]);
                                }}
                                style={{
                                    marginLeft: 10,
                                    paddingHorizontal: 8,
                                    paddingVertical: 4,
                                    backgroundColor: "darkred",
                                    borderRadius: 4,
                                }}
                            >
                                <Text style={{ color: "white" }}>✕</Text>
                            </TouchableOpacity>
                        </View>
                    ))}


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
                            <Text style={styles.text}>Save</Text>
                        </TouchableOpacity>

                    </View>



                    {/* Shared users popup panel */}

                    <Modal
                        visible={shUserVisible}
                        transparent
                        animationType="fade"
                        onRequestClose={() => setShUserVisible(false)}
                    >
                        <View style={{ flex: 1, justifyContent: "center", padding: 20, backgroundColor: "#00000050", }}>

                            <Text style={{ color: "white" }}>Shared taskcard with users</Text>
                            <UsernameSearch onSelectionChange={setSelectedUsers} />
                            <TouchableOpacity

                                style={styles.Button}
                                onPress={() => setShUserVisible(false)}
                            >
                                <Text style={{ textAlign: "center" }}>Okay</Text>
                            </TouchableOpacity>
                        </View>
                    </Modal>


                </View>
            </ScrollView>
        </SafeAreaView>

    )
}


const styles = StyleSheet.create({
    text: {
        textAlign: "center",
    },
    Button: {
        width: 150,
        padding: 10,
        backgroundColor: "grey",
        margin: 10,
        borderRadius: 8,
    },
    smallButton: {
        width: 100,
        padding: 10,
        backgroundColor: "grey",
        margin: 10,
        borderRadius: 8,
    },
    bigButton: {
        width: "80%",
        padding: 10,
        backgroundColor: "grey",
        margin: 10,
        borderRadius: 8,
    },
});