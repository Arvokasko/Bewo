// app/(nonTabs)/_layout.tsx
import { Stack } from "expo-router";
import { View } from "react-native";

export default function NonTabsLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: true,
                headerBackground: () => (
                    <View style={{ flex: 1, backgroundColor: "transparent" }} />
                ),
            }}
        />
    );
}
