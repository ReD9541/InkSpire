import React from 'react';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { StyleSheet } from 'react-native';

export default function homescreen() {
    return (
        <ThemedView style={styles.container}>
            <ThemedText style={styles.title}>Welcome to InkSpire!</ThemedText>
            <ThemedText style={styles.description}>
                Your creative journey starts here.
            </ThemedText>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
    },
    description: {
        fontSize: 16,
        textAlign: 'center',
        opacity: 0.8,
    },
});
