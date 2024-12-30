import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface AddToPlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  playlists: any[];
  onSelect: (playlistId: string) => void;
  isLoading: boolean;
}

export default function AddToPlaylistModal({
  isOpen,
  onClose,
  playlists,
  onSelect,
  isLoading,
}: AddToPlaylistModalProps) {
  if (!isOpen) return null;

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Add to Playlist</Text>

          {playlists.length === 0 ? (
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconContainer}>
                <Ionicons name="musical-note-outline" size={24} color="#666" />
              </View>
              <Text style={styles.emptyText}>No playlists available</Text>
            </View>
          ) : (
            <ScrollView style={styles.scrollContainer}>
              {playlists.map((playlist) => (
                <TouchableOpacity
                  key={playlist.id}
                  onPress={() => onSelect(playlist.id)}
                  disabled={isLoading}
                  style={styles.playlistItem}
                >
                  <Image
                    source={{ uri: playlist.image }}
                    style={styles.playlistImage}
                  />
                  <Text style={styles.playlistName}>{playlist.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
}

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#18181B",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: "80%",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 16,
  },
  scrollContainer: {
    maxHeight: 300,
  },
  playlistItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#27272A",
    borderRadius: 12,
    marginBottom: 8,
  },
  playlistImage: {
    width: 48,
    height: 48,
    borderRadius: 8,
    marginRight: 16,
  },
  playlistName: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
  },
  emptyContainer: {
    alignItems: "center",
    padding: 32,
  },
  emptyIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#27272A",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  emptyText: {
    color: "#A1A1AA",
    fontSize: 16,
  },
});
