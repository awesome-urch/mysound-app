import api from "../utils/api";

const TOKEN = `Bearer ${process.env.EXPO_PUBLIC_LIFETIME_TOKEN}`;

export default class ArtistService {
  static async getArtists() {
    try {
      const response = await api.get("/api/artists");
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  static async getArtistById(artistId: string) {
    try {
      const response = await api.get(`/api/artists/${artistId}`);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  static async getArtistByIdPublic(artistId: string) {
    try {
      const response = await api.get(`/api/artists/public/${artistId}`);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  static async getTrendingArtists() {
    try {
      const response = await api.get("/api/artists/trending-artists");
      return response.data.data;
    } catch (error: any) {
      throw error;
    }
  }

  static async getTopArtists(limit = 20) {
    try {
      const response = await api.get(`/api/artists/top-artists?limit=${limit}`);
      return response.data.data;
    } catch (error: any) {
      throw error;
    }
  }

  static async getArtistSongs(artistId: string) {
    try {
      const response = await api.get(`/api/songs/artist/${artistId}`);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  static async getArtistSongsPublic(artistId: string) {
    try {
      const response = await api.get(`/api/songs/artist/public/${artistId}`);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  static async getArtistEvent(artistId: string) {
    try {
      const response = await api.get(`/api/artist/${artistId}/events`);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  static async getArtistsFollowedByUser() {
    try {
      const response = await api.get(`/api/follow/artists`);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  static async followArtist(artistId: string) {
    try {
      const response = await api.post(`/api/follow/artist`, {
        artist_id: artistId,
      });
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  static async unfollowArtist(artistId: string) {
    try {
      const response = await api.post(`/api/artist/unfollow`, {
        artist_id: artistId,
      });
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  static async checkFollowStatus(artistId: string) {
    try {
      const response = await api.get(`/api/artist/${artistId}/following`);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  static async checkFollowStatusPublic(artistId: string) {
    try {
      const response = await api.get(
        `/api/artist/public/${artistId}/following`
      );
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  static async getArtistAlbums(artistId: string) {
    try {
      const response = await api.get(`/api/artist/${artistId}/albums`);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }
}
