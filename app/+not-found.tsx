import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { LinearGradient } from "expo-linear-gradient";
import { Link, Stack } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <ThemedView style={styles.container}>
        <View style={styles.textBlock}>
          <ThemedText style={styles.title}>Page Not Found</ThemedText>
          <ThemedText style={styles.description}>
            The screen you’re looking for doesn’t exist or has been moved.
          </ThemedText>
        </View>

        <Link href="/" asChild>
          <Pressable style={styles.button}>
            <LinearGradient
              colors={["#C08EFF", "#F0A7F5", "#FFCAA7"]}
              start={[0, 0]}
              end={[1, 1]}
              style={styles.gradient}
            >
              <ThemedText style={styles.buttonText}>Go Home</ThemedText>
            </LinearGradient>
          </Pressable>
        </Link>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111111",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  textBlock: {
    alignItems: "center",
    marginBottom: 28,
    paddingHorizontal: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: "600",
    color: "#FFE6EC",
    textAlign: "center",
    marginBottom: 10,
    lineHeight: 40,
    paddingBottom: 2,
  },
  description: {
    fontSize: 16,
    color: "#C08EFF",
    textAlign: "center",
    lineHeight: 22,
  },
  button: {
    borderRadius: 30,
    overflow: "hidden",
    minWidth: 190,
    alignSelf: "center",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  gradient: {
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 30,
    alignItems: "center",
  },
  buttonText: {
    color: "#111",
    fontWeight: "600",
    fontSize: 16,
  },
});
