import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Link } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function landing() {

  return (
    <ThemedView style={styles.container}>
      <Image
        source={require('../assets/images/InkSpire_logo.png')} 
        style={styles.logo}
      />

      <ThemedText style={styles.description}>
        A Community Built for Artists Like You.
      </ThemedText>

      <Link href="/register" asChild>
        <TouchableOpacity style={styles.button}>
          <ThemedText style={styles.buttonText}>Join Now</ThemedText>
        </TouchableOpacity>
      </Link>

      <View style={styles.signInContainer}>
        <ThemedText style={styles.signInText}>Already have an account?</ThemedText>
        <Link href="/login">
          <ThemedText style={styles.signInButton}>Sign In</ThemedText>
        </Link>
      </View>
    </ThemedView>
  );
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  logo: {
    width: 150,  
    height: 150, 
    marginBottom: 30,
    borderRadius: 75,
  },
  description: {
    fontSize: 18,
    color: '#555',
    textAlign: 'center',
    marginBottom: 40,
    paddingHorizontal: 40,
  },
  button: {
    backgroundColor: '#C08EFF', 
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 30,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  signInContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  signInText: {
    color: '#888',
    fontSize: 16,
  },
  signInButton: {
    color: '#C08EFF', 
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 5,
  },
});
