import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import {
  CHALLENGES_COLLECTION_ID,
  DATABASE_ID,
  PROMPTS_COLLECTION_ID,
} from "@/config/Config";
import { databases } from "@/lib/appwrite";
import React, { useEffect, useState } from "react";
import { Dimensions, FlatList, Image, StyleSheet, View } from "react-native";
import { Query } from "react-native-appwrite";

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
      } catch (error) {
        console.error("Error fetching challenges:", error);
      }
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

          if (fallbackRes.documents.length > 0) {
            setPrompt(fallbackRes.documents[0].text);
          } else {
            setPrompt("No prompt available yet.");
          }
        }
      } catch (error) {
        console.error("Error fetching prompt:", error);
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
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchChallenges();
    fetchPrompt();
    fetchPosts();
  }, []);

  return (
    <ThemedView style={styles.container}>
      <View style={styles.titleRow}>
        <Image source={require('../../assets/images/InkSpire_logo.png')} style={styles.logo} />
        <ThemedText style={styles.appTitle}>InkSpire</ThemedText>
      </View>

      <View style={styles.leftPanel}>
        <ThemedText style={styles.sectionTitle}>Today&#39;s Prompt</ThemedText>
        <View style={styles.promptBox}>
          <ThemedText style={styles.promptText}>
            {prompt ?? "Loading..."}
          </ThemedText>
          <ThemedText style={styles.promptSubText}>
            Click to see what others have made
          </ThemedText>
        </View>

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
          ListEmptyComponent={<ThemedText>Loading challenges...</ThemedText>}
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
          ListEmptyComponent={<ThemedText>No posts yet.</ThemedText>}
          style={{ maxHeight: 300 }}
          showsVerticalScrollIndicator={false}
        />
      </View>
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
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 40,
  },
  logo: {
    width: 90,
    height: 90,
    marginRight: 10,
    resizeMode: "contain",
    borderRadius: 45, 
  },
  appTitle: {
    color: "#111",
    fontSize: 36,
    fontWeight: "900",
  },
  leftPanel: {
    flex: 1,
  },
  sectionTitle: {
    color: "#222",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 15,
  },
  promptBox: {
    backgroundColor: "#f1f1f1",
    borderRadius: 30,  
    padding: 25,
    minHeight: 120,
    justifyContent: "center",
    marginBottom: 30,
    borderWidth: 1,
    borderColor: "#C08EFF",
  },
  promptText: {
    fontSize: 20,
    fontStyle: "italic",
    textAlign: "center",
    color: "#333",
  },
  promptSubText: {
    marginTop: 10,
    fontSize: 14,
    color: "#555",
    textAlign: "center",
  },
  challengeCard: {
    backgroundColor: "#B394D9",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 30, 
    marginRight: 12,
    minWidth: screenWidth * 0.22,
    justifyContent: "center",
    alignItems: "center",

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  challengeCardText: {
    fontWeight: "900",
    fontSize: 18,
    color: "#111",
  },
  postCard: {
    backgroundColor: "#f1f1f1",
    borderRadius: 30,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#C08EFF",

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 6,
  },
  postTitle: {
    fontWeight: "800",
    fontSize: 18,
    color: "#111",
    marginBottom: 8,
  },
  postContent: {
    fontSize: 16,
    color: "#333",
  },
});
