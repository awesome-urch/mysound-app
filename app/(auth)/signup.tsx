import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
} from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import axios from "axios";
import api from "@/utils/api";

const { width } = Dimensions.get("window");
const LOGO_WIDTH = width * 0.7;

interface RegisterInformation {
  name: string;
  email: string;
  password: string;
}

export default function SignupScreen() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [registerInfo, setRegisterInfo] = useState<RegisterInformation>({
    name: "",
    email: "",
    password: "",
  });

  const handleRegister = async () => {
    // Validate inputs
    if (!registerInfo.name || !registerInfo.email || !registerInfo.password) {
      setError("All fields are required");
      return;
    }

    try {
      const response = await api.post("/api/register", {
        ...registerInfo,
        user_type: "user",
      });

      if (response.data) {
        // Registration successful, redirect to login
        router.replace("/(auth)/login");
      }
    } catch (error: any) {
      setError(error.response?.data?.message || "Registration failed");
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
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Join the music community today</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your name"
            placeholderTextColor="#666"
            value={registerInfo.name}
            onChangeText={(text) =>
              setRegisterInfo((prev) => ({ ...prev, name: text }))
            }
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor="#666"
            keyboardType="email-address"
            autoCapitalize="none"
            value={registerInfo.email}
            onChangeText={(text) =>
              setRegisterInfo((prev) => ({ ...prev, email: text }))
            }
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Create a password"
            placeholderTextColor="#666"
            secureTextEntry={!showPassword}
            value={registerInfo.password}
            onChangeText={(text) =>
              setRegisterInfo((prev) => ({ ...prev, password: text }))
            }
          />
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TouchableOpacity style={styles.signupButton} onPress={handleRegister}>
          <Text style={styles.signupButtonText}>Sign Up</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => router.push("/(auth)/login")}
        >
          <Text style={styles.loginText}>
            Already have an account?{" "}
            <Text style={styles.loginLink}>Log in</Text>
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
    marginTop: 60,
    marginBottom: 20,
  },
  logo: {
    width: LOGO_WIDTH,
    height: LOGO_WIDTH * 0.5,
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
  signupButton: {
    backgroundColor: "#8B5CF6",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  signupButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  errorText: {
    color: "#EF4444",
    marginBottom: 10,
  },
  loginButton: {
    marginTop: 20,
    alignItems: "center",
  },
  loginText: {
    color: "#999",
    fontSize: 14,
  },
  loginLink: {
    color: "#8B5CF6",
    fontWeight: "bold",
  },
});
