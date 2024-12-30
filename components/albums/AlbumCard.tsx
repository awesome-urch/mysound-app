import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

type AlbumCardProps = {
  album: {
    id: string;
    name: string;
    image: string;
  };
};

export default function AlbumCard({ album }: AlbumCardProps) {
  return (
    <Link href={`/albums/${album.id}`} asChild>
      <TouchableOpacity style={styles.container}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: album.image }} style={styles.image} />
          <View style={styles.overlay}>
            <View style={styles.playButton}>
              <Ionicons name="musical-note" size={20} color="#000" />
            </View>
          </View>
        </View>
        <Text style={styles.title} numberOfLines={2}>
          {album.name}
        </Text>
      </TouchableOpacity>
    </Link>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 150,
    marginRight: 12,
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    aspectRatio: 1,
    marginBottom: 8,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    borderRadius: 12,
    opacity: 0,
  },
  playButton: {
    position: "absolute",
    bottom: 8,
    right: 8,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 14,
    fontWeight: "500",
    color: "#fff",
  },
});
