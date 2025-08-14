import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import {
  DATABASE_ID,
  USER_PROFILE_BUCKET_ID,
  USER_PROFILE_COLLECTION_ID,
} from "@/config/Config";
import { account, databases, storage } from "@/lib/appwrite";
import { buildFileUrl, pickImage } from "@/utils/helper";
import { Feather, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
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
import { ID, Permission, Query, Role } from "react-native-appwrite";
import { SafeAreaView } from "react-native-safe-area-context";

// Defines constants for layout
const ACCENT = "#C08EFF";

// Defines the Profile document type
type ProfileDoc = {
  $id: string;
  Userid: string;
  bio?: string;
  profilePicId?: string | null;
};

// Defines the Settings component
const Settings: React.FC = () => {
  // Define state variables
  const [user, setUser] = useState<any>(null);
  const [docId, setDocId] = useState<string | null>(null);
  const [bio, setBio] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [currentPicId, setCurrentPicId] = useState<string | null>(null);
  const [localUri, setLocalUri] = useState<string | null>(null);
  const [remoteUrl, setRemoteUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const me = await account.get();
        if (cancelled) return;
        setUser(me);
        setDisplayName(me.name ?? "");
        const res = (await databases.listDocuments(
          DATABASE_ID,
          USER_PROFILE_COLLECTION_ID,
          [Query.equal("Userid", me.$id), Query.limit(1)]
        )) as unknown as { documents: ProfileDoc[] };
        let doc: ProfileDoc | null = res.documents?.[0] ?? null;
        if (!doc) {
          const created = await databases.createDocument(
            DATABASE_ID,
            USER_PROFILE_COLLECTION_ID,
            ID.unique(),
            { Userid: me.$id, bio: "", profilePicId: null },
            [
              Permission.read(Role.any()),
              Permission.update(Role.user(me.$id)),
              Permission.delete(Role.user(me.$id)),
              Permission.write(Role.user(me.$id)),
            ]
          );
          doc = created as unknown as ProfileDoc;
        }
        setDocId(doc.$id);
        setBio(doc.bio || "");
        setCurrentPicId(doc.profilePicId ?? null);
        if (doc.profilePicId) {
          setRemoteUrl(buildFileUrl(USER_PROFILE_BUCKET_ID, doc.profilePicId));
        }
      } catch (err: any) {
        console.error("[Settings] load profile failed:", err);
        Alert.alert("Error", err?.message || "Could not load profile");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Handle picking an image
  const handlePickImage = async () => {
    const uri = await pickImage({ aspect: [4, 4] });
    if (uri) {
      setLocalUri(uri);
    }
  };

  const handleSave = useCallback(async () => {
    try {
      const me = await account.get().catch(() => {
        throw new Error("You need to be signed in to update your profile.");
      });
      const { $id: userId, name: currentName } = me;
      if (!docId) throw new Error("Profile document not initialized yet.");
      setSaving(true);

      const trimmedName = displayName.trim();
      if (trimmedName && trimmedName !== currentName) {
        await account.updateName(trimmedName);
      }

      let newPicId: string | null = null;
      if (localUri) {
        const file = {
          uri: localUri,
          type: "image/jpeg",
          name: "profile.jpg",
          size: 0, 
        };
        const filePermissions = [
          Permission.read(Role.any()),
          Permission.update(Role.user(userId)),
          Permission.delete(Role.user(userId)),
          Permission.write(Role.user(userId)),
        ];
        const uploaded = await storage.createFile(
          USER_PROFILE_BUCKET_ID,
          ID.unique(),
          file,
          filePermissions
        );
        newPicId = uploaded.$id;
      }

      await databases.updateDocument(
        DATABASE_ID,
        USER_PROFILE_COLLECTION_ID,
        docId,
        {
          bio: bio.trim(),
          profilePicId: newPicId ?? currentPicId ?? null,
          Userid: userId,
        }
      );

      const refreshed = await account.get();
      setUser(refreshed);

      if (newPicId) {
        setCurrentPicId(newPicId);
        setRemoteUrl(buildFileUrl(USER_PROFILE_BUCKET_ID, newPicId));
        setLocalUri(null);
      }

      Alert.alert("Saved", "Your profile has been updated.");
    } catch (error: any) {
      console.error("[Settings] save failed:", error);
      Alert.alert("Error", error?.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  }, [bio, localUri, currentPicId, docId, displayName]);

  const handleSignOut = useCallback(async () => {
    try {
      await account.deleteSession("current");
    } catch {}
    router.replace("/");
  }, []);

  const previewSrc = useMemo(
    () => localUri ?? remoteUrl ?? null,
    [localUri, remoteUrl]
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <ThemedView
          style={[
            styles.container,
            { alignItems: "center", justifyContent: "center" },
          ]}
        >
          <ActivityIndicator />
        </ThemedView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ThemedView style={styles.container}>
          <ScrollView contentContainerStyle={{ paddingBottom: 28 }}>
            <View style={styles.topBar}>
              <Pressable
                style={styles.iconBtn}
                hitSlop={10}
                onPress={() =>
                  router.canGoBack?.() ? router.back() : router.replace("/")
                }
              >
                <Ionicons name="arrow-back" size={28} color="#EDEAF8" />
              </Pressable>

              <View style={styles.centerTitles}>
                <ThemedText style={styles.title}>Settings</ThemedText>
                <ThemedText style={styles.subtitle}>
                  {user?.name || "Your account"}
                </ThemedText>
              </View>

              <Pressable
                style={styles.iconBtn}
                hitSlop={10}
                onPress={handleSignOut}
              >
                <Feather name="log-out" size={22} color="#EDEAF8" />
              </Pressable>
            </View>

            <Pressable style={styles.uploadInner} onPress={handlePickImage}>
              {previewSrc ? (
                <>
                  <Image
                    source={{ uri: previewSrc }}
                    style={styles.previewImage}
                    resizeMode="cover"
                  />
                </>
              ) : (
                <>
                  <Image
                    source={require("../assets/icons/camera-icon.png")}
                    style={styles.uploadIcon}
                    resizeMode="contain"
                  />
                  <Text style={styles.uploadLabel}>Select Profile Photo</Text>
                </>
              )}
            </Pressable>

            <ThemedText style={styles.fieldLabel}>Display Name</ThemedText>
            <TextInput
              value={displayName}
              onChangeText={setDisplayName}
              placeholder="Your name"
              placeholderTextColor="#9B90B5"
              style={styles.inputDark}
            />

            <ThemedText style={styles.fieldLabel}>Bio</ThemedText>
            <TextInput
              value={bio}
              onChangeText={setBio}
              placeholder="Tell us something about yourself"
              placeholderTextColor="#9B90B5"
              style={[styles.inputDark, styles.textArea]}
              multiline
            />

            <Pressable onPress={handleSave} style={styles.pill} disabled={saving}>
              <LinearGradient
                colors={["#C08EFF", "#F0A7F5", "#FFCAA7"]}
                start={[0, 0]}
                end={[1, 1]}
                style={styles.pillGrad}
              >
                {saving ? (
                  <ActivityIndicator />
                ) : (
                  <Text style={styles.primaryText}>Save Profile</Text>
                )}
              </LinearGradient>
            </Pressable>
          </ScrollView>
        </ThemedView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Settings;

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
    paddingBottom: 20,
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
  signOutBtn: {
    position: "absolute",
    right: 6,
    top: 2,
    height: 40,
    width: 40,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  uploadInner: {
    borderRadius: 16,
    height: 200,
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
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 2,
    borderColor: ACCENT,
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
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  centerTitles: {
    flex: 1,
    alignItems: "center",
  },
  subtitle: {
    color: "#C8BEDF",
    marginTop: 4,
    fontSize: 13,
  },
  iconBtn: {
    height: 36,
    width: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
});