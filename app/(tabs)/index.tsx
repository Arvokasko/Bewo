import { View, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import React from 'react'
import TaskCard from '@/components/taskCard';
import { useThemedStyles } from '@/theme/useThemedStyles';


export default function index() {
    // add themes and styles from another file
    const { styles, theme } = useThemedStyles();

    return (
        <View style={{ backgroundColor: theme.backgroundDark, flex: 1 }}>
            <SafeAreaView>
                <ScrollView>
                    <View style={{ alignItems: "center", marginBottom: 100 }}>

                        {/* render all of the owned taskcards */}
                        <TaskCard shared={true} />
                    </View>
                </ScrollView>
            </SafeAreaView >
        </View>
    );
}