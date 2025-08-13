import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import {
  CHALLENGES_COLLECTION_ID,
  DATABASE_ID,
  EXPO_PUBLIC_APPWRITE_ENDPOINT,
  EXPO_PUBLIC_APPWRITE_PROJECT_ID,
  PROMPTS_COLLECTION_ID,
  USER_POST_BUCKET_ID,
  USER_POST_COLLECTION_ID,
} from "@/config/Config";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
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
import {
  Account,
  Client,
  Databases,
  ID,
  Permission,
  Query,
  Role,
  Storage,
} from "react-native-appwrite";
import { SafeAreaView } from "react-native-safe-area-context";

const ACCENT = "#C08EFF";

const client = new Client()
  .setEndpoint(EXPO_PUBLIC_APPWRITE_ENDPOINT)
  .setProject(EXPO_PUBLIC_APPWRITE_PROJECT_ID);

const storage = new Storage(client);
const databases = new Databases(client);
const account = new Account(client);

type ChallengeDoc = {
  $id: string;
  name?: string;
  title?: string;
};

export default function Create() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [challenges, setChallenges] = useState<ChallengeDoc[]>([]);
  const [selectedChallengeId, setSelectedChallengeId] = useState<string>("");

  const [localUri, setLocalUri] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const fetchChallenges = async () => {
      try {
        const res = await databases.listDocuments(
          DATABASE_ID,
          CHALLENGES_COLLECTION_ID
        );
        if (!cancelled) {
          setChallenges(res.documents as unknown as ChallengeDoc[]);
        }
      } catch (err: any) {
        console.error("Error fetching challenges:", err);
        Alert.alert("Couldn't load challenges", err?.message ?? "Try again.");
      }
    };

    const fetchPromptAndPrefill = async () => {
      try {
        const now = new Date();
        const startOfToday = new Date(
          Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
        );
        const nowISO = now.toISOString();

        const todayRes = await databases.listDocuments(
          DATABASE_ID,
          PROMPTS_COLLECTION_ID,
          [
            Query.lessThanEqual("date", nowISO),
            Query.greaterThanEqual("date", startOfToday.toISOString()),
            Query.orderDesc("date"),
            Query.limit(1),
          ]
        );

        let promptText: string | null = null;

        if (todayRes.documents.length > 0) {
          promptText = todayRes.documents[0].text as string;
        } else {
          const fallbackRes = await databases.listDocuments(
            DATABASE_ID,
            PROMPTS_COLLECTION_ID,
            [
              Query.lessThan("date", startOfToday.toISOString()),
              Query.orderDesc("date"),
              Query.limit(1),
            ]
          );
          if (fallbackRes.documents.length > 0) {
            promptText = fallbackRes.documents[0].text as string;
          }
        }

        if (!cancelled && promptText && !title.trim()) {
          setTitle(promptText);
        }
      } catch (err) {
      }
    };

    fetchChallenges();
    fetchPromptAndPrefill();

    return () => {
      cancelled = true;
    };
  }, [title]);

  const challengeLabel = useCallback((c: ChallengeDoc) => {
    return c.name || c.title || c.$id;
  }, []);

  const selectedChallengeName = useMemo(() => {
    const found = challenges.find((c) => c.$id === selectedChallengeId);
    return found ? challengeLabel(found) : "Select Challenge";
  }, [challenges, selectedChallengeId, challengeLabel]);

  const pickImage = useCallback(async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets?.[0]) {
      setLocalUri(result.assets[0].uri);
    }
  }, []);

  const handleCreatePost = useCallback(async () => {
    if (!selectedChallengeId) {
      Alert.alert("Missing Challenge", "Please select a challenge.");
      return;
    }
    if (!content.trim()) {
      Alert.alert("Missing Description", "Please add a description.");
      return;
    }
    if (!localUri) {
      Alert.alert("Missing Image", "Please select an image.");
      return;
    }

    try {
      const { $id: userId } = await account.get().catch(() => {
        throw new Error("You need to be signed in before creating a post.");
      });

      setUploading(true);

      const file = {
        uri: localUri,
        type: "image/jpeg",
        name: "upload.jpg",
        size: 0,
      };

      const filePermissions = [
        Permission.read(Role.any()),
        Permission.update(Role.user(userId)),
        Permission.delete(Role.user(userId)),
        Permission.write(Role.user(userId)),
      ];

      const uploadedFile = await storage.createFile(
        USER_POST_BUCKET_ID,
        ID.unique(),
        file,
        filePermissions
      );

      const docPermissions = [
        Permission.read(Role.any()),
        Permission.update(Role.user(userId)),
        Permission.delete(Role.user(userId)),
        Permission.write(Role.user(userId)),
      ];

      await databases.createDocument(
        DATABASE_ID,
        USER_POST_COLLECTION_ID,
        ID.unique(),
        {
          title: title.trim(),
          description: content.trim(),
          imageId: uploadedFile.$id,
          challangeID: selectedChallengeId,
          favouritedBy: "",
          userID: userId,
        },
        docPermissions
      );

      Alert.alert("Success", "Your post has been created!");

      setTitle("");
      setContent("");
      setLocalUri(null);
      setSelectedChallengeId("");
    } catch (error: any) {
      console.error("Error creating post:", error);
      Alert.alert("Error", error?.message || "Something went wrong");
    } finally {
      setUploading(false);
    }
  }, [selectedChallengeId, content, localUri, title]);

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
              <Pressable style={styles.uploadInner} onPress={pickImage}>
                {localUri ? (
                  <>
                    <Image
                      source={{ uri: localUri }}
                      style={styles.previewImage}
                      resizeMode="cover"
                    />
                    <View style={styles.previewOverlay}>
                      <Text style={styles.uploadLabel}>Change Image</Text>
                    </View>
                  </>
                ) : (
                  <>
                    <Image
                      source={require("../../assets/icons/camera-icon.png")}
                      style={styles.uploadIcon}
                      resizeMode="contain"
                    />
                    <Text style={styles.uploadLabel}>Select Image</Text>
                  </>
                )}
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
            <View style={[styles.inputDark, styles.dropdown, { paddingRight: 8 }]}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingRight: 4 }}
              >
                {challenges.length === 0 ? (
                  <Text style={[styles.dropdownText, { opacity: 0.6 }]}>
                    Loading…
                  </Text>
                ) : (
                  challenges.map((ch) => {
                    const active = selectedChallengeId === ch.$id;
                    return (
                      <Pressable
                        key={ch.$id}
                        onPress={() => setSelectedChallengeId(ch.$id)}
                        style={[
                          styles.chip,
                          active && { backgroundColor: ACCENT, borderColor: ACCENT },
                        ]}
                      >
                        <Text style={styles.chipText}>
                          {ch.name || ch.title || ch.$id}
                        </Text>
                      </Pressable>
                    );
                  })
                )}
              </ScrollView>
            </View>

            <ThemedText style={styles.fieldLabel}>Title</ThemedText>
            <TextInput
              style={styles.inputDark}
              placeholder="Give your post a title"
              placeholderTextColor="#9B90B5"
              value={title}
              onChangeText={setTitle}
            />

            <Pressable onPress={handleCreatePost} style={styles.pill} disabled={uploading}>
              <LinearGradient
                colors={["#C08EFF", "#F0A7F5", "#FFCAA7"]}
                start={[0, 0]}
                end={[1, 1]}
                style={styles.pillGrad}
              >
                {uploading ? (
                  <ActivityIndicator />
                ) : (
                  <Text style={styles.primaryText}>Publish</Text>
                )}
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
    overflow: "hidden",
  },
  uploadIcon: {
    width: 28,
    height: 28,
    tintColor: "#EDEAF8",
    marginBottom: 8,
  },
  uploadLabel: {
    color: "#EDEAF8",
    fontSize: 16,
  },
  previewImage: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  previewOverlay: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    paddingVertical: 10,
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.35)",
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

  chip: {
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    backgroundColor: "#2A2A2A",
    borderWidth: 1,
    borderColor: "#3A3A3A",
  },
  chipText: {
    color: "#FFFFFF",
    fontSize: 14,
  },

  pill: {
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
});
