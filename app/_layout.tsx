import { Stack } from "expo-router";
import { AuthProvider } from "./contexts/AuthContext";
import { useEffect, useState } from "react";
import { SplashScreen } from "expo-router";
import { StripeProvider } from "@stripe/stripe-react-native";
import { Platform } from "react-native";

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}

export default function RootLayout() {
  const [ready, setReady] = useState(Platform.OS === "android");

  useEffect(() => {
    if (Platform.OS === "ios") {
      // Delay Stripe initialization on iOS
      const timer = setTimeout(() => setReady(true), 100);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  if (!ready) return null;

  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}
