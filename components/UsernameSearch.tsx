import React, { useState, useEffect } from "react";
import { View, TextInput, FlatList, Text, TouchableOpacity, Alert } from "react-native";
import { collection, query, orderBy, startAt, endAt, getDocs } from "firebase/firestore";
import { db } from "@/FirebaseConfig";

type User = { uid: string; username: string };

interface UsernameSearchProps {
    onSelectionChange: (selected: User[]) => void; // parent gets full objects
}

export default function UsernameSearch({ onSelectionChange }: UsernameSearchProps) {
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
                Alert.alert("Error", "Could not fetch users.");
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
                placeholder="Search username..."
                value={searchText}
                onChangeText={setSearchText}
                style={{
                    borderWidth: 1,
                    borderColor: "#ccc",
                    padding: 10,
                    borderRadius: 8,
                    marginBottom: 10,
                }}
            />
            <FlatList
                data={results}
                keyExtractor={(item) => item.uid}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => handleSelect(item)}
                        style={{
                            padding: 10,
                            borderBottomWidth: 1,
                            borderColor: "#eee",
                        }}
                    >
                        <Text>{item.username}</Text>
                    </TouchableOpacity>
                )}
            />

            {/* Selected users with individual buttons */}
            <View style={{ marginTop: 20 }}>
                <Text style={{ fontWeight: "bold", marginBottom: 10 }}>Selected:</Text>
                {selectedUsers.map((user) => (
                    <View
                        key={user.uid}
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            marginBottom: 8,
                        }}
                    >
                        <Text style={{ flex: 1 }}>{user.username}</Text>
                        <TouchableOpacity
                            onPress={() => handleDeselect(user.uid)}
                            style={{
                                backgroundColor: "#f55",
                                paddingVertical: 6,
                                paddingHorizontal: 12,
                                borderRadius: 6,
                            }}
                        >
                            <Text style={{ color: "#fff", fontWeight: "bold" }}>X</Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </View>
        </View>
    );
}
