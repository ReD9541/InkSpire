import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ACCENT = "#C08EFF";

export default function Create() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleCreatePost = () => {
    console.log("Creating post:", { title, content });
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ThemedView style={styles.container}>
          <ScrollView contentContainerStyle={{ paddingBottom: 28 }}>
            <View style={styles.header}>
              <View style={{ flex: 1, paddingRight: 10 }}>
                <ThemedText style={styles.title}>Create a Post</ThemedText>
              </View>
              <Image
                source={require("../../assets/images/InkSpire_logo.png")}
                style={styles.logo}
              />
            </View>

            <LinearGradient
              colors={["#C08EFF", "#F0A7F5", "#FFCAA7", "#D5E4B5"]}
              start={[0, 0]}
              end={[1, 1]}
              style={styles.uploadWrapper}
            >
              <Pressable style={styles.uploadInner}>
                  <Image
                    source={require("../../assets/icons/camera-icon.png")}
                    style={styles.uploadIcon}
                    resizeMode="contain"
                  />
                <Text style={styles.uploadLabel}>Select Image</Text>
              </Pressable>
            </LinearGradient>

            <ThemedText style={styles.fieldLabel}>Description</ThemedText>
            <TextInput
              style={[styles.inputDark, styles.textArea]}
              placeholder="Add a description"
              placeholderTextColor="#9B90B5"
              multiline
              value={content}
              onChangeText={setContent}
            />

            <ThemedText style={styles.fieldLabel}>Challenge</ThemedText>
            <Pressable style={[styles.inputDark, styles.dropdown]}>
              <Text style={styles.dropdownText}>Select Challenge</Text>
              <Text style={styles.chevron}>⌄</Text>
            </Pressable>

              <Pressable onPress={handleCreatePost} style={styles.pill}>
                <LinearGradient
                  colors={["#C08EFF", "#F0A7F5", "#FFCAA7"]}
                  start={[0, 0]}
                  end={[1, 1]}
                  style={styles.pillGrad}
                >
                  <Text style={styles.primaryText}>Publish</Text>
                </LinearGradient>
              </Pressable>
          </ScrollView>
        </ThemedView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#111111",
  },
  container: {
    flex: 1,
    backgroundColor: "#111111",
    paddingHorizontal: 20,
    paddingTop: 8,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  title: {
    color: "#FFE6EC",
    fontSize: 32,
    fontWeight: "800",
    lineHeight: 32,
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: "contain",
    borderRadius: 45,
  },
  brandDivider: {
    height: 3,
    borderRadius: 3,
    marginBottom: 18,
  },

  uploadWrapper: {
    borderRadius: 18,
    padding: 2,
    marginBottom: 18,
  },
  uploadInner: {
    backgroundColor: "#1A1A1A",
    borderRadius: 16,
    height: 210,
    alignItems: "center",
    justifyContent: "center",
  },
  uploadIcon: {
    width: 28,
    height: 28,
    tintColor: "#EDEAF8",
  },
  uploadLabel: {
    color: "#EDEAF8",
    fontSize: 16,
  },

  fieldLabel: {
    color: "#FFE6EC",
    fontWeight: "700",
    fontSize: 18,
    marginBottom: 10,
    marginTop: 6,
  },

  inputDark: {
    backgroundColor: "#181818",
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#FFFFFF",
    borderWidth: 1,
    borderColor: ACCENT,
    marginBottom: 16,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: "top",
  },

  dropdown: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dropdownText: {
    color: "#EDEAF8",
    fontSize: 16,
  },
  chevron: {
    color: "#C8BEDF",
    fontSize: 18,
    marginLeft: 10,
  },

  actionsRow: {
    flexDirection: "row",
    marginTop: 8,
    gap: 12,
  },
  pill: {
    flex: 1,
    borderRadius: 28,
    overflow: "hidden",
  },
  pillGrad: {
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 28,
  },
  primaryText: {
    color: "#111",
    fontWeight: "700",
    fontSize: 16,
  },
  secondaryPill: {
    backgroundColor: "#1A1A1A",
    borderWidth: 1,
    borderColor: "#2B2B2B",
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryText: {
    color: "#D2CFE6",
    fontWeight: "700",
    fontSize: 16,
    paddingVertical: 12,
  },
});
