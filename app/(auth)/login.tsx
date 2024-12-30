import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import api from "@/utils/api";

const { width } = Dimensions.get("window");
const LOGO_WIDTH = width * 0.7; // 70% of screen width

export default function LoginScreen() {
  const router = useRouter();
  const [loginInformation, setLoginInformation] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const response = await api.post("/api/login", loginInformation);

      if (response.data) {
        console.log(response.data?.data);
        await AsyncStorage.setItem("token", response.data?.data?.token);
        await AsyncStorage.setItem(
          "userType",
          response.data?.data?.user.user_type
        );
        await AsyncStorage.setItem(
          "user",
          JSON.stringify(response.data?.data?.user)
        );

        if (response.data?.data?.user.user_type === "user") {
          router.replace("/(tabs)/dashboard");
        }
      }
    } catch (error: any) {
      setError(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require("../../assets/images/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.title}>Welcome Back!</Text>
        <Text style={styles.subtitle}>
          Sign in to continue your musical journey
        </Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor="#666"
            keyboardType="email-address"
            autoCapitalize="none"
            value={loginInformation.email}
            onChangeText={(text) =>
              setLoginInformation((prev) => ({ ...prev, email: text }))
            }
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            placeholderTextColor="#666"
            secureTextEntry
            value={loginInformation.password}
            onChangeText={(text) =>
              setLoginInformation((prev) => ({ ...prev, password: text }))
            }
          />
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Log In</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.signupButton}
          onPress={() => router.push("/(auth)/signup")}
        >
          <Text style={styles.signupText}>
            Don't have an account?{" "}
            <Text style={styles.signupLink}>Sign up</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#161616",
    padding: 20,
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 60, // Adjust this value based on your needs
    marginBottom: 20,
  },
  logo: {
    width: LOGO_WIDTH,
    height: LOGO_WIDTH * 0.5, // Adjust aspect ratio based on your logo
  },
  formContainer: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#999",
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    color: "#fff",
    marginBottom: 8,
    fontSize: 14,
  },
  input: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 8,
    padding: 15,
    color: "#fff",
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: "#8B5CF6",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  errorText: {
    color: "#EF4444",
    marginBottom: 10,
  },
  signupButton: {
    marginTop: 20,
    alignItems: "center",
  },
  signupText: {
    color: "#999",
    fontSize: 14,
  },
  signupLink: {
    color: "#8B5CF6",
    fontWeight: "bold",
  },
});
