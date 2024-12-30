import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Modal,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useAuth } from "../../contexts/AuthContext";
import AlbumService from "../../../services/album";
import { Ionicons } from "@expo/vector-icons";
import moment from "moment";
import PlaylistModal from "@/components/modals/PlaylistModal";
import PaymentModal from "@/components/modals/PaymentModal";
import { Song, usePlayerStore } from "@/utils/playerStore";
// import PlaylistModal from "@/components/modals/PlaylistModal";
// import PaymentModal from "@/components/modals/PaymentModal";

const { width } = Dimensions.get("window");

export default function AlbumPage() {
  const { id } = useLocalSearchParams();
  const { user } = useAuth();
  const router = useRouter();

  const [albumSong, setAlbumSong] = useState<any>(null);
  const [albumSongs, setAlbumSongs] = useState<any>([]);
  const [albums, setAlbums] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedSong, setSelectedSong] = useState<any>(null);

  const {
    setCurrentSong,
    setPlaylist,
    setCurrentIndex,
    setAlbumPurchaseStatus,
  } = usePlayerStore();

  useEffect(() => {
    // if (!user) {
    //   return router.replace("/(auth)/login");
    // }
    loadAlbumData();
  }, [id]);

  const loadAlbumData = async () => {
    try {
      await Promise.all([fetchAlbum(), fetchAlbums()]);
    } catch (error) {
      console.error("Error loading album data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAlbum = async () => {
    try {
      const response = await AlbumService.getAlbum(id as string);
      setAlbumSong(response?.data);
      fetchAlbumWithSong();
    } catch (error) {
      console.error("Error fetching album:", error);
    }
  };

  const fetchAlbumWithSong = async () => {
    try {
      const response = await AlbumService.getAlbumWithSongs(id as string);
      const songs = response?.data?.songs;
      const fullSongs = songs?.filter((song: any) => song.type === "full");
      setAlbumSongs(fullSongs);
    } catch (error) {
      console.error("Error fetching album songs:", error);
    }
  };

  const fetchAlbums = async () => {
    try {
      const response = await AlbumService.getAlbums();
      setAlbums(response?.data);
    } catch (error) {
      console.error("Error fetching albums:", error);
    }
  };

  const handleLikeSong = async (songId: string) => {
    try {
      //   await LikeService.likeSongs(songId);
      fetchAlbumWithSong();
    } catch (error) {
      console.error("Error liking song:", error);
    }
  };

  const handlePlaySong = (
    song: Song,
    songList: Song[],
    index: number,
    isPurchased: boolean
  ) => {
    setCurrentSong(song);
    setPlaylist(songList);
    setCurrentIndex(index);
    setAlbumPurchaseStatus(isPurchased);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8B5CF6" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Hero Section */}
      <View style={styles.hero}>
        <Image source={{ uri: albumSong?.image }} style={styles.albumCover} />
        <View style={styles.albumInfo}>
          <Text style={styles.albumTitle}>{albumSong?.name}</Text>
          <Text style={styles.albumDescription}>{albumSong?.description}</Text>
        </View>
      </View>

      {/* Purchase Button */}
      {!albumSong?.is_purchased && (
        <TouchableOpacity
          style={styles.purchaseButton}
          onPress={() => setIsPaymentModalOpen(true)}
        >
          <Text style={styles.purchaseButtonText}>
            Purchase Album (${albumSong?.price_usd})
          </Text>
        </TouchableOpacity>
      )}

      {/* Songs Section */}
      <View style={styles.songsSection}>
        <Text style={styles.sectionTitle}>Songs</Text>
        {albumSongs?.length === 0 ? (
          <View style={styles.emptySongs}>
            <Text style={styles.emptyText}>
              No songs available in this album.
            </Text>
          </View>
        ) : (
          albumSongs?.map((song: any, index: number) => (
            <TouchableOpacity
              key={song.id}
              style={styles.songItem}
              onPress={() =>
                handlePlaySong(song, albumSongs, index, albumSong?.is_purchased)
              }
            >
              <View style={styles.songContent}>
                <Image
                  source={{ uri: song.cover_image }}
                  style={styles.songCover}
                />
                <View style={styles.songInfo}>
                  <Text style={styles.songTitle}>{song.title}</Text>
                  <Text style={styles.songDate}>
                    {moment(song.created_at).format("DD MMM YYYY")}
                  </Text>
                </View>
              </View>
              {/* <View style={styles.songActions}>
                <TouchableOpacity
                  onPress={() => {
                    setSelectedSong(song);
                    setIsPlaylistModalOpen(true);
                  }}
                  style={styles.actionButton}
                >
                  <Ionicons name="add" size={24} color="#999" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleLikeSong(song.id)}
                  style={styles.actionButton}
                >
                  <Ionicons
                    name={song.is_liked ? "heart" : "heart-outline"}
                    size={24}
                    color={song.is_liked ? "#8B5CF6" : "#999"}
                  />
                </TouchableOpacity>
              </View> */}
            </TouchableOpacity>
          ))
        )}
      </View>

      {/* Other Albums Section */}
      <View style={styles.otherAlbumsSection}>
        <Text style={styles.sectionTitle}>Other Albums</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.otherAlbumsContent}
        >
          {albums
            ?.sort(() => 0.5 - Math.random())
            .slice(0, 3)
            .map((album: any) => (
              <TouchableOpacity
                key={album.id}
                style={styles.otherAlbumItem}
                onPress={() => router.push(`/albums/${album.id}`)}
              >
                <Image
                  source={{ uri: album.image }}
                  style={styles.otherAlbumCover}
                />
                <Text style={styles.otherAlbumTitle}>{album.name}</Text>
                <Text style={styles.otherAlbumYear}>
                  {moment(album.created_at).format("YYYY")}
                </Text>
              </TouchableOpacity>
            ))}
        </ScrollView>
      </View>

      {/* Modals */}
      <PlaylistModal
        visible={isPlaylistModalOpen}
        onClose={() => setIsPlaylistModalOpen(false)}
        song={selectedSong}
        albumPurchased={albumSong?.is_purchased}
      />

      <PaymentModal
        visible={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        amount={Number(albumSong?.price_usd)}
        albumId={albumSong?.id}
        type="purchase_album"
      />
    </ScrollView>
  );
}

// ... (previous component code remains the same until styles)

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
    margin: 16,
    padding: 16,
    backgroundColor: "#282828",
    borderRadius: 16,
    overflow: "hidden",
  },
  albumCover: {
    width: width - 64,
    height: width - 64,
    borderRadius: 12,
    marginBottom: 16,
  },
  albumInfo: {
    gap: 8,
  },
  albumTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  albumDescription: {
    fontSize: 14,
    color: "#999",
    lineHeight: 24,
  },
  purchaseButton: {
    margin: 16,
    padding: 16,
    backgroundColor: "#8B5CF6",
    borderRadius: 12,
    alignItems: "center",
  },
  purchaseButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  songsSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 16,
  },
  emptySongs: {
    padding: 24,
    backgroundColor: "#282828",
    borderRadius: 12,
    alignItems: "center",
  },
  emptyText: {
    color: "#999",
    fontSize: 14,
  },
  songItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    backgroundColor: "#282828",
    borderRadius: 12,
    marginBottom: 8,
  },
  songContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  songCover: {
    width: 56,
    height: 56,
    borderRadius: 8,
    marginRight: 12,
  },
  songInfo: {
    flex: 1,
  },
  songTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 4,
  },
  songDate: {
    fontSize: 14,
    color: "#999",
  },
  songActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  actionButton: {
    padding: 8,
    backgroundColor: "#1A1A1A",
    borderRadius: 20,
  },
  otherAlbumsSection: {
    padding: 16,
  },
  otherAlbumsContent: {
    paddingRight: 16,
  },
  otherAlbumItem: {
    width: width * 0.4,
    marginRight: 12,
  },
  otherAlbumCover: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 8,
    marginBottom: 8,
  },
  otherAlbumTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 4,
  },
  otherAlbumYear: {
    fontSize: 14,
    color: "#999",
  },
});
