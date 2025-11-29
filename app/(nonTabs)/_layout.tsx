import { Stack } from 'expo-router';
import { View } from 'react-native';
import { useThemedStyles } from '../../theme/useThemedStyles';



export default function NonTabsLayout() {
    // add styles and theme from a file import
    const { styles, theme } = useThemedStyles();

    return (
        <Stack
            screenOptions={{
                headerShown: true,
                headerBackground: () => (
                    <View style={{ flex: 1, backgroundColor: theme.backgroundDark }} />
                ),
                // display no title for header for clean ui
                headerTitle: "",
            }}
        />
    );
}
