import { StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import TaskCard from '@/components/taskCard';
import { View } from 'react-native';
import { TextInput } from 'react-native';
import { ScrollView } from 'react-native';





export default function TabTwoScreen() {
    return (
        <SafeAreaView>

            {/* Top menu */}
            <View style={{ alignItems: "center", backgroundColor: "lightblue" }}>
                <View style={{ flexDirection: "row", }}>
                    <TextInput placeholder='Search' style={{ backgroundColor: "grey", width: "70%", borderRadius: 8, padding: 10, margin: 20 }} />
                </View>

            </View>
            <ScrollView>
                <View style={{ alignItems: "center", marginBottom: 100 }}>
                    <TaskCard shared={false} />
                    {/* cardIndex="1" */}
                </View>

            </ScrollView>
        </SafeAreaView >
    );
}

