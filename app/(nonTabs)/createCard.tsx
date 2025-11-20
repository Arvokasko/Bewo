import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { TextInput } from 'react-native'
import { TouchableOpacity } from 'react-native'
import { ScrollView } from 'react-native'
import { StyleSheet } from 'react-native'

export default function createCard() {
    return (
        <SafeAreaView>
            <ScrollView>
                <View style={{ alignItems: "center" }}>
                    <TextInput placeholder='Title' style={{ backgroundColor: "grey", width: "80%", borderRadius: 8, padding: 10, margin: 20 }} />

                    <View style={{ flexDirection: "row", }}>

                        <TouchableOpacity style={styles.smallButton}>
                            <Text style={styles.text}>Plain</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.smallButton}>
                            <Text style={styles.text}>Numbers</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.smallButton}>
                            <Text style={styles.text}>Checklist</Text>
                        </TouchableOpacity>

                    </View>

                    <TextInput
                        placeholder='Type your thoughts...'
                        style={{ width: "80%", backgroundColor: "grey", height: "auto", minHeight: 200, borderRadius: 8, textAlignVertical: "top", padding: 10 }}
                        multiline={true}
                    // numberOfLines={200} // could be useful
                    />


                    <TouchableOpacity style={styles.bigButton}>
                        <Text style={styles.text}>Shared users</Text>
                    </TouchableOpacity>


                    <TouchableOpacity style={styles.bigButton}>
                        <Text style={styles.text}>Notifications</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.Button}>
                        <Text style={styles.text}>Save</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.Button}>
                        <Text style={styles.text}>Delete</Text>
                    </TouchableOpacity>


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
        width: "50%",
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