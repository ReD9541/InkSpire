import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { account, databases } from "@/lib/appwrite";
import { router } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  View,
} from "react-native";
import { Query } from "react-native-appwrite";

const ACCENT = "#C08EFF";
const SCREEN_W = Dimensions.get("window").width;
const H_PADDING = 20;
const GAP = 6;
const COLS = 3;
const TILE = Math.floor((SCREEN_W - H_PADDING * 2 - GAP * (COLS - 1)) / COLS);

export default function Profile() {
  const [user, setUser] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const me = await account.get();
        setUser(me);
        try {
          const res = await databases.listDocuments(
            process.env.EXPO_PUBLIC_DATABASE_ID as string,
            "USER_POSTS_COLLECTION_ID",
            [Query.equal("userId", me.$id)]
          );
          setPosts(res.documents);
        } catch {
          setPosts([]);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const gridData = useMemo(
    () =>
      posts.map((p) => ({
        id: p.$id,
        uri: p.imageUrl || null,
      })),
    [posts]
  );

  return (
    <SafeAreaView style={styles.safe}>
      <ThemedView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.profileTopRow}>
            <View style={styles.avatarWrap}>
              <View style={styles.avatar} />
            </View>

            <Pressable
              style={styles.settingsBtn}
              hitSlop={10}
              onPress={() => {
                router.push("/settings");
              }}
            >
              <Image
                source={require("../../assets/icons/settings-icon.png")}
                style={styles.settingsIcon}
                resizeMode="contain"
              />
            </Pressable>
          </View>

          <ThemedText
            style={styles.username}
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            {user?.name || "username"}
          </ThemedText>
        </View>

        {loading ? (
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <ActivityIndicator size="large" color={ACCENT} />
          </View>
        ) : (
          <FlatList
            data={gridData}
            keyExtractor={(item) => item.id}
            numColumns={COLS}
            columnWrapperStyle={{ gap: GAP }}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 16 }}
            renderItem={({ item }) => (
              <View style={[styles.tile, !item.uri && styles.tileFallback]}>
                {item.uri ? (
                  <Image source={{ uri: item.uri }} style={styles.tileImg} />
                ) : (
                  <ThemedText style={styles.tileEmptyText}>No Image</ThemedText>
                )}
              </View>
            )}
            ListEmptyComponent={
              <View style={{ paddingTop: 40, alignItems: "center" }}>
                <ThemedText style={{ color: "#C08EFF" }}>
                  No posts yet.
                </ThemedText>
              </View>
            }
          />
        )}
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
    paddingHorizontal: H_PADDING,
    paddingTop: 30,
  },

  header: {
    marginBottom: 20,
  },
  profileTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  settingsBtn: {
    position: "absolute",
    right: 0,
    top: 6,
    height: 36,
    width: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },

  avatarWrap: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  avatar: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: "#4DA3FF",
    borderWidth: 2,
    borderColor: ACCENT,
  },

  username: {
    marginTop: 10,
    textAlign: "center",
    color: "#FFE6EC",
    fontSize: 26,
    fontWeight: "800",
    lineHeight: 30,
  },
  tile: {
    width: TILE,
    height: TILE,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#1A1A1A",
    marginBottom: GAP,
  },
  tileImg: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  tileFallback: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#2B2B2B",
  },
  tileEmptyText: {
    color: "#C08EFF",
    fontSize: 12,
  },
  settingsIcon: {
    width: 34,
    height: 34,
    tintColor: "#EDEAF8",
  },
});
