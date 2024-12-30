// app/(tabs)/albums/_layout.tsx
import { Stack } from "expo-router";

export default function AlbumsLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#161616",
        },
        headerTintColor: "#fff",
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          headerTitle: "Album Details",
        }}
      />
    </Stack>
  );
}
