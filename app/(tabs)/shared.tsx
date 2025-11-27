import { StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import TaskCard from '@/components/taskCard';
import { View } from 'react-native';
import { TextInput } from 'react-native';
import { ScrollView } from 'react-native';
import { useThemedStyles } from '@/theme/useThemedStyles';




export default function TabTwoScreen() {
    const { styles, theme } = useThemedStyles();

    return (
        <View style={{ backgroundColor: theme.backgroundDark, flex: 1 }}>

            <SafeAreaView>
                <View style={{ alignItems: "center", marginBottom: 100 }}>
                    <TaskCard shared={false} />
                    {/* cardIndex="1" */}
                </View>

            </SafeAreaView >
        </View>
    );
}

