import { View, Text, TouchableOpacity, TextInput, ScrollView, Modal } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import React, { useState } from 'react'
import { StyleSheet } from 'react-native';
import TaskCard from '@/components/taskCard';
import { router } from 'expo-router';


export default function index() {

    return (
        <SafeAreaView>

            {/* Top menu */}
            <View style={{ alignItems: "center", backgroundColor: "lightblue" }}>
                <View style={{ flexDirection: "row", }}>
                    <TextInput placeholder='Search' style={{ backgroundColor: "grey", width: "70%", borderRadius: 8, padding: 10, margin: 20 }} />
                    <TouchableOpacity onPress={() => router.push("/(nonTabs)/createCard")}>
                        <Text style={{ fontSize: 50, marginRight: 25, marginTop: 5 }}>+</Text>
                    </TouchableOpacity>
                </View>

            </View>
            <ScrollView>
                <View style={{ alignItems: "center", marginBottom: 100 }}>
                    <TaskCard shared={true} />
                </View>

            </ScrollView>
        </SafeAreaView >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: '80%',
    },
});
