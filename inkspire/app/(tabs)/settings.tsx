import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { StyleSheet, Image } from "react-native";

export default function settings() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>Create a Post</ThemedText>
      <Image
        source={require('../assets/images/InkSpire_logo.png')} 
        style={styles.logo}
      />
      {/* Additional form elements would go here */}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#333",
    flexShrink: 1,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 30,
    borderRadius: 75,
  },
});