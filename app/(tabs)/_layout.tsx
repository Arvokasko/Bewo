import { Tabs } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useThemedStyles } from '@/theme/useThemedStyles';

function TabBarIcon(props: {
    name: React.ComponentProps<typeof FontAwesome>['name'];
    color: string;
}) {
    return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}


export default function TabsLayout() {
    const { theme, styles } = useThemedStyles();

    return (
        <Tabs screenOptions={{ headerShown: false, tabBarStyle: { backgroundColor: theme.backgroundDark } }}  >

            <Tabs.Screen name="index" options={{ title: 'Home', tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />, }} />
            <Tabs.Screen name="shared" options={{ title: 'Shared', tabBarIcon: ({ color }) => <TabBarIcon name="list" color={color} />, }} />
            <Tabs.Screen name="account" options={{ title: 'Account', tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />, }} />

        </Tabs>
    );
}
