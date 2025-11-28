import { View, Text, TouchableOpacity, TextInput, ScrollView, Modal } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import React, { useState } from 'react'
import { StyleSheet } from 'react-native';
import TaskCard from '@/components/taskCard';
import { router } from 'expo-router';
import { useThemedStyles } from '@/theme/useThemedStyles';


export default function index() {
    const { styles, theme } = useThemedStyles();

    return (
        <View style={{ backgroundColor: theme.backgroundDark, flex: 1 }}>
            <SafeAreaView>
                <ScrollView>
                    <View style={{ alignItems: "center", marginBottom: 100 }}>
                        <TaskCard shared={true} />
                    </View>

                </ScrollView>

            </SafeAreaView >
        </View>
    );
}