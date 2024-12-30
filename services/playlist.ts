import api from "../utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default class PlaylistService {
  static async getPlaylists() {
    try {
      const response = await api.get("/api/personal/playlists");
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  static async getCommunityPlaylists() {
    try {
      const response = await api.get("/api/community-playlists");
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  static async getPlaylistWithSong(playlistId: string) {
    try {
      const response = await api.get(`/api/playlist/${playlistId}`);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  static async getHotPlaylists() {
    try {
      const response = await api.get("/api/playlists/popular");
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  static async recentPlaylists() {
    try {
      const response = await api.get("/api/playlists/recent");
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  static async createPlaylist(playlistData: {
    name: string;
    image: any; // Could be a local file URI or base64
    description: string;
  }) {
    try {
      // Create FormData object
      const formData = new FormData();
      formData.append("name", playlistData.name);
      formData.append("description", playlistData.description);

      // Handle image file
      if (playlistData.image) {
        const imageUri = playlistData.image;
        const filename = imageUri.split("/").pop();
        const match = /\.(\w+)$/.exec(filename || "");
        const type = match ? `image/${match[1]}` : "image";

        formData.append("image", {
          uri: imageUri,
          name: filename,
          type,
        } as any);
      }

      const response = await api.post(`/api/playlist/create`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  static async addSongToPlaylist(data: {
    playlist_id: string;
    song_ids: Array<string>;
  }) {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await api.post(`/api/playlist/add-song`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async deletePlaylist(playlist_id: string) {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await api.delete(`/api/playlist/delete/${playlist_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Helper method to format image for upload
  static formatImageForUpload(imageUri: string) {
    const filename = imageUri.split("/").pop() || "image.jpg";
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : "image/jpeg";

    return {
      uri: imageUri,
      name: filename,
      type,
    };
  }
}
