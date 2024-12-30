import api from "../utils/api";

export default class AlbumService {
  static async getAlbums() {
    try {
      const response = await api.get("/api/albums");
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  static async getAlbumsOfArtist(artistId: string) {
    try {
      const response = await api.get(`/api/artist/${artistId}/albums`);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  static async getFavouritesAlbums(userId: string) {
    try {
      const response = await api.get(`/api/favorites/${userId}`);
      return response.data.data;
    } catch (error: any) {
      throw error;
    }
  }

  static async getNewAlbums() {
    try {
      const response = await api.get(`/api/albums/new-albums`);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  static async getTopAlbums() {
    try {
      const response = await api.get(`/api/albums/top`);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  static async getTrendingAlbums() {
    try {
      const response = await api.get(`/api/albums/trending`);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  static async getAlbumWithSongs(albumId: string) {
    try {
      const response = await api.get(`/api/album/songs/${albumId}`);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  static async getAlbumWithSongsPublic(albumId: string) {
    try {
      const response = await api.get(`/api/album/songs/${albumId}/public`);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  static async getAlbum(albumId: string) {
    try {
      const { data } = await api.get(`/api/albums/${albumId}`);
      return data;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  static async getAlbumPublic(albumId: string) {
    try {
      const { data } = await api.get(`/api/albums/${albumId}/public`);
      return data;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  static async purchaseAlbum(albumId: string, email?: string) {
    try {
      const { data } = await api.post(`/api/albums/purchase`, {
        album_id: albumId,
        email,
      });
      return data;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  static async purchaseAlbumPublic(albumId: string, email?: string) {
    try {
      const { data } = await api.post(`/api/public/albums/purchase`, {
        album_id: albumId,
        email,
      });
      return data;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}
