import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Image,
} from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import { router, Link } from "expo-router";
import { ValidIndicator } from "@/components/ui/ValidIndicator";
import { ID } from "react-native-appwrite";
import React from "react";
import { account } from "@/lib/appwrite";

export default function register(props: any) {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [retypePassword, setRetypePassword] = useState<string>("");
  // email and password validity
  const [validEmail, setValidEmail] = useState<boolean>(false);
  const [validPassword, setValidPassword] = useState<boolean>(false);
  const [auth, setAuth] = useState<null | any>(null);

  const [passwordsMatch, setPasswordsMatch] = useState<boolean>(false);
  const [name, setName] = useState<string>("");

  const user = useContext(AuthContext);
  const [acceptedTnC, setAcceptedTnC] = useState(false);
  const canSubmit =
    validEmail && validPassword && passwordsMatch && acceptedTnC;
  const register = async () => {
    try {
    // sign up with unique id, email, password, and name metadata
  await account.create(ID.unique(), email, password, name);

    // create a session after registration
    const session = await user.createEmailPasswordSession(email, password);
    setAuth(session);
  } catch (error) {
    console.error('Registration failed:', error);
    };
  }
  
    useEffect(() => {
      if (auth) {
        router.navigate("/(tabs)");
      }
    }, [auth]);

  //const user = useUser()
  //console.log(user)
  useEffect(() => {
    if (email.indexOf("@") > 0) {
      // console.log('valid email')
      setValidEmail(true);
    } else {
      // console.log('invalid email')
      setValidEmail(false);
    }
  }, [email]);

  useEffect(() => {
    if (password.length >= 8) {
      setValidPassword(true);
    } else {
      setValidPassword(false);
    }
  }, [password]);

  useEffect(() => {
    setPasswordsMatch(retypePassword === password && retypePassword.length > 0);
  }, [retypePassword, password]);

  useEffect(() => {
    console.log(user);
  }, [user]);

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>Create InkSpire Account</ThemedText>
        <Image
          source={require("../assets/images/InkSpire_logo.png")}
          style={styles.logo}
        />
      </View>

      <View style={styles.form}>
        <ThemedText style={styles.labelText}>Link Email</ThemedText>
        <TextInput
          style={styles.input}
          placeholder="Enter Email"
          value={email}
          onChangeText={(val) => setEmail(val)}
        />

        <ThemedText style={styles.labelText}>Username</ThemedText>
        <TextInput
          style={styles.input}
          placeholder="Creaete Username"
          value={name}
          onChangeText={setName}
        />

        <ThemedText style={styles.labelText}>Password</ThemedText>
        <TextInput
          style={styles.input}
          placeholder="Create Password"
          secureTextEntry={true}
          value={password}
          onChangeText={(val) => setPassword(val)}
        />

        <View style={styles.labelRow}>
          <ThemedText style={styles.labelText}>Confirm Password</ThemedText>
          <ValidIndicator valid={passwordsMatch} />
        </View>
        <TextInput
          style={styles.input}
          placeholder="Retype Password"
          secureTextEntry={true}
          value={retypePassword}
          onChangeText={(val) => setRetypePassword(val)}
        />

        <View style={styles.checkboxRow}>
          <Pressable
            style={[
              styles.checkboxCircle,
              acceptedTnC && styles.checkboxCircleChecked,
            ]}
            onPress={() => setAcceptedTnC(!acceptedTnC)}
          />
          <Text style={styles.checkboxLabel}>
            I have read and agree to the T&Cs
          </Text>
        </View>

        <View style={styles.buttonRow}>
          <Link href="/login" asChild>
            <Pressable style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>Sign In</Text>
            </Pressable>
          </Link>

          <Pressable
            style={canSubmit ? styles.primaryButton : styles.disabledButton}
            disabled={!canSubmit}
            onPress={register}
          >
            <ThemedText
              style={
                canSubmit ? styles.primaryButtonText : styles.disabledButtonText
              }
            >
              Create Account
            </ThemedText>
          </Pressable>
        </View>
      </View>
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 30,
    borderRadius: 75,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#333",
    flexShrink: 1,
  },
  form: {
    width: "100%",
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  checkboxCircleChecked: {
    backgroundColor: "#111",
    borderColor: "#111",
  },
  labelText: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 5,
    color: "#111",
  },
  input: {
    backgroundColor: "#f4f4f4",
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
  },
  checkboxCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#999",
    backgroundColor: "#eee",
    marginRight: 8,
  },
  checkboxLabel: {
    fontSize: 13,
    color: "#444",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  secondaryButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#111",
    borderRadius: 25,
    paddingVertical: 12,
    marginRight: 8,
    alignItems: "center",
  },
  secondaryButtonText: {
    fontSize: 15,
    color: "#111",
    fontWeight: "500",
  },
  primaryButton: {
    flex: 1,
    backgroundColor: "#111",
    borderRadius: 25,
    paddingVertical: 12,
    marginLeft: 8,
    alignItems: "center",
  },
  primaryButtonText: {
    fontSize: 15,
    color: "#fff",
    fontWeight: "600",
  },
  disabledButton: {
    flex: 1,
    backgroundColor: "#ccc",
    borderRadius: 25,
    paddingVertical: 12,
    marginLeft: 8,
    alignItems: "center",
  },
  disabledButtonText: {
    fontSize: 15,
    color: "#888",
    fontWeight: "600",
  },
});