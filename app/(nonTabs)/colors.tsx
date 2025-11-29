import React, { useEffect } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as SystemUI from 'expo-system-ui';
import { ThemePreference, useThemePreference } from '@/components/ThemePreferenceContext';
import { useColorScheme } from '@/components/useColorScheme';
import { useThemedStyles } from '@/theme/useThemedStyles';


// define all of the available themes with values
const themeOptions: { label: string; value: ThemePreference; }[] = [
    { label: 'Light', value: 'light' },
    { label: 'Dark', value: 'dark' },
    { label: 'Automatic', value: 'system' },
];

export default function ColorsScreen() {
    // add the theme styling to the page
    const { theme, styles } = useThemedStyles();

    const { preference, setPreference } = useThemePreference();
    const colorScheme = useColorScheme();

    useEffect(() => {
        SystemUI.setBackgroundColorAsync(colorScheme === 'dark' ? '#000000' : '#ffffff');
    }, [colorScheme]);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.backgroundDark }}>
            <View style={{ gap: 12, alignItems: "center", flex: 1 }}>
                {/* Render a button for each theme option */}
                {themeOptions.map((option) => {
                    return (
                        <TouchableOpacity
                            key={option.value}
                            onPress={() => setPreference(option.value)}
                            style={styles.bigButton}
                        >
                            <Text style={styles.text}>
                                {/* Display option label (Light/Dark/Automatic) */}
                                {option.label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </SafeAreaView>
    );
}