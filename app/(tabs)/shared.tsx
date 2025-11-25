import { StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import TaskCard from '@/components/taskCard';
import { View } from 'react-native';
import { TextInput } from 'react-native';
import { ScrollView } from 'react-native';





export default function TabTwoScreen() {
    return (
        <SafeAreaView>
            <ScrollView>
                <View style={{ alignItems: "center", marginBottom: 100 }}>
                    <TaskCard shared={false} />
                    {/* cardIndex="1" */}
                </View>

            </ScrollView>
        </SafeAreaView >
    );
}

