import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import PlaylistService from "@/services/playlist";
import CreatePlaylistModal from "@/components/modals/CreatePlaylistModal";
import DeleteConfirmationModal from "@/components/modals/DeleteConfirmationModal";
import { toast } from "@/utils/toast";
import CloudinaryService from "@/services/CloudinaryService";
import { useAuth } from "../../contexts/AuthContext";

const { width } = Dimensions.get("window");

const ITEM_WIDTH = width * 0.4; // 40% of screen width
const ITEM_HEIGHT = ITEM_WIDTH * 1.3;

export default function PlaylistsScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [personalPlaylists, setPersonalPlaylists] = useState<any[]>([]);
  const [communityPlaylists, setCommunityPlaylists] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    playlistId: "",
    playlistName: "",
  });
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch playlists
  const getPlayLists = async () => {
    try {
      setIsLoading(true);
      const [personalResponse, communityResponse] = await Promise.all([
        PlaylistService.getPlaylists(),
        PlaylistService.getCommunityPlaylists(),
      ]);

      setPersonalPlaylists(personalResponse?.data || []);
      setCommunityPlaylists(communityResponse?.data || []);
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch playlists");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePlaylist = async (playlistData: {
    name: string;
    description: string;
    image: any;
  }) => {
    console.log(playlistData.image.file);
    try {
      setIsCreating(true);
      const imageUrl = await CloudinaryService.uploadFile(playlistData.image);

      await PlaylistService.createPlaylist({
        ...playlistData,
        image: imageUrl,
        // type: "personal",
      });

      toast.success("Playlist created successfully!");
      await getPlayLists();
      setIsModalOpen(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to create playlist");
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeletePlaylist = async () => {
    try {
      setIsDeleting(true);
      await PlaylistService.deletePlaylist(deleteModal.playlistId);
      toast.success("Playlist deleted successfully");
      await getPlayLists();
      setDeleteModal({ isOpen: false, playlistId: "", playlistName: "" });
    } catch (error: any) {
      toast.error(error.message || "Failed to delete playlist");
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    getPlayLists();
  }, []);

  const PlaylistGrid = ({
    playlists,
    emptyMessage,
    isPersonal = false,
  }: {
    playlists: any[];
    emptyMessage: string;
    isPersonal?: boolean;
  }) => {
    if (playlists.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconContainer}>
            <Ionicons name="musical-note-outline" size={24} color="#666" />
          </View>
          <Text style={styles.emptyTitle}>No Playlists</Text>
          <Text style={styles.emptyMessage}>{emptyMessage}</Text>
        </View>
      );
    }

    // Split playlists into two rows
    const topRow = playlists.filter((_, index) => index % 2 === 0);
    const bottomRow = playlists.filter((_, index) => index % 2 === 1);

    return (
      <View style={styles.gridContainer}>
        {/* Top Row */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.row}
        >
          {topRow.map((playlist) => (
            <TouchableOpacity
              key={playlist.id}
              style={styles.gridItem}
              onPress={() => {
                router.push(`/playlists/${playlist.id}`);
              }}
            >
              <View style={styles.playlistCard}>
                {isPersonal && (
                  <TouchableOpacity
                    onPress={() =>
                      setDeleteModal({
                        isOpen: true,
                        playlistId: playlist.id,
                        playlistName: playlist.name,
                      })
                    }
                    style={styles.deleteButton}
                  >
                    <Ionicons name="trash-outline" size={20} color="white" />
                  </TouchableOpacity>
                )}

                <Image
                  source={{ uri: playlist.image }}
                  style={styles.playlistImage}
                />
                <Text style={styles.playlistName} numberOfLines={1}>
                  {playlist.name}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Bottom Row */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.row}
        >
          {bottomRow.map((playlist) => (
            <TouchableOpacity
              key={playlist.id}
              style={styles.gridItem}
              onPress={() => router.push(`/playlists/${playlist.id}`)}
            >
              <View style={styles.playlistCard}>
                {isPersonal && (
                  <TouchableOpacity
                    onPress={() =>
                      setDeleteModal({
                        isOpen: true,
                        playlistId: playlist.id,
                        playlistName: playlist.name,
                      })
                    }
                    style={styles.deleteButton}
                  >
                    <Ionicons name="trash-outline" size={20} color="white" />
                  </TouchableOpacity>
                )}

                <Image
                  source={{ uri: playlist.image }}
                  style={styles.playlistImage}
                />
                <Text style={styles.playlistName} numberOfLines={1}>
                  {playlist.name}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Personal Playlists */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your Playlists</Text>
          <TouchableOpacity
            onPress={() => setIsModalOpen(true)}
            style={styles.createButton}
          >
            <Ionicons name="add" size={24} color="white" />
            <Text style={styles.createButtonText}>Create Playlist</Text>
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <ActivityIndicator color="#8B5CF6" style={styles.loader} />
        ) : (
          <PlaylistGrid
            playlists={personalPlaylists}
            emptyMessage="Create your first playlist to start organizing your music"
            isPersonal
          />
        )}
      </View>

      {/* Community Playlists */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Community Playlists</Text>
        {isLoading ? (
          <ActivityIndicator color="#8B5CF6" style={styles.loader} />
        ) : (
          <PlaylistGrid
            playlists={communityPlaylists}
            emptyMessage="No community playlists available"
          />
        )}
      </View>

      {/* Modals */}
      <CreatePlaylistModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreatePlaylist}
        isLoading={isCreating}
      />

      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() =>
          setDeleteModal({ isOpen: false, playlistId: "", playlistName: "" })
        }
        onConfirm={handleDeletePlaylist}
        isLoading={isDeleting}
        playlistName={deleteModal.playlistName}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000", // or your background color
    paddingHorizontal: 16,
  },

  section: {
    marginBottom: 32,
    paddingTop: 16,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "light",
    color: "#FFFFFF",
    marginBottom: 20,
  },

  createButton: {
    backgroundColor: "#8B5CF6", // Your primary color
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 25,
  },

  createButtonText: {
    color: "#FFFFFF",
    marginLeft: 8,
    fontWeight: "500",
  },

  loader: {
    marginTop: 20,
  },

  // Empty State Styles
  emptyContainer: {
    backgroundColor: "#27272A", // surface-elevated color
    padding: 32,
    borderRadius: 12,
    alignItems: "center",
  },

  emptyIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#18181B", // surface color
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },

  emptyTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#FFFFFF",
    marginBottom: 8,
  },

  emptyMessage: {
    color: "#A1A1AA", // text-secondary color
    textAlign: "center",
  },

  gridContainer: {
    height: ITEM_HEIGHT * 2 + 16, // Height for two rows plus gap
  },

  row: {
    marginBottom: 16,
  },

  gridItem: {
    width: ITEM_WIDTH,
    marginRight: 16, // Gap between items
  },

  playlistCard: {
    backgroundColor: "#27272A",
    borderRadius: 12,
    padding: 8,
    position: "relative",
    height: ITEM_HEIGHT - 16, // Subtracting the row gap
  },

  playlistImage: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 8,
    marginBottom: 8,
  },

  playlistName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },

  deleteButton: {
    position: "absolute",
    top: 16,
    right: 16,
    zIndex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 20,
    padding: 8,
  },
});
