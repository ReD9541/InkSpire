import React, { useState } from "react";
import {
  StyleSheet,
  TextInput,
  Pressable,
  Text,
  Image,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

export default function Create() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleCreatePost = () => {
    console.log("Creating post:", { title, content });
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={{ flex: 1 }}
        >
          <View style={styles.header}>
            <ThemedText style={styles.title}>Create a Post</ThemedText>
            <Image
              source={require("../../assets/images/InkSpire_logo.png")}
              style={styles.logo}
            />
          </View>

          <TextInput
            style={styles.input}
            placeholder="Title"
            value={title}
            onChangeText={setTitle}
          />

          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Write your thoughts here..."
            value={content}
            onChangeText={setContent}
            multiline
          />

          <Pressable style={styles.uploadButton}>
            <Text style={styles.uploadButtonText}>Upload Image</Text>
          </Pressable>

          <Pressable style={styles.button} onPress={handleCreatePost}>
            <Text style={styles.buttonText}>Publish</Text>
          </Pressable>
        </KeyboardAvoidingView>
      </ScrollView>
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
    marginBottom: 40,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#111",
    flex: 1,
    marginRight: 10,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
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
  textArea: {
    height: 150,
    textAlignVertical: "top",
    borderRadius: 20,
  },
  uploadButton: {
    backgroundColor: "#B394D9",
    borderRadius: 30,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 15,
  },
  uploadButtonText: {
    color: "#111",
    fontWeight: "600",
    fontSize: 16,
  },
  button: {
    backgroundColor: "#111",
    borderRadius: 30,
    paddingVertical: 14,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
