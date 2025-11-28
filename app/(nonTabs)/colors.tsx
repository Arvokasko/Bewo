import { ThemePreference, useThemePreference } from '@/components/ThemePreferenceContext';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import * as SystemUI from 'expo-system-ui';
import React, { useEffect } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemedStyles } from '@/theme/useThemedStyles';

const THEME_OPTIONS: { label: string; value: ThemePreference; }[] = [
    { label: 'Light', value: 'light' },
    { label: 'Dark', value: 'dark' },
    { label: 'Automatic', value: 'system' },
];

export default function ColorsScreen() {
    const { theme, styles } = useThemedStyles();

    const { preference, setPreference } = useThemePreference();
    const colorScheme = useColorScheme();

    useEffect(() => {
        SystemUI.setBackgroundColorAsync(colorScheme === 'dark' ? '#000000' : '#ffffff');
    }, [colorScheme]);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.backgroundDark }}>
            <View style={{ gap: 12, alignItems: "center", flex: 1, }}>
                {THEME_OPTIONS.map((option) => {
                    return (
                        <TouchableOpacity
                            key={option.value}
                            onPress={() => setPreference(option.value)}
                            style={styles.bigButton}
                        >
                            <Text
                                style={styles.text}
                            >
                                {option.label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </SafeAreaView>
    );
}