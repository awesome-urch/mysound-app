import axiosInstance from "../utils/api";

export default class LikeService {
  static async getUserLikedSongs() {
    try {
      const response = await axiosInstance.get("/api/liked/songs");
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  static async likeSongs(songId: string) {
    try {
      const response = await axiosInstance.post("/api/like/song", {
        song_id: songId,
      });
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }
}
