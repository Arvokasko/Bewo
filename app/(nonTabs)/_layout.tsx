// app/(nonTabs)/_layout.tsx
import { Stack } from "expo-router";
import { View } from "react-native";

export default function NonTabsLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: true,
                headerTitle: "",
                headerBackground: () => (
                    <View style={{ backgroundColor: "pink" }} />
                ),
            }}
        />
    );
}
