import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import moment from "moment";
import { usePlayerStore, Song } from "@/utils/playerStore";
import SongService from "@/services/song";

type SongCardProps = {
  song: Song;
  playlist?: Song[];
  index?: number;
  onLike?: () => void;
};

export default function SongCard({
  song,
  playlist = [],
  index = 0,
  onLike,
}: SongCardProps) {
  const { setCurrentSong, setPlaylist, setCurrentIndex, setIsPlaying } =
    usePlayerStore();

  const handlePlay = async () => {
    try {
      // Set the current song and its playlist context
      setCurrentSong(song);
      setPlaylist(playlist.length > 0 ? playlist : [song]);
      setCurrentIndex(index);
      setIsPlaying(true);

      // Track play count in the backend
      await SongService.playSong(song.id);
    } catch (error) {
      console.error("Error playing song:", error);
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePlay}>
      <View style={styles.content}>
        <Image source={{ uri: song.cover_image }} style={styles.image} />
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={1}>
            {song.title}
          </Text>
          <Text style={styles.artist} numberOfLines={1}>
            {song.artist_name}
          </Text>
          <Text style={styles.date}>
            {moment(song.created_at).format("YYYY")}
          </Text>
        </View>
      </View>

      <View style={styles.actions}>
        <View style={styles.playCount}>
          <Ionicons name="musical-note" size={16} color="#999" />
          <Text style={styles.playCountText}>{song.play_count}</Text>
        </View>

        <TouchableOpacity
          style={styles.likeButton}
          onPress={(e) => {
            e.stopPropagation();
            onLike?.();
          }}
        >
          <Ionicons
            name={song.is_liked ? "heart" : "heart-outline"}
            size={24}
            color={song.is_liked ? "#8B5CF6" : "#999"}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    backgroundColor: "#282828",
    borderRadius: 12,
    marginBottom: 8,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  image: {
    width: 56,
    height: 56,
    borderRadius: 8,
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "500",
    color: "#fff",
    marginBottom: 2,
  },
  artist: {
    fontSize: 14,
    color: "#999",
    marginBottom: 2,
  },
  date: {
    fontSize: 12,
    color: "#666",
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  playCount: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#161616",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  playCountText: {
    color: "#999",
    fontSize: 14,
  },
  likeButton: {
    padding: 8,
  },
});
