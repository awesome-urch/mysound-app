import { useEffect } from "react";
import { View } from "react-native";
import { Tabs, Stack } from "expo-router";
import { AuthProvider } from "../contexts/AuthContext";
import Header from "@/components/dashboard/Header";
import {
  HomeIcon,
  AlbumsIcon,
  LibraryIcon,
  ProfileIcon,
} from "@/components/Icons";
import FlashMessage from "react-native-flash-message";
import CustomMusicPlayer from "@/components/player/MusicPlayer";

export default function AppLayout() {
  return (
    <>
      <AuthProvider>
        <View style={{ flex: 1, backgroundColor: "#161616" }}>
          <Header />
          <Tabs
            screenOptions={{
              headerShown: false,
              tabBarStyle: {
                backgroundColor: "#121212",
                borderTopWidth: 0,
                height: 60,
                paddingBottom: 8,
              },
              tabBarActiveTintColor: "#8B5CF6",
              tabBarInactiveTintColor: "#666",
            }}
          >
            <Tabs.Screen
              name="dashboard"
              options={{
                title: "Home",
                tabBarIcon: ({ color }) => <HomeIcon color={color} />,
              }}
            />
            <Tabs.Screen
              name="albums"
              options={{
                title: "Albums",
                tabBarIcon: ({ color }) => <AlbumsIcon color={color} />,
              }}
            />
            <Tabs.Screen
              name="playlists"
              options={{
                title: "Library",
                tabBarIcon: ({ color }) => <LibraryIcon color={color} />,
              }}
            />
            <Tabs.Screen
              name="profile"
              options={{
                title: "Profile",
                tabBarIcon: ({ color }) => <ProfileIcon color={color} />,
              }}
            />
            <Tabs.Screen
              name="artists"
              options={{
                href: null,
              }}
            />
            <Tabs.Screen
              name="index"
              options={{
                href: null,
              }}
            />
          </Tabs>
          <CustomMusicPlayer />
        </View>
      </AuthProvider>
      <FlashMessage position="top" />
    </>
  );
}
