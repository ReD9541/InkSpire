import { ThemedText } from "@/components/ThemedText";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import React from "react";
import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

// Define constants for layout
const { height: screenHeight } = Dimensions.get("window");
const HERO_IMAGE_HEIGHT = screenHeight * 0.41;

export default function Landing() {
  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#111111" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollWrapper}>
        <SafeAreaView style={styles.innerContainer}>
          <Image
            source={require("../assets/images/splash-icon.png")}
            style={styles.logo}
          />

          <ThemedText style={styles.description}>
            A Community Built for Artists Like You.
          </ThemedText>

          <View style={styles.heroScrollWrapper}>
            <ScrollView
              horizontal
              scrollEnabled={true}
              nestedScrollEnabled={false}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.scrollContainer}
            >
              <Image
                source={require("../assets/images/hero-images/hero-image1.png")}
                style={styles.heroImage}
              />
              <Image
                source={require("../assets/images/hero-images/hero-image2.png")}
                style={styles.heroImage}
              />
              <Image
                source={require("../assets/images/hero-images/hero-image3.png")}
                style={styles.heroImage}
              />
              <Image
                source={require("../assets/images/hero-images/hero-image4.png")}
                style={styles.heroImage}
              />
            </ScrollView>
          </View>

          <Link href="/register" asChild>
            <TouchableOpacity style={styles.button}>
              <LinearGradient
                colors={["#C08EFF", "#F0A7F5", "#FFCAA7", "#D5E4B5"]}
                start={[0, 0]}
                end={[1, 1]}
                style={styles.gradient}
              >
                <ThemedText style={styles.buttonText}>Join Now</ThemedText>
              </LinearGradient>
            </TouchableOpacity>
          </Link>

          <View style={styles.signInContainer}>
            <ThemedText style={styles.signInText}>
              Already have an account?{" "}
            </ThemedText>
            <Link href="/login" asChild>
              <ThemedText style={styles.signInButton}>Log In</ThemedText>
            </Link>
          </View>
        </SafeAreaView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export const styles = StyleSheet.create({
  scrollWrapper: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  innerContainer: {
    flex: 1,
    alignItems: "center",
    padding: 20,
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 30,
  },
  description: {
    fontFamily: "Sen",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 40,
    paddingHorizontal: 40,
    color: "#C08EFF",
  },
  heroScrollWrapper: {
    height: HERO_IMAGE_HEIGHT,
    marginBottom: 30,
  },
  scrollContainer: {
    paddingHorizontal: 10,
  },
  heroImage: {
    width: 180,
    height: HERO_IMAGE_HEIGHT,
    resizeMode: "cover",
    borderRadius: 20,
    marginRight: 15,
    borderWidth: 0.3,
    borderColor: "#C08EFF",
  },
  button: {
    width: 261,
    height: 37,
    borderRadius: 32.5,
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  gradient: {
    width: "100%",
    height: "100%",
    borderRadius: 32.5,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#111111",
    fontSize: 18,
    fontWeight: "600",
    fontFamily: "Sen",
    textAlign: "center",
  },
  signInContainer: {
    flexDirection: "column",
    alignItems: "center",
  },
  signInText: {
    color: "#C08EFF",
    fontSize: 15,
  },
  signInButton: {
    color: "#C08EFF",
    fontSize: 15,
    fontFamily: "Sen",
    marginLeft: 5,
    textDecorationLine: "underline",
  },
});
