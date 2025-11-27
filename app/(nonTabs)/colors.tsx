import { ThemePreference, useThemePreference } from '@/components/ThemePreferenceContext';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import * as SystemUI from 'expo-system-ui';
import React, { useEffect } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemedStyles } from '@/theme/useThemedStyles';

const THEME_OPTIONS: { label: string; value: ThemePreference; description: string }[] = [
    { label: 'Light', value: 'light', description: 'Always use the light palette' },
    { label: 'Dark', value: 'dark', description: 'Always use the dark palette' },
    { label: 'Automatic', value: 'system', description: 'Match your device setting' },
];

export default function ColorsScreen() {
    const { theme, styles } = useThemedStyles();

    const { preference, setPreference } = useThemePreference();
    const colorScheme = useColorScheme();
    const palette = Colors[colorScheme];

    useEffect(() => {
        SystemUI.setBackgroundColorAsync(colorScheme === 'dark' ? '#000000' : '#ffffff');
    }, [colorScheme]);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.backgroundDark }}>
            <View style={{ flex: 1, padding: 24, gap: 16 }}>
                <View style={{ gap: 12, marginTop: 12 }}>
                    {THEME_OPTIONS.map((option) => {
                        const isActive = preference === option.value;
                        return (
                            <TouchableOpacity
                                key={option.value}
                                onPress={() => setPreference(option.value)}
                                style={styles.bigButton}
                            >
                                <Text
                                    style={{
                                        color: palette.text,
                                        fontSize: 18,
                                        fontWeight: '600',
                                    }}
                                >
                                    {option.label}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>
        </SafeAreaView>
    );
}