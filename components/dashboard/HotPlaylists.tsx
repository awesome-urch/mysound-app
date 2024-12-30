import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useState, useEffect } from "react";
import PlaylistService from "../../services/playlist";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");
const ITEM_WIDTH = width * 0.4; // 40% of screen width

export default function HotPlaylists() {
  const router = useRouter();
  const [playlists, setPlaylists] = useState<any>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHotPlaylists();
  }, []);

  const fetchHotPlaylists = async () => {
    try {
      const response = await PlaylistService.getHotPlaylists();
      setPlaylists(response?.data || []);
    } catch (error) {
      console.error("Error fetching playlists:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Popular playlists</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {playlists.slice(0, 6).map((item: any) => (
          <TouchableOpacity
            key={item.id}
            style={styles.playlistItem}
              onPress={() => router.push(`/playlists/${item.id}`)}
          >
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: item.image }}
                style={styles.playlistImage}
              />
            </View>
            <Text style={styles.playlistName} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={styles.playlistDescription} numberOfLines={2}>
              {item.description}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  playlistItem: {
    width: ITEM_WIDTH,
    marginRight: 12,
    backgroundColor: "#282828",
    borderRadius: 8,
    padding: 12,
  },
  imageContainer: {
    width: "100%",
    aspectRatio: 1,
    marginBottom: 8,
    borderRadius: 4,
    overflow: "hidden",
  },
  playlistImage: {
    width: "100%",
    height: "100%",
  },
  playlistName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 4,
  },
  playlistDescription: {
    fontSize: 14,
    color: "#999",
    lineHeight: 18,
  },
});
