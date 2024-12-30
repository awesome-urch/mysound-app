import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from "react-native";
import PlaylistService from "../../services/playlist";
import { showMessage } from "react-native-flash-message";

interface PlaylistModalProps {
  visible: boolean;
  onClose: () => void;
  song: any;
  albumPurchased: boolean;
}

export default function PlaylistModal({
  visible,
  onClose,
  song,
  albumPurchased,
}: PlaylistModalProps) {
  const [userPlaylists, setUserPlaylists] = useState<any[]>([]);

  useEffect(() => {
    if (visible) {
      fetchUserPlaylists();
    }
  }, [visible]);

  const fetchUserPlaylists = async () => {
    try {
      const response = await PlaylistService.getPlaylists();
      setUserPlaylists(response?.data || []);
    } catch (error) {
      console.error("Error fetching playlists:", error);
    }
  };

  const handleAddToPlaylist = async (playlistId: string) => {
    if (!albumPurchased) {
      showMessage({
        message: "Purchase Required",
        description: "Please purchase this album to add songs to your playlist",
        type: "danger",
      });
      return;
    }

    try {
      await PlaylistService.addSongToPlaylist({
        playlist_id: playlistId,
        song_ids: [song?.id],
      });
      onClose();
      showMessage({
        message: "Success",
        description: "Song added to playlist successfully!",
        type: "success",
      });
    } catch (error: any) {
      console.error("Error adding song to playlist:", error);
      showMessage({
        message: "Error",
        description:
          error?.response?.data?.message || "Failed to add song to playlist",
        type: "danger",
      });
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Add to Playlist</Text>
          <ScrollView style={styles.playlistsContainer}>
            {userPlaylists.length === 0 ? (
              <Text style={styles.emptyText}>No playlists found</Text>
            ) : (
              userPlaylists.map((playlist) => (
                <TouchableOpacity
                  key={playlist.id}
                  style={styles.playlistItem}
                  onPress={() => handleAddToPlaylist(playlist.id)}
                >
                  <Image
                    source={{ uri: playlist.image }}
                    style={styles.playlistImage}
                  />
                  <Text style={styles.playlistName}>{playlist.name}</Text>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    maxHeight: "80%",
    backgroundColor: "#282828",
    borderRadius: 16,
    padding: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 16,
  },
  playlistsContainer: {
    maxHeight: 400,
  },
  playlistItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: "#1A1A1A",
  },
  playlistImage: {
    width: 48,
    height: 48,
    borderRadius: 8,
    marginRight: 12,
  },
  playlistName: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "500",
  },
  emptyText: {
    color: "#999",
    textAlign: "center",
    marginTop: 16,
  },
});
