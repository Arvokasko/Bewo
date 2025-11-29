import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import TaskCard from '@/components/taskCard';
import { useThemedStyles } from '@/theme/useThemedStyles';




export default function TabTwoScreen() {
    // add themes and styles from another file
    const { styles, theme } = useThemedStyles();

    return (
        <View style={{ backgroundColor: theme.backgroundDark, flex: 1 }}>

            <SafeAreaView>
                <View style={{ alignItems: "center", marginBottom: 100 }}>

                    {/* render all of the shared task cards */}
                    <TaskCard shared={false} />
                </View>
            </SafeAreaView >
        </View>
    );
}

