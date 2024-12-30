import React from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");
const ITEM_WIDTH = width * 0.4;

interface AlbumListProps {
  albums: any[];
}

export default function AlbumList({ albums }: AlbumListProps) {
  const router = useRouter();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {albums.map((album) => (
        <TouchableOpacity
          key={album.id}
          style={styles.albumCard}
          onPress={() => router.push(`/albums/${album.id}`)}
        >
          <Image source={{ uri: album.image }} style={styles.albumImage} />
          <View style={styles.albumInfo}>
            <Text style={styles.albumName} numberOfLines={1}>
              {album.name}
            </Text>
            {album.artist_name && (
              <Text style={styles.artistName} numberOfLines={1}>
                {album.artist_name}
              </Text>
            )}
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  albumCard: {
    width: ITEM_WIDTH,
    marginRight: 12,
    backgroundColor: "#282828",
    borderRadius: 8,
    overflow: "hidden",
  },
  albumImage: {
    width: "100%",
    aspectRatio: 1,
  },
  albumInfo: {
    padding: 12,
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
