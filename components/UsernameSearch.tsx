import React, { useState, useEffect } from "react";
import { View, TextInput, FlatList, Text, TouchableOpacity, Alert } from "react-native";
import { collection, query, orderBy, startAt, endAt, getDocs } from "firebase/firestore";
import { db } from "@/FirebaseConfig";
import { useThemedStyles } from "@/theme/useThemedStyles";
import { useError } from '@/components/ErrorModal';


type User = { uid: string; username: string };

interface UsernameSearchProps {
    onSelectionChange: (selected: User[]) => void; // parent gets full objects
}

export default function UsernameSearch({ onSelectionChange }: UsernameSearchProps) {
    // adding custom error popup
    const { showError } = useError();
    // adding styles and theme from another file
    const { styles, theme } = useThemedStyles();


    // search input value
    const [searchText, setSearchText] = useState("");
    const [results, setResults] = useState<User[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<User[]>([]);



    useEffect(() => {
        const fetchUsers = async () => {
            if (searchText.trim() === "") {
                setResults([]);
                return;
            }

            try {
                const usersRef = collection(db, "users");
                const q = query(
                    usersRef,
                    orderBy("username"),
                    startAt(searchText),
                    endAt(searchText + "\uf8ff")
                );

                const snapshot = await getDocs(q);
                const users = snapshot.docs.map((doc) => ({
                    uid: doc.id,
                    username: doc.data().username,
                }));
                setResults(users);
            } catch (error) {
                console.error("Error fetching users:", error);
                showError("Could not fetch users.");
            }
        };

        fetchUsers();
    }, [searchText]);

    const handleSelect = (user: User) => {
        if (!selectedUsers.find((u) => u.uid === user.uid)) {
            const updated = [...selectedUsers, user];
            setSelectedUsers(updated);
            onSelectionChange(updated);
        }
    };

    const handleDeselect = (uid: string) => {
        const updated = selectedUsers.filter((u) => u.uid !== uid);
        setSelectedUsers(updated);
        onSelectionChange(updated);
    };

    return (
        <View style={{ padding: 20 }}>
            <TextInput
                placeholder="Search usernames"
                value={searchText}
                onChangeText={setSearchText}
                style={[styles.titleInput,
                {
                    margin: 0,
                    marginVertical: 20,
                    width: "100%"
                }]}
                placeholderTextColor={theme.placeholderColor}
            />
            <FlatList
                data={results}
                keyExtractor={(item) => item.uid}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => handleSelect(item)}
                        style={styles.resultItem}
                    >
                        <Text style={styles.text}>{item.username}</Text>
                    </TouchableOpacity>
                )}
            />

            {/* Selected users with individual buttons */}
            <View style={{ marginTop: 20 }}>
                <Text style={styles.text}>Selected users</Text>
                {selectedUsers.map((user) => (
                    <View
                        key={user.uid}
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            marginTop: 8,
                        }}
                    >
                        <Text style={[styles.text, { flex: 1, marginLeft: 10 }]}>{user.username}</Text>
                        <TouchableOpacity
                            onPress={() => handleDeselect(user.uid)}
                            style={styles.deleteBtn}
                        >
                            <Text style={styles.btnText}>X</Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </View>
        </View>
    );
}
