import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from 'expo-router';
import { Link } from 'expo-router';

export default function landing() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/InkSpire_logo.png')} 
        style={styles.logo}
      />

      <Text style={styles.description}>
        A Community Built for Artists Like You.
      </Text>

      <Link href="/register" asChild>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Join Now</Text>
        </TouchableOpacity>
      </Link>

      <View style={styles.signInContainer}>
        <Text style={styles.signInText}>Already have an account?</Text>
        <Link href="/login">
          <Text style={styles.signInButton}>Sign In</Text>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
    backgroundColor: '#4CAF50', 
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
    color: '#4CAF50', 
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 5,
  },
});
