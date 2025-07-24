import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Image,
} from "react-native";
import { useState, useEffect, useContext } from "react";
import { ValidIndicator } from "@/components/ui/ValidIndicator";
import { router, Link } from "expo-router";
import { AuthContext } from "@/contexts/AuthContext";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import React from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validEmail, setValidEmail] = useState(false);
  const [validPassword, setValidPassword] = useState(false);
  const [auth, setAuth] = useState(null);
  const [rememberMe, setRememberMe] = useState(false);

  const user = useContext(AuthContext);

  const login = async () => {
    try {
      const session = await user.get();
      setAuth(session);
    } catch (error: any) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (auth) {
      router.navigate("/(tabs)");
    }
  }, [auth]);

  useEffect(() => {
    setValidEmail(email.includes("@"));
  }, [email]);

  useEffect(() => {
    setValidPassword(password.length >= 8);
  }, [password]);

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>
          Login to an InkSpire Account
        </ThemedText>
        <Image
          source={require("../assets/images/InkSpire_logo.png")}
          style={styles.logo}
        />
      </View>
      <View style={styles.labelRow}>
        <ThemedText style={styles.label}>Email</ThemedText>
        <ValidIndicator valid={validEmail} />
      </View>
      <TextInput
        style={styles.input}
        placeholder="you@example.com"
        value={email}
        onChangeText={setEmail}
      />

      <View style={styles.labelRow}>
        <ThemedText style={styles.label}>Password</ThemedText>
        <ValidIndicator valid={validPassword} />
      </View>
      <TextInput
        style={styles.input}
        placeholder="minimum 8 characters"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Pressable
        style={styles.rememberRow}
        onPress={() => setRememberMe(!rememberMe)}
      >
        <View style={[styles.checkbox, rememberMe && styles.checkedCheckbox]}>
          {rememberMe && <Text style={styles.checkmark}>✓</Text>}
        </View>
        <Text style={styles.rememberText}>Remember Me</Text>
      </Pressable>

      <View style={styles.buttonRow}>
        <Link href="/register" asChild>
          <Pressable style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Create Account</Text>
          </Pressable>
        </Link>

        <Pressable
          onPress={login}
          disabled={!validEmail || !validPassword}
          style={
            !validEmail || !validPassword
              ? styles.disabledButton
              : styles.primaryButton
          }
        >
          <Text
            style={
              !validEmail || !validPassword
                ? styles.disabledButtonText
                : styles.primaryButtonText
            }
          >
            Sign In
          </Text>
        </Pressable>
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 40,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#111",
    flex: 1,
    marginRight: 10,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 30,
    borderRadius: 75,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 5,
    color: "#222",
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },

  input: {
    backgroundColor: "#f1f1f1",
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  rememberRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    paddingVertical: 8,
    paddingHorizontal: 4,
  },

  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 1,
    borderColor: "#333",
    marginRight: 10,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },

  checkedCheckbox: {
    backgroundColor: "#2e86de",
  },

  checkmark: {
    color: "#fff",
    fontSize: 16,
  },

  rememberText: {
    fontSize: 16,
  },

  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  primaryButton: {
    flex: 1,
    backgroundColor: "#111",
    paddingVertical: 12,
    borderRadius: 30,
    alignItems: "center",
    marginLeft: 10,
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },
  secondaryButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#111",
    paddingVertical: 12,
    borderRadius: 30,
    alignItems: "center",
    marginRight: 10,
  },
  secondaryButtonText: {
    color: "#111",
    fontWeight: "500",
    fontSize: 15,
  },
  disabledButton: {
    flex: 1,
    backgroundColor: "#aaa",
    paddingVertical: 12,
    borderRadius: 30,
    alignItems: "center",
    marginLeft: 10,
  },
  disabledButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },
});
