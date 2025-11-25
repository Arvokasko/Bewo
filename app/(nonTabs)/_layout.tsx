// app/(nonTabs)/_layout.tsx
import { Stack } from "expo-router";
import { View } from "react-native";
import { useThemedStyles } from "../../theme/useThemedStyles";


export default function NonTabsLayout() {
    const { styles, theme } = useThemedStyles();

    return (
        <Stack
            screenOptions={{
                headerShown: true,
                headerBackground: () => (
                    <View style={{ flex: 1, backgroundColor: theme.backgroundDark }} />
                ),
                headerTitle: "",
            }}
        />
    );
}
