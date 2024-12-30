import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../contexts/AuthContext";
import AlbumService from "../../../services/album";
import AlbumList from "@/components/albums/AlbumList";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

export default function Albums() {
  const { user } = useAuth();
  const router = useRouter();
  const [favouriteAlbums, setFavouriteAlbums] = useState<any>([]);
  const [newAlbums, setNewAlbums] = useState<any>([]);
  const [trendingAlbums, setTrendingAlbums] = useState<any>([]);
  const [topAlbums, setTopAlbums] = useState<any>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      return router.replace("/(auth)/login");
    }
    loadAllAlbums();
  }, []);

  const loadAllAlbums = async () => {
    try {
      await Promise.all([
        getFavouritesAlbums(),
        getNewAlbums(),
        getTrendingAlbums(),
        getTopAlbums(),
      ]);
    } catch (error) {
      console.error("Error loading albums:", error);
    } finally {
      setLoading(false);
    }
  };

  async function getFavouritesAlbums() {
    try {
      const response = await AlbumService.getFavouritesAlbums(user.id);
      const processedAlbums = response?.map((album: any) => ({
        ...album,
        image: album.image.startsWith("https://")
          ? album.image
          : `https://mysounduk-service.com/uploads/songs/${album.image}`,
      }));
      setFavouriteAlbums(processedAlbums);
    } catch (error: any) {
      console.error("Error fetching favourite albums:", error);
    }
  }

  async function getNewAlbums() {
    try {
      const response = await AlbumService.getNewAlbums();
      setNewAlbums(response.data);
    } catch (error: any) {
      console.error("Error fetching new albums:", error);
    }
  }

  async function getTopAlbums() {
    try {
      const response = await AlbumService.getTopAlbums();
      setTopAlbums(response.data);
    } catch (error: any) {
      console.error("Error fetching top albums:", error);
    }
  }

  async function getTrendingAlbums() {
    try {
      const response = await AlbumService.getTrendingAlbums();
      setTrendingAlbums(response.data);
    } catch (error: any) {
      console.error("Error fetching trending albums:", error);
    }
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8B5CF6" />
      </View>
    );
  }

  const EmptyState = () => (
    <View style={styles.emptyState}>
      <View style={styles.iconContainer}>
        <Ionicons name="musical-note-outline" size={24} color="#fff" />
      </View>
      <Text style={styles.emptyTitle}>No albums yet</Text>
      <Text style={styles.emptyText}>
        Start exploring our collection to discover amazing albums in this
        category
      </Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Album Sections */}
      {[
        { title: "Favourite Albums", data: favouriteAlbums },
        { title: "New Releases", data: newAlbums },
        { title: "Suggested For You", data: trendingAlbums },
        { title: "Trending Albums", data: trendingAlbums },
        { title: "Top Albums", data: topAlbums },
      ].map((section) => (
        <View key={section.title} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          {section.data?.length > 0 ? (
            <AlbumList albums={section.data} />
          ) : (
            <EmptyState />
          )}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#161616",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#161616",
  },
  hero: {
    padding: 24,
    backgroundColor: "#282828",
    marginBottom: 32,
    borderRadius: 16,
    marginHorizontal: 16,
    marginTop: 16,
  },
  heroContent: {
    maxWidth: 600,
  },
  tagContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  tagLine: {
    width: 48,
    height: 2,
    backgroundColor: "#8B5CF6",
    borderRadius: 2,
    marginRight: 12,
  },
  tag: {
    color: "#8B5CF6",
    fontWeight: "600",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  titleHighlight: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#8B5CF6",
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: "#999",
    lineHeight: 24,
  },
  section: {
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 16,
  },
  emptyState: {
    backgroundColor: "#282828",
    borderRadius: 16,
    padding: 32,
    alignItems: "center",
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#8B5CF6",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    maxWidth: 300,
  },
});
