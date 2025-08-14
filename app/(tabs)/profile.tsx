import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import {
  DATABASE_ID,
  EXPO_PUBLIC_APPWRITE_ENDPOINT,
  EXPO_PUBLIC_APPWRITE_PROJECT_ID,
  USER_POST_BUCKET_ID,
  USER_POST_COLLECTION_ID,
  USER_PROFILE_BUCKET_ID,
  USER_PROFILE_COLLECTION_ID,
} from "@/config/Config";
import { account, databases } from "@/lib/appwrite";
import { LinearGradient } from "expo-linear-gradient";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { Query } from "react-native-appwrite";
import { SafeAreaView } from "react-native-safe-area-context";

const ACCENT = "#C08EFF";
const SCREEN_W = Dimensions.get("window").width;
const H_PADDING = 20;
const GAP = 6;
const COLS = 3;
const TILE = Math.floor((SCREEN_W - H_PADDING * 2 - GAP * (COLS - 1)) / COLS);

const buildFileUrl = (bucketId: string, fileId: string) =>
  `${EXPO_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${encodeURIComponent(
    bucketId
  )}/files/${encodeURIComponent(fileId)}/view?project=${encodeURIComponent(
    EXPO_PUBLIC_APPWRITE_PROJECT_ID
  )}`;

const idInList = (list: string, id: string) => {
  const parts = list.split(/[\s,;|]+/).filter(Boolean);
  return parts.some((p) => p === id);
};

export default function Profile() {
  const [user, setUser] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [favourites, setFavourites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [bio, setBio] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<"posts" | "favourites">("posts");

  const load = useCallback(async () => {
    try {
      const me = await account.get();
      setUser(me);

      try {
        const prof = await databases.listDocuments(
          DATABASE_ID,
          USER_PROFILE_COLLECTION_ID,
          [Query.equal("Userid", me.$id), Query.limit(1)]
        );
        const pdoc: any = prof.documents?.[0];
        if (pdoc) {
          if (pdoc.profilePicId) {
            setAvatarUri(
              buildFileUrl(USER_PROFILE_BUCKET_ID, pdoc.profilePicId)
            );
          } else {
            setAvatarUri(null);
          }
          if (typeof pdoc.bio === "string") setBio(pdoc.bio);
          else setBio(null);
        } else {
          setAvatarUri(null);
          setBio(null);
        }
      } catch {}

      const myRes = await databases.listDocuments(
        DATABASE_ID,
        USER_POST_COLLECTION_ID,
        [
          Query.equal("userID", me.$id),
          Query.orderDesc("$createdAt"),
          Query.limit(100),
        ]
      );
      const myPosts = myRes.documents.map((doc: any) =>
        doc.imageUrl
          ? doc
          : doc.imageId
          ? { ...doc, imageUrl: buildFileUrl(USER_POST_BUCKET_ID, doc.imageId) }
          : doc
      );
      setPosts(myPosts);

      try {
        const favRes = await databases.listDocuments(
          DATABASE_ID,
          USER_POST_COLLECTION_ID,
          [
            Query.search("favouritedBy", me.$id),
            Query.orderDesc("$createdAt"),
            Query.limit(100),
          ]
        );

        const favExact = favRes.documents.filter(
          (d: any) =>
            typeof d.favouritedBy === "string" &&
            idInList(d.favouritedBy, me.$id)
        );

        const favWithUrls = favExact.map((doc: any) =>
          doc.imageUrl
            ? doc
            : doc.imageId
            ? {
                ...doc,
                imageUrl: buildFileUrl(USER_POST_BUCKET_ID, doc.imageId),
              }
            : doc
        );

        setFavourites(favWithUrls);
      } catch {
        setFavourites([]);
      }
    } catch (err) {
      console.error("[Profile] Failed:", err);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      await load();
      if (!cancelled) setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [load]);

  useFocusEffect(
    useCallback(() => {
      let alive = true;
      (async () => {
        setRefreshing(true);
        await load();
        if (alive) setRefreshing(false);
      })();
      return () => {
        alive = false;
      };
    }, [load])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  const activeDocs = useMemo(
    () => (activeTab === "posts" ? posts : favourites),
    [posts, favourites, activeTab]
  );

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ThemedView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.profileTopRow}>
            <View style={styles.avatarWrap}>
              {avatarUri ? (
                <Image source={{ uri: avatarUri }} style={styles.avatarImg} />
              ) : (
                <View style={styles.avatar} />
              )}
            </View>

            <Pressable
              style={styles.settingsBtn}
              hitSlop={10}
              onPress={() => router.push("/settings")}
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

          {bio ? (
            <ThemedText style={styles.bio} numberOfLines={3}>
              {bio}
            </ThemedText>
          ) : null}

          <View style={styles.toggleWrap}>
            <Pressable
              style={[
                styles.toggleBtn,
                activeTab === "posts" && styles.toggleActive,
              ]}
              onPress={() => setActiveTab("posts")}
            >
              <ThemedText
                style={[
                  styles.toggleText,
                  activeTab === "posts" && styles.toggleTextActive,
                ]}
              >
                Posts
              </ThemedText>
            </Pressable>
            <Pressable
              style={[
                styles.toggleBtn,
                activeTab === "favourites" && styles.toggleActive,
              ]}
              onPress={() => setActiveTab("favourites")}
            >
              <ThemedText
                style={[
                  styles.toggleText,
                  activeTab === "favourites" && styles.toggleTextActive,
                ]}
              >
                Favourites
              </ThemedText>
            </Pressable>
          </View>

          <LinearGradient
            colors={["#C08EFF", "#F0A7F5", "#FFCAA7", "#D5E4B5"]}
            start={[0, 0]}
            end={[1, 1]}
            style={styles.brandDivider}
          />
        </View>

        {loading ? (
          <View style={styles.loaderWrap}>
            <ActivityIndicator size="large" color={ACCENT} />
          </View>
        ) : (
          <FlatList
            data={activeDocs}
            keyExtractor={(item) => item.$id}
            numColumns={COLS}
            columnWrapperStyle={{ gap: GAP }}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 16 }}
            renderItem={({ item }) => (
              <Pressable
                onPress={() =>
                  router.push({
                    pathname: "/post",
                    params: { id: item.$id },
                  })
                }
                style={[styles.tile, !item.imageUrl && styles.tileFallback]}
              >
                {item.imageUrl ? (
                  <Image
                    source={{ uri: item.imageUrl }}
                    style={styles.tileImg}
                  />
                ) : (
                  <ThemedText style={styles.tileEmptyText}>
                    {activeTab === "posts" ? "No Image" : "No Favourite Image"}
                  </ThemedText>
                )}
              </Pressable>
            )}
            ListEmptyComponent={
              <View style={{ paddingTop: 40, alignItems: "center" }}>
                <ThemedText style={{ color: ACCENT }}>
                  {activeTab === "posts"
                    ? "No posts yet."
                    : "No favourites yet."}
                </ThemedText>
              </View>
            }
            refreshing={refreshing}
            onRefresh={onRefresh}
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
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 20,
  },

  header: {
    marginBottom: 12,
  },
  profileTopRow: {
    flexDirection: "row",
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
    borderWidth: 2,
    borderColor: ACCENT,
    overflow: "hidden",
  },
  avatar: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: "#4DA3FF",
  },
  avatarImg: {
    width: 92,
    height: 92,
    borderRadius: 46,
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
  settingsIcon: {
    width: 34,
    height: 34,
    tintColor: "#EDEAF8",
  },

  username: {
    marginTop: 10,
    textAlign: "center",
    color: "#FFE6EC",
    fontSize: 26,
    fontWeight: "800",
    lineHeight: 30,
  },
  bio: {
    marginTop: 6,
    textAlign: "center",
    color: "#C8BEDF",
    fontSize: 14,
    lineHeight: 18,
    paddingHorizontal: 8,
  },

  toggleWrap: {
    flexDirection: "row",
    backgroundColor: "#1A1A1A",
    borderRadius: 999,
    padding: 4,
    marginTop: 10,
    alignSelf: "center",
    gap: 6,
  },
  toggleBtn: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 999,
  },
  toggleActive: {
    backgroundColor: ACCENT,
  },
  toggleText: {
    color: "#C8BEDF",
    fontSize: 14,
    fontWeight: "700",
  },
  toggleTextActive: {
    color: "#111111",
  },

  brandDivider: {
    height: 3,
    borderRadius: 3,
    marginTop: 10,
  },

  tile: {
    width: TILE,
    height: TILE,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#1A1A1A",
    marginBottom: GAP,
    borderWidth: 1,
    borderColor: "#2B2B2B",
  },
  tileImg: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  tileFallback: {
    alignItems: "center",
    justifyContent: "center",
    borderColor: ACCENT,
  },
  tileEmptyText: {
    color: ACCENT,
    fontSize: 12,
  },

  loaderWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
