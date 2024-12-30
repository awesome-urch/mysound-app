import api from "../utils/api";

export default class SongService {
  static async getSongs() {
    try {
      const response = await api.get("/api/songs");
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  static async getSongsWithLimit(limit: number) {
    try {
      const response = await api.get(`/api/songs?limit=${limit}`);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  static async playSong(id: string) {
    try {
      const response = await api.post(`/api/songs/${id}/play`);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  static async recentlyPlayedSongs() {
    try {
      const response = await api.get(`/api/songs/recently-played?limit=20`);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  // Additional useful methods for mobile app
  static async likeSong(songId: string) {
    try {
      const response = await api.post(`/api/songs/${songId}/like`);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  static async unlikeSong(songId: string) {
    try {
      const response = await api.post(`/api/songs/${songId}/unlike`);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  static async getLikedSongs() {
    try {
      const response = await api.get("/api/songs/liked");
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }
}
