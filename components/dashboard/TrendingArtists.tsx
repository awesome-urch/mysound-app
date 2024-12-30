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
import { useRouter } from "expo-router";
import ArtistService from "../../services/artist";

const { width } = Dimensions.get("window");
const ITEM_WIDTH = width * 0.4; // 40% of screen width

export default function TrendingArtists() {
  const router = useRouter();
  const [artists, setArtists] = useState<any>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrendingArtists();
  }, []);

  const fetchTrendingArtists = async () => {
    try {
      const response = await ArtistService.getTrendingArtists();
      const processedArtists = response?.map((artist: any) => ({
        ...artist,
        image: artist.image.startsWith("https://")
          ? artist.image
          : `https://mysounduk-service.com/uploads/songs/${artist.image}`,
      }));
      setArtists(processedArtists || []);
    } catch (error) {
      console.error("Error fetching artists:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Trending artists</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {artists.slice(0, 6).map((item: any) => (
          <TouchableOpacity
            key={item.id}
            style={styles.artistItem}
              onPress={() => router.push(`/artists/${item.id}`)}
          >
            <View style={styles.imageContainer}>
              <Image source={{ uri: item.image }} style={styles.artistImage} />
            </View>
            <Text style={styles.artistName} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={styles.artistType}>Artist</Text>
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
  artistItem: {
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
  artistImage: {
    width: "100%",
    height: "100%",
  },
  artistName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 4,
  },
  artistType: {
    fontSize: 14,
    color: "#999",
  },
});
