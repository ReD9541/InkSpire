import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
export default function login(props: any){
    return(
        <View style={styles.container}>
            <Text style={styles.title}>Login Screen</Text>
        </View>)
}

const styles = StyleSheet.create({
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 20,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
});