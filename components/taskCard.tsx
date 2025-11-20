import { View, Text } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native'
import { StyleSheet } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function TaskCard() {
    return (
        <TouchableOpacity style={{ backgroundColor: "grey", marginTop: 15, width: "90%", borderRadius: 8, padding: 10, height: 150, overflow: 'hidden' }}>
            <View style={{ alignItems: "flex-end" }}>
                <TouchableOpacity style={{ padding: 10 }}>
                    <FontAwesome style={{ marginTop: 20 }} name="arrow-up" size={24} color="black" />
                </TouchableOpacity>
                <TouchableOpacity style={{ padding: 10 }}>
                    <FontAwesome style={{}} name="arrow-down" size={24} color="black" />
                </TouchableOpacity>
            </View>
            <Text style={styles.title}>Title</Text>
            <Text style={{ width: "90%" }}>content nad some sum mores huifes content nad some sum mores huifes content nad some sum mores huifes content nad some sum mores huifes content nad some sum mores huifes content nad some sum mores huifes content nad some sum mores huifes content nad some sum mores huifes content nad some sum mores huifes content nad some sum mores huifes content nad some sum mores huifes content nad some sum mores huifes content nad some sum mores huifes content nad some sum mores huifes content nad some sum mores huifes content nad some sum mores huifes content nad some sum mores huifes content nad some sum mores huifes content nad some sum mores huifes content nad some sum mores huifes content nad some sum mores huifes content nad some sum mores huifes content nad some sum mores huifes content nad some sum mores huifes content nad some sum mores huifes content nad some sum mores huifes content nad some sum mores huifes content nad some sum mores huifes content nad some sum mores huifes content nad some sum mores huifes </Text>
            <LinearGradient
                colors={['rgba(128, 128, 128, 1)', 'transparent']} // needs to be the same color as the color of the container to work properly
                start={{ x: 0.5, y: 1 }}  // top
                end={{ x: 0.5, y: 0 }}    // bottom
                style={styles.innerShadow}
            />



        </TouchableOpacity>
    )
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        width: "90%",
        marginTop: -100
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: '80%',
    },
    innerShadow: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 40,
        zIndex: 10,
    },
});