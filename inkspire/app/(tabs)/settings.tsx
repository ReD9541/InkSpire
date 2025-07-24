import React from "react";
import { StyleSheet, View, Pressable, Text, Image } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

export default function Settings() {
  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>Settings</ThemedText>
        <Image
          source={require("../../assets/images/InkSpire_logo.png")}
          style={styles.logo}
        />
      </View>

      <Pressable style={styles.settingItem}>
        <Text style={styles.settingText}>Notifications</Text>
      </Pressable>

      <Pressable style={styles.settingItem}>
        <Text style={styles.settingText}>Dark Mode</Text>
      </Pressable>

      <Pressable style={styles.settingItem}>
        <Text style={styles.settingText}>Privacy & Security</Text>
      </Pressable>

      <Pressable style={styles.settingItem}>
        <Text style={styles.settingText}>Account Settings</Text>
      </Pressable>

      <Pressable style={[styles.settingItem, styles.logoutItem]}>
        <Text style={styles.logoutText}>Log Out</Text>
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#111",
    flex: 1,
    marginRight: 10,
  },
  logo: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  settingItem: {
    backgroundColor: "#f1f1f1",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#C08EFF",
    marginBottom: 15,
  },
  settingText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#222",
  },
  logoutItem: {
    backgroundColor: "#111",
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});
