import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Appearance, useColorScheme } from 'react-native';
import { useState } from 'react';
import * as SystemUI from "expo-system-ui";

export default function colors() {
    const systemScheme = useColorScheme();
    const [theme, setTheme] = useState(systemScheme || "light");


    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);

        // Update system navigation bar color (Android only)
        SystemUI.setBackgroundColorAsync(newTheme === "dark" ? "#000000" : "#ffffff");
    };

    return (
        <SafeAreaView>
            <View
                style={[
                    { backgroundColor: theme === "dark" ? "#000" : "#fff" },
                ]}
            >
                <Text style={{ color: theme === "dark" ? "#fff" : "#000" }}>
                    Current theme: {theme}
                </Text>
                <TouchableOpacity onPress={toggleTheme} >
                    <Text>change theme</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}