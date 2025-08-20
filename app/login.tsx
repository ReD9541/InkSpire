import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { ValidIndicator } from "@/components/ui/ValidIndicator";
import { AuthContext } from "@/contexts/AuthContext";
import { account } from "@/lib/appwrite";
import { isValidEmail, isValidPassword } from "@/utils/helper";
import { LinearGradient } from "expo-linear-gradient";
import { Link, router } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import {
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
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Login() {
  // Define state variables
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [auth, setAuth] = useState<any>(null);
  const [rememberMe, setRememberMe] = useState(false);

  const user = useContext(AuthContext);

  // validate email and password
  const validEmail = isValidEmail(email);
  const validPassword = isValidPassword(password);

  // Handle login
  const login = async () => {
    try {
      await account.createEmailPasswordSession(email, password);

      // Persist Remember Me choice
      await AsyncStorage.setItem("rememberMe", rememberMe ? "true" : "false");

      // Update auth/user context
      setAuth(await user.get());
    } catch (error: any) {
      Alert.alert("Error", error?.message || "Login failed");
    }
  };

  // Navigate to tabs after successful auth
  useEffect(() => {
    if (auth) {
      router.navigate("/(tabs)");
    }
  }, [auth]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#111111" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <ThemedView style={styles.container}>
          <View style={styles.header}>
            <View style={styles.titleWrapper}>
              <Text style={styles.titleLineOne}>sign in to</Text>
              <Text style={styles.titleLineTwo}>inkspire</Text>
            </View>
            <Image
              source={require("../assets/images/InkSpire_logo.png")}
              style={styles.logo}
            />
          </View>

          <View style={styles.labelRow}>
            <ThemedText style={styles.label}>Email</ThemedText>
            {email.length > 0 && <ValidIndicator valid={validEmail} />}
          </View>
          <TextInput
            style={styles.input}
            placeholder="you@example.com"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <View style={styles.labelRow}>
            <ThemedText style={styles.label}>Password</ThemedText>
            {password.length > 0 && <ValidIndicator valid={validPassword} />}
          </View>
          <TextInput
            style={styles.input}
            placeholder="minimum 8 characters"
            placeholderTextColor="#999"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <Pressable
            style={styles.rememberRow}
            onPress={() => setRememberMe(!rememberMe)}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: rememberMe }}
          >
            <View
              style={[styles.checkbox, rememberMe && styles.checkedCheckbox]}
            >
              {rememberMe && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.rememberText}>Remember Me</Text>
          </Pressable>

          <View style={{ flex: 1 }} />
          <View style={styles.authActions}>
            <View style={styles.buttonLabelWrapper}>
              <Text style={styles.notRegisteredText}>Not registered yet?</Text>
            </View>

            <View style={styles.buttonRow}>
              <Link href="/register" asChild>
                <Pressable style={styles.button}>
                  <LinearGradient
                    colors={["#C08EFF", "#F0A7F5", "#FFCAA7"]}
                    start={[0, 0]}
                    end={[1, 1]}
                    style={styles.gradient}
                  >
                    <Text style={styles.buttonText}>Create Account</Text>
                  </LinearGradient>
                </Pressable>
              </Link>

              <Pressable
                onPress={login}
                disabled={!validEmail || !validPassword}
                style={styles.button}
              >
                <LinearGradient
                  colors={
                    !validEmail || !validPassword
                      ? ["#333", "#444"]
                      : ["#F0A7F5", "#D5E4B5"]
                  }
                  start={[0, 0]}
                  end={[1, 1]}
                  style={styles.gradient}
                >
                  <Text style={styles.buttonText}>Sign In</Text>
                </LinearGradient>
              </Pressable>
            </View>
          </View>
        </ThemedView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#111111",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },

  titleWrapper: {
    flex: 1,
    paddingRight: 20,
  },

  titleLineOne: {
    fontSize: 38,
    fontWeight: "400",
    color: "#FFE6EC",
    fontFamily: "Asar",
    lineHeight: 34,
  },

  titleLineTwo: {
    fontSize: 40,
    fontWeight: "400",
    color: "#FFE6EC",
    fontFamily: "Asar",
    lineHeight: 40,
  },

  logo: {
    width: 175,
    height: 200,
    resizeMode: "contain",
  },

  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#C08EFF",
  },
  input: {
    backgroundColor: "#222",
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 18,
    marginBottom: 20,
    fontSize: 16,
    color: "#fff",
    borderWidth: 1,
    borderColor: "#C08EFF",
  },
  rememberRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 1,
    borderColor: "#C08EFF",
    marginRight: 10,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  checkedCheckbox: {
    backgroundColor: "#C08EFF",
  },
  checkmark: {
    color: "#111",
    fontSize: 16,
  },
  rememberText: {
    fontSize: 15,
    color: "#fff",
  },
  authActions: {
    width: "100%",
    marginTop: 30,
  },

  notRegisteredText: {
    fontSize: 14,
    color: "#C08EFF",
    textAlign: "left",
  },

  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginTop: 30,
  },

  buttonLabelWrapper: {
    marginBottom: 10,
    alignSelf: "flex-start",
  },

  button: {
    flex: 1,
    height: 50,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    marginHorizontal: 5,
  },

  gradient: {
    height: "100%",
    width: "100%",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    color: "#111",
    fontWeight: "600",
    fontSize: 15,
  },
});
