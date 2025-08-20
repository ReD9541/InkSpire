import { ThemedView } from "@/components/ThemedView";
import { ValidIndicator } from "@/components/ui/ValidIndicator";
import { AuthContext } from "@/contexts/AuthContext";
import { account } from "@/lib/appwrite";
import { isValidEmail, isValidPassword } from "@/utils/helper";
import { LinearGradient } from "expo-linear-gradient";
import { Link, router } from "expo-router";
import { useContext, useEffect, useState } from "react";
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
import { ID } from "react-native-appwrite";

export default function Register() {
  // Define state variables
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [retypePassword, setRetypePassword] = useState("");
  const [acceptedTnC, setAcceptedTnC] = useState(false);
  const [auth, setAuth] = useState(null);

  const user = useContext(AuthContext);

  // Validate email and password
  const validEmail = isValidEmail(email);
  const validPassword = isValidPassword(password);
  const passwordsMatch =
    password === retypePassword && retypePassword.length > 0;

  // Check if the form can be submitted
  const canSubmit =
    validEmail && validPassword && passwordsMatch && acceptedTnC;

  // Handle registration
  const register = async () => {
    if (!canSubmit) return;
    try {
      await account.create(ID.unique(), email, password, name);
      const session = await user.createEmailPasswordSession(email, password);
      setAuth(session);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Registration failed";
      Alert.alert("Error", message);
    }
  };

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
            <Text style={styles.label}>Email</Text>
            {email.length > 0 && <ValidIndicator valid={validEmail} />}
          </View>
          <TextInput
            style={styles.input}
            placeholder="Enter Email"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <LinearGradient
            colors={["#C08EFF", "#F0A7F5", "#FFCAA7", "#D5E4B5"]}
            start={[0, 0]}
            end={[1, 1]}
            style={styles.brandDivider}
          />
          <Text style={styles.label}>Username</Text>
          <TextInput
            style={styles.input}
            placeholder="Create Username"
            placeholderTextColor="#999"
            value={name}
            onChangeText={setName}
          />

          <View style={styles.labelRow}>
            <Text style={styles.label}>Password</Text>
            {password.length > 0 && <ValidIndicator valid={validPassword} />}
          </View>
          <TextInput
            style={styles.input}
            placeholder="Create Password"
            placeholderTextColor="#999"
            textContentType="none"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <View style={styles.labelRow}>
            <Text style={styles.label}>Confirm Password</Text>
            {retypePassword.length > 0 && (
              <ValidIndicator valid={passwordsMatch} />
            )}
          </View>
          <TextInput
            style={styles.input}
            placeholder="Retype Password"
            placeholderTextColor="#999"
            textContentType="none"
            secureTextEntry
            value={retypePassword}
            onChangeText={setRetypePassword}
          />

          <Pressable
            style={styles.checkboxRow}
            onPress={() => setAcceptedTnC(!acceptedTnC)}
          >
            <View
              style={[
                styles.checkboxCircle,
                acceptedTnC && styles.checkboxCircleChecked,
              ]}
            >
              {acceptedTnC && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.checkboxLabel}>
              I have read and agree to the T&Cs
            </Text>
          </Pressable>

          <View style={styles.authActions}>
            <View style={styles.buttonLabelWrapper}>
              <Text style={styles.notRegisteredText}>
                Already have an account?
              </Text>
            </View>

            <View style={styles.buttonRow}>
              <Link href="/login" asChild>
                <Pressable style={styles.button}>
                  <LinearGradient
                    colors={["#C08EFF", "#F0A7F5", "#FFCAA7"]}
                    start={[0, 0]}
                    end={[1, 1]}
                    style={styles.gradient}
                  >
                    <Text style={styles.buttonText}>Sign In</Text>
                  </LinearGradient>
                </Pressable>
              </Link>

              <Pressable
                onPress={register}
                disabled={!canSubmit}
                style={styles.button}
              >
                <LinearGradient
                  colors={
                    !canSubmit ? ["#333", "#444"] : ["#F0A7F5", "#D5E4B5"]
                  }
                  start={[0, 0]}
                  end={[1, 1]}
                  style={styles.gradient}
                >
                  <Text style={styles.buttonText}>Create Account</Text>
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
    textTransform: "lowercase",
  },
  titleLineTwo: {
    fontSize: 40,
    fontWeight: "400",
    color: "#FFE6EC",
    fontFamily: "Asar",
    lineHeight: 40,
    textTransform: "lowercase",
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
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  checkboxCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#C08EFF",
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxCircleChecked: {
    backgroundColor: "#C08EFF",
  },
  checkmark: {
    color: "#111",
    fontSize: 16,
  },
  checkboxLabel: {
    fontSize: 15,
    color: "#fff",
  },
  authActions: {
    marginTop: 30,
    alignItems: "center",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    width: "100%",
  },

  buttonLabelWrapper: {
    alignSelf: "flex-start",
    marginBottom: 10,
  },

  notRegisteredText: {
    fontSize: 14,
    color: "#C08EFF",
  },
  button: {
    flex: 1,
    height: 50,
    marginHorizontal: 5,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },

  gradient: {
    width: "100%",
    height: "100%",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    color: "#111",
    fontWeight: "600",
    fontSize: 15,
  },
  brandDivider: {
    height: 3,
    borderRadius: 3,
    marginBottom: 18,
  },
});
