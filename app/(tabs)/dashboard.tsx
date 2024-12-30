import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import HotPlaylists from "@/components/dashboard/HotPlaylists";
import TrendingArtists from "@/components/dashboard/TrendingArtists";
import TopCharts from "@/components/dashboard/Charts";
import TopAlbums from "@/components/dashboard/TopAlbums";

export default function index() {
  const { user } = useAuth();

  return (
    <ScrollView style={styles.container}>
      {/* Welcome Section */}
      <View style={styles.welcomeSection}>
        <Text style={styles.welcomeText}>
          Welcome back, {user?.name?.split(" ")[0]}
        </Text>
      </View>

      {/* Top Charts */}
      <View style={styles.section}>
        <TopCharts />
      </View>

      {/* Latest Albums */}
      <View style={styles.section}>
        <TopAlbums />
      </View>

      {/* Hot Playlists */}
      <View style={styles.section}>
        <HotPlaylists />
      </View>

      {/* Trending Artists */}
      <View style={styles.section}>
        <TrendingArtists />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#161616",
  },
  welcomeSection: {
    padding: 16,
    paddingTop: 24,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  section: {
    marginTop: 24,
  },
});
