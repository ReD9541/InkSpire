import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import {
  CHALLENGES_COLLECTION_ID,
  DATABASE_ID,
  PROMPTS_COLLECTION_ID,
} from "@/config/Config";
import { databases } from "@/lib/appwrite";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import { Dimensions, FlatList, Image, StyleSheet, View } from "react-native";
import { Query } from "react-native-appwrite";
import { SafeAreaView } from "react-native-safe-area-context";

const screenWidth = Dimensions.get("window").width;

export default function HomeScreen() {
  const [challenges, setChallenges] = useState<string[]>([]);
  const [prompt, setPrompt] = useState<string | null>(null);
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const res = await databases.listDocuments(
          DATABASE_ID,
          CHALLENGES_COLLECTION_ID
        );
        const names = res.documents.map((doc: any) => doc.name);
        setChallenges(names);
      } catch {}
    };

    const fetchPrompt = async () => {
      const now = new Date();
      const startOfToday = new Date(
        Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
      );
      const nowISO = now.toISOString();

      try {
        const res = await databases.listDocuments(
          DATABASE_ID,
          PROMPTS_COLLECTION_ID,
          [
            Query.lessThanEqual("date", nowISO),
            Query.greaterThanEqual("date", startOfToday.toISOString()),
            Query.orderDesc("date"),
            Query.limit(1),
          ]
        );

        if (res.documents.length > 0) {
          setPrompt(res.documents[0].text);
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
          setPrompt(
            fallbackRes.documents.length > 0
              ? fallbackRes.documents[0].text
              : "No prompt available yet."
          );
        }
      } catch {
        setPrompt("Error loading prompt.");
      }
    };

    const fetchPosts = async () => {
      try {
        const res = await databases.listDocuments(
          DATABASE_ID,
          "USER_POSTS_COLLECTION_ID"
        );
        setPosts(res.documents);
      } catch {}
    };

    fetchChallenges();
    fetchPrompt();
    fetchPosts();
  }, []);

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ThemedView style={styles.container}>
        <View style={styles.titleRow}>
          <Image
            source={require("../../assets/images/InkSpire_logo.png")}
            style={styles.logo}
          />
          <ThemedText
            style={styles.appTitle}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.9}
          >
            InkSpire
          </ThemedText>
        </View>

        <LinearGradient
          colors={["#C08EFF", "#F0A7F5", "#FFCAA7", "#D5E4B5"]}
          start={[0, 0]}
          end={[1, 1]}
          style={styles.brandDivider}
        />

        <View style={styles.leftPanel}>
          <ThemedText style={styles.sectionTitle}>Today&apos;s Prompt</ThemedText>

          <LinearGradient
            colors={["#C08EFF", "#F0A7F5", "#FFCAA7", "#D5E4B5"]}
            start={[0, 0]}
            end={[1, 1]}
            style={styles.promptWrapper}
          >
            <View style={styles.promptBox}>
              <ThemedText style={styles.promptText}>
                {prompt ?? "Loading..."}
              </ThemedText>
              <ThemedText style={styles.promptSubText}>
                Click to see what others have made
              </ThemedText>
            </View>
          </LinearGradient>

          <ThemedText style={[styles.sectionTitle, { marginTop: 25 }]}>
            Monthly Challenges
          </ThemedText>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={challenges}
            keyExtractor={(item, index) => `${item}-${index}`}
            renderItem={({ item }) => (
              <View style={styles.challengeCard}>
                <ThemedText style={styles.challengeCardText}>{item}</ThemedText>
              </View>
            )}
            ListEmptyComponent={
              <ThemedText style={styles.loadingText}>
                Loading challenges...
              </ThemedText>
            }
          />

          <ThemedText style={[styles.sectionTitle, { marginTop: 40 }]}>
            User Posts
          </ThemedText>
          <FlatList
            data={posts}
            keyExtractor={(item) => item.$id}
            renderItem={({ item }) => (
              <View style={styles.postCard}>
                <ThemedText style={styles.postTitle}>
                  {item.title ?? "Untitled Post"}
                </ThemedText>
                <ThemedText style={styles.postContent}>
                  {item.content ?? ""}
                </ThemedText>
              </View>
            )}
            ListEmptyComponent={
              <ThemedText style={styles.loadingText}>No posts yet.</ThemedText>
            }
            style={{ maxHeight: 300 }}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </ThemedView>
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
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  logo: {
    width: 120,
    height: 120,
    marginRight: 10,
    resizeMode: "contain",
    borderRadius: 45,
  },
  appTitle: {
    color: "#FFE6EC",
    fontSize: 34,
    fontWeight: "800",
    letterSpacing: 0.5,
    lineHeight: 40,
    paddingTop: 2,
  },
  brandDivider: {
    height: 3,
    borderRadius: 3,
    marginBottom: 18,
  },
  leftPanel: {
    flex: 1,
  },
  sectionTitle: {
    color: "#FFE6EC",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
    lineHeight: 24,
    textAlign : "center",
  },
  promptWrapper: {
    borderRadius: 26,
    padding: 2,
    marginBottom: 24,
  },
  promptBox: {
    backgroundColor: "#181818",
    borderRadius: 24,
    paddingVertical: 22,
    paddingHorizontal: 18,
    minHeight: 120,
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  promptText: {
    fontSize: 20,
    fontStyle: "italic",
    textAlign: "center",
    color: "#EDEAF8",
  },
  promptSubText: {
    marginTop: 10,
    fontSize: 14,
    color: "#C08EFF",
    textAlign: "center",
  },
  challengeCard: {
    backgroundColor: "#181818",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 28,
    marginRight: 12,
    minWidth: screenWidth * 0.22,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#C08EFF",
  },
  challengeCardText: {
    fontWeight: "800",
    fontSize: 16,
    color: "#FFE6EC",
  },
  postCard: {
    backgroundColor: "#181818",
    borderRadius: 20,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#2B2B2B",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 5,
  },
  postTitle: {
    fontWeight: "800",
    fontSize: 18,
    color: "#FFE6EC",
    marginBottom: 6,
  },
  postContent: {
    fontSize: 15,
    color: "#D2CFE6",
  },
  loadingText: {
    color: "#C08EFF",
  },
});
