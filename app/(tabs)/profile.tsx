import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  TextInput,
  Pressable,
  Text,
  View,
  Alert,
  ActivityIndicator,
} from "react-native";
import { account } from "@/lib/appwrite";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";

export default function Profile() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const user = await account.get();
        setName(user.name);
        setEmail(user.email);
      } catch (error) {
        Alert.alert("Error", "Failed to load user data.");
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const handleSave = async () => {
    try {
      const currentUser = await account.get();

      if (name && name !== currentUser.name) {
        await account.updateName(name);
      }

      if (oldPassword && newPassword) {
        await account.updatePassword(newPassword, oldPassword);
        setOldPassword("");
        setNewPassword("");
        Alert.alert("Password Updated", "Your password has been changed.");
      }

      Alert.alert("Success", "Profile updated.");
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to update profile.");
    }
  };

  if (isLoading) {
    return (
      <ThemedView style={styles.container}>
        <ActivityIndicator size="large" />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>Your Profile</ThemedText>
      </View>

      <View style={styles.labelRow}>
        <Text style={styles.label}>Email</Text>
      </View>
      <TextInput
        style={[styles.input, styles.disabledInput]}
        value={email}
        editable={false}
      />

      <View style={styles.labelRow}>
        <Text style={styles.label}>Username</Text>
      </View>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Your name"
      />

      <View style={styles.labelRow}>
        <Text style={styles.label}>Old Password</Text>
      </View>
      <TextInput
        style={styles.input}
        value={oldPassword}
        onChangeText={setOldPassword}
        placeholder="Current Password"
        secureTextEntry
      />

      <View style={styles.labelRow}>
        <Text style={styles.label}>New Password</Text>
      </View>
      <TextInput
        style={styles.input}
        value={newPassword}
        onChangeText={setNewPassword}
        placeholder="New Password"
        secureTextEntry
      />

      <Pressable onPress={handleSave} style={styles.primaryButton}>
        <Text style={styles.primaryButtonText}>Update Profile</Text>
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 80,
  },
  header: {
    marginBottom: 40,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#111",
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#222",
  },
  input: {
    backgroundColor: "#f1f1f1",
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#C08EFF",
  },
  disabledInput: {
    color: "#999",
    backgroundColor: "#eee",
  },
  primaryButton: {
    backgroundColor: "#111",
    paddingVertical: 12,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 10,
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },
});
