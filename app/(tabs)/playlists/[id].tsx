import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import moment from "moment";

import PlaylistService from "@/services/playlist";
import LikeService from "@/services/like";
import AddToPlaylistModal from "@/components/modals/AddToPlaylistModal";
import { toast } from "@/utils/toast";
import { useAuth } from "@/app/contexts/AuthContext";
import { usePlayerStore } from "@/utils/playerStore";

export default function PlaylistDetailScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const {
    setCurrentSong,
    setIsPlaying,
    setPlaylist,
    setCurrentIndex,
    setAlbumPurchaseStatus,
  } = usePlayerStore();

  const [playlistData, setPlaylistData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLiking, setIsLiking] = useState(false);
  const [addToPlaylistModal, setAddToPlaylistModal] = useState({
    isOpen: false,
    song: null as any,
  });
  const [userPlaylists, setUserPlaylists] = useState<any[]>([]);
  const [isAddingToPlaylist, setIsAddingToPlaylist] = useState(false);

  useEffect(() => {
    fetchPlaylistData();
    fetchUserPlaylists();
  }, [id]);

  const fetchPlaylistData = async () => {
    try {
      setIsLoading(true);
      const response = await PlaylistService.getPlaylistWithSong(id as string);
      setPlaylistData(response?.data || null);
    } catch (error) {
      toast.error("Failed to fetch playlist");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserPlaylists = async () => {
    try {
      const response = await PlaylistService.getPlaylists();
      setUserPlaylists(response?.data || []);
    } catch (error) {
      console.error("Failed to fetch user playlists:", error);
    }
  };

  const handleLikeSong = async (songId: string, event?: any) => {
    try {
      // Prevent song from playing when liking
      event?.stopPropagation();

      if (isLiking) return;
      setIsLiking(true);

      await LikeService.likeSongs(songId);

      // Update the playlist data to reflect the new like status
      const updatedSongs = playlistData.songs.map((song: any) => {
        if (song.id === songId) {
          return {
            ...song,
            is_liked: !song.is_liked,
          };
        }
        return song;
      });

      setPlaylistData({
        ...playlistData,
        songs: updatedSongs,
      });

      // Optional: Show success toast
      toast.success("Like status updated");
    } catch (error) {
      toast.error("Failed to update like status");
    } finally {
      setIsLiking(false);
    }
  };

  const handlePlaySong = async (song: any, index: number) => {
    // Set the playlist first
    setPlaylist(playlistData.songs);

    // Set the current song
    setCurrentSong(song);

    // Set the current index
    setCurrentIndex(index);

    // Start playing
    setIsPlaying(true);
    setAlbumPurchaseStatus(true);
  };

  const handleAddToPlaylist = async (playlistId: string) => {
    if (!addToPlaylistModal.song) return;

    try {
      setIsAddingToPlaylist(true);
      await PlaylistService.addSongToPlaylist({
        playlist_id: playlistId,
        song_ids: [addToPlaylistModal.song.id],
      });
      toast.success("Song added to playlist");
      setAddToPlaylistModal({ isOpen: false, song: null });
    } catch (error) {
      toast.error("Failed to add song to playlist");
    } finally {
      setIsAddingToPlaylist(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8B5CF6" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Playlist Header */}
      <View style={styles.header}>
        <Image
          source={{ uri: playlistData?.image }}
          style={styles.playlistImage}
        />
        <View style={styles.playlistInfo}>
          <Text style={styles.playlistName}>{playlistData?.name}</Text>
          <Text style={styles.playlistDescription}>
            {playlistData?.description}
          </Text>
        </View>
      </View>

      {/* Songs List */}
      <View style={styles.songsList}>
        {playlistData?.songs?.map((song: any, index: number) => (
          <TouchableOpacity
            key={song.id}
            style={styles.songItem}
            onPress={() => handlePlaySong(song, index)}
          >
            <View style={styles.songInfo}>
              <Image
                source={{ uri: song.cover_image }}
                style={styles.songImage}
              />
              <View style={styles.songDetails}>
                <Text style={styles.songTitle}>{song.title}</Text>
                <Text style={styles.songDate}>
                  {moment(song.created_at).format("DD MMM YYYY")}
                </Text>
              </View>
            </View>

            <View style={styles.songActions}>
              {song.playCount && (
                <View style={styles.playCountContainer}>
                  <Ionicons
                    name="musical-note-outline"
                    size={16}
                    color="#666"
                  />
                  <Text style={styles.playCount}>{song.playCount}</Text>
                </View>
              )}

              <TouchableOpacity
                style={styles.actionButton}
                onPress={() =>
                  setAddToPlaylistModal({
                    isOpen: true,
                    song: song,
                  })
                }
              >
                <Ionicons name="add" size={20} color="#666" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleLikeSong(song.id)}
              >
                <Ionicons
                  name={song.is_liked ? "heart" : "heart-outline"}
                  size={20}
                  color="#29baba"
                />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <AddToPlaylistModal
        isOpen={addToPlaylistModal.isOpen}
        onClose={() => setAddToPlaylistModal({ isOpen: false, song: null })}
        playlists={userPlaylists.filter((p) => p.id !== id)}
        onSelect={handleAddToPlaylist}
        isLoading={isAddingToPlaylist}
      />
    </ScrollView>
  );
}

const { width } = Dimensions.get("window");

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

  // Header Styles
  header: {
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },

  playlistImage: {
    width: width * 0.4, // 40% of screen width
    height: width * 0.4,
    borderRadius: 12,
    backgroundColor: "#27272A",
  },

  playlistInfo: {
    flex: 1,
  },

  playlistName: {
    fontSize: 24,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 8,
  },

  playlistDescription: {
    fontSize: 14,
    color: "#A1A1AA",
    lineHeight: 20,
  },

  // Songs List Styles
  songsList: {
    padding: 20,
  },

  songItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#27272A",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },

  songInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 12,
  },

  songImage: {
    width: 56,
    height: 56,
    borderRadius: 8,
    backgroundColor: "#18181B",
  },

  songDetails: {
    flex: 1,
  },

  songTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#FFFFFF",
    marginBottom: 4,
  },

  songDate: {
    fontSize: 12,
    color: "#A1A1AA",
  },

  songActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  playCountContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#18181B",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },

  playCount: {
    fontSize: 12,
    color: "#A1A1AA",
  },

  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#18181B",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#2ECFCF",
  },

  // Empty State Styles
  emptyContainer: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  emptyText: {
    fontSize: 16,
    color: "#A1A1AA",
    textAlign: "center",
  },

  // Shadow for iOS
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // for Android
  },
});
