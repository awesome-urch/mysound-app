import { create } from "zustand";

export interface Song {
  id: string;
  title: string;
  artist_id: string;
  album_id: string | null;
  duration: number;
  file: string;
  release_date: string;
  cover_image: string;
  lyrics: string;
  created_at: string;
  updated_at: string;
  type: string;
  artist_name: string;
  play_count: number;
  is_liked: boolean;
  artist: {
    id: string;
    name: string;
    bio: string;
    image: string;
    instagram: string | null;
    facebook: string | null;
    twitter: string | null;
    link: string | null;
  };
}

interface PlayerState {
  currentSong: Song | null;
  isPlaying: boolean;
  playlist: Song[];
  currentIndex: number;
  albumPurchaseStatus: boolean;
  setCurrentSong: (song: Song) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setPlaylist: (playlist: Song[]) => void;
  setCurrentIndex: (index: number) => void;
  setAlbumPurchaseStatus: (status: boolean) => void;
}

export const usePlayerStore = create<PlayerState>((set) => ({
  currentSong: null,
  isPlaying: false,
  playlist: [],
  currentIndex: 0,
  albumPurchaseStatus: false,
  setCurrentSong: (song) => set({ currentSong: song }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setPlaylist: (playlist) => set({ playlist }),
  setCurrentIndex: (index) => set({ currentIndex: index }),
  setAlbumPurchaseStatus: (status) => set({ albumPurchaseStatus: status }),
}));
