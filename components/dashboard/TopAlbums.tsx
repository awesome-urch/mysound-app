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
import AlbumService from "../../services/album";

const { width } = Dimensions.get("window");
const ITEM_WIDTH = width * 0.4;

interface Album {
  id: string;
  name: string;
  description: string;
  image: string;
  price_usd: number;
  artist_name?: string;
}

export default function TopAlbums() {
  const router = useRouter();
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlbums();
  }, []);

  const fetchAlbums = async () => {
    try {
      const response = await AlbumService.getAlbums();
      setAlbums(response?.data || []);
    } catch (error) {
      console.error("Error fetching albums:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Latest Albums</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {albums.slice(0, 6).map((album) => (
          <TouchableOpacity
            key={album.id}
            style={styles.albumItem}
            onPress={() => router.push(`/albums/${album.id}`)}
          >
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: album.image }}
                style={styles.albumImage}
              />
              <View style={styles.priceTag}>
                <Text style={styles.price}>£{album.price_usd}</Text>
              </View>
            </View>
            <Text style={styles.albumName} numberOfLines={1}>
              {album.name}
            </Text>
            {album.artist_name && (
              <Text style={styles.artistName} numberOfLines={1}>
                {album.artist_name}
              </Text>
            )}
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
  albumItem: {
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
    position: "relative",
  },
  albumImage: {
    width: "100%",
    height: "100%",
  },
  priceTag: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#8B5CF6",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  price: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  albumName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 4,
  },
  artistName: {
    fontSize: 14,
    color: "#999",
  },
});
