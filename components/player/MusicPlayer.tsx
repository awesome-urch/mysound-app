import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Modal,
  Platform,
} from "react-native";
import { Audio, AVPlaybackStatus } from "expo-av";
import Slider from "@react-native-community/slider";
import { Ionicons } from "@expo/vector-icons";
import { usePlayerStore } from "@/utils/playerStore";

const { width } = Dimensions.get("window");
const PREVIEW_DURATION = 30; // 30 seconds

export default function CustomMusicPlayer() {
  const {
    currentSong,
    playlist,
    currentIndex,
    albumPurchaseStatus,
    setCurrentSong,
    setCurrentIndex,
  } = usePlayerStore();

  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize audio session
  useEffect(() => {
    setupAudioSession();
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  // Handle song changes
  useEffect(() => {
    if (currentSong) {
      loadAndPlaySong();
      console.log(currentSong, albumPurchaseStatus);
    }
  }, [currentSong]);

  const setupAudioSession = async () => {
    try {
      await Audio.setAudioModeAsync({
        staysActiveInBackground: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
        // Remove the interruption modes since they're not needed
      });
    } catch (error) {
      console.error("Error setting up audio session:", error);
    }
  };

  const loadAndPlaySong = async () => {
    try {
      setIsLoading(true);

      // Unload previous sound
      if (sound) {
        await sound.unloadAsync();
      }

      // Reset states before loading new song
      setPosition(0);
      setDuration(0);
      setIsPlaying(false);

      // Create new sound object
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: currentSong!.file },
        {
          shouldPlay: false,
          progressUpdateIntervalMillis: 500, // Update every 500ms
          positionMillis: 0,
          rate: 1.0,
          shouldCorrectPitch: true,
          volume: 1.0,
        },
        onPlaybackStatusUpdate
      );

      setSound(newSound);

      // Get initial status to set duration
      const status = await newSound.getStatusAsync();
      if (status.isLoaded) {
        const totalDuration = status.durationMillis
          ? status.durationMillis / 1000
          : 0;
        setDuration(totalDuration);
        console.log("Initial duration:", totalDuration); // Debug log
      }

      // Start playing
      await newSound.playAsync();
      setIsPlaying(true);
    } catch (error) {
      console.error("Error loading song:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (!status.isLoaded) {
      console.log("Status not loaded"); // Debug log
      return;
    }

    // Log current status for debugging
    console.log("Playback status:", {
      position: status.positionMillis / 1000,
      duration: status.durationMillis ? status.durationMillis / 1000 : 0,
      isPlaying: status.isPlaying,
    });

    // Update duration if it's not set yet
    if (status.durationMillis && duration === 0) {
      setDuration(status.durationMillis / 1000);
    }

    const currentPosition = status.positionMillis / 1000;

    if (albumPurchaseStatus) {
      // For purchased songs, update position normally
      setPosition(currentPosition);
    } else {
      // For preview mode
      if (currentPosition >= PREVIEW_DURATION && status.isPlaying) {
        setShowPreviewModal(true);
        sound?.stopAsync();
        setPosition(0);
        setIsPlaying(false);
      } else {
        setPosition(Math.min(currentPosition, PREVIEW_DURATION));
      }
    }
  };

  const handleCloseModal = async () => {
    try {
      if (sound) {
        await sound.setPositionAsync(0);
        await sound.stopAsync();
        setPosition(0);
      }
      setShowPreviewModal(false);
    } catch (error) {
      console.error("Error resetting position:", error);
      setShowPreviewModal(false);
    }
  };

  //   const handleCloseModal = async () => {
  //     setShowPreviewModal(false);
  //     try {
  //       if (sound) {
  //         await sound.stopAsync();
  //         await sound.setPositionAsync(0);
  //         setPosition(0);
  //       }
  //     } catch (error) {
  //       console.error("Error resetting audio:", error);
  //     }
  //   };

  const handleSongEnd = async () => {
    if (!sound) return;

    try {
      if (albumPurchaseStatus) {
        // Play next song if available
        if (currentIndex < playlist.length - 1) {
          skipToNext();
        } else {
          // Reset current song
          const status = await sound.getStatusAsync();
          if (status.isLoaded) {
            await sound.setPositionAsync(0);
            setIsPlaying(false);
          }
        }
      } else {
        // await handlePreviewEnd();
      }
    } catch (error) {
      console.error("Error in handleSongEnd:", error);
    }
  };

  const togglePlayback = async () => {
    if (!sound) {
      // If sound was unloaded (after preview), reload it
      await loadAndPlaySong();
      return;
    }

    try {
      const status = await sound.getStatusAsync();
      if (!status.isLoaded) {
        await loadAndPlaySong();
        return;
      }

      if (isPlaying) {
        await sound.pauseAsync();
      } else {
        if (!albumPurchaseStatus && position >= PREVIEW_DURATION) {
          // For preview mode, start from beginning if at preview end
          await sound.setPositionAsync(0);
          setPosition(0);
        }
        await sound.playAsync();
      }
      setIsPlaying(!isPlaying);
    } catch (error) {
      console.error("Error toggling playback:", error);
    }
  };

  const skipToNext = () => {
    if (currentIndex < playlist.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setCurrentSong(playlist[currentIndex + 1]);
    }
  };

  const skipToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setCurrentSong(playlist[currentIndex - 1]);
    }
  };

  const handleSeek = async (value: number) => {
    if (!sound) return;

    try {
      if (!albumPurchaseStatus && value > PREVIEW_DURATION) {
        await sound.pauseAsync();
        setIsPlaying(false);
        setShowPreviewModal(true);
        return;
      }
      await sound.setPositionAsync(value * 1000);
    } catch (error) {
      console.error("Error seeking:", error);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (!currentSong) return null;

  return (
    <>
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.songInfo}>
            <Image
              source={{ uri: currentSong.cover_image }}
              style={styles.artwork}
            />
            <View style={styles.textContainer}>
              <Text style={styles.title} numberOfLines={1}>
                {currentSong.title}
              </Text>
              <Text style={styles.artist} numberOfLines={1}>
                {currentSong.artist_name}
              </Text>
            </View>
          </View>

          <View style={styles.controls}>
            <TouchableOpacity onPress={skipToPrevious}>
              <Ionicons name="play-skip-back" size={24} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={togglePlayback}
              style={[
                styles.playButton,
                isLoading && styles.playButtonDisabled,
              ]}
              disabled={isLoading}
            >
              <Ionicons
                name={isPlaying ? "pause" : "play"}
                size={30}
                color="#fff"
              />
            </TouchableOpacity>

            <TouchableOpacity onPress={skipToNext}>
              <Ionicons name="play-skip-forward" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.progressContainer}>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={albumPurchaseStatus ? duration : PREVIEW_DURATION}
            value={position}
            onSlidingComplete={handleSeek}
            minimumTrackTintColor="#8B5CF6"
            maximumTrackTintColor="#4B5563"
            thumbTintColor="#8B5CF6"
            // enabled={!isLoading}
          />
          <View style={styles.timeContainer}>
            <Text style={styles.time}>{formatTime(position)}</Text>
            <Text style={styles.time}>
              {formatTime(albumPurchaseStatus ? duration : PREVIEW_DURATION)}
            </Text>
          </View>
        </View>
      </View>

      <Modal
        visible={showPreviewModal}
        transparent
        animationType="fade"
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Preview Ended</Text>
            <Text style={styles.modalText}>
              You've reached the end of the preview. Purchase the album to enjoy
              the full track!
            </Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleCloseModal}
            >
              <Text style={styles.modalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 60,
    width: width,
    backgroundColor: "#282828",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#333",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  songInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  artwork: {
    width: 48,
    height: 48,
    borderRadius: 4,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  artist: {
    color: "#999",
    fontSize: 14,
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 24,
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#8B5CF6",
    justifyContent: "center",
    alignItems: "center",
  },
  playButtonDisabled: {
    opacity: 0.5,
  },
  progressContainer: {
    marginTop: 12,
  },
  slider: {
    width: "100%",
    height: 40,
  },
  timeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: -8,
  },
  time: {
    color: "#999",
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  modalContent: {
    backgroundColor: "#282828",
    borderRadius: 16,
    padding: 24,
    width: "80%",
    maxWidth: 400,
  },
  modalTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 12,
  },
  modalText: {
    color: "#999",
    fontSize: 16,
    marginBottom: 24,
    lineHeight: 24,
  },
  modalButton: {
    backgroundColor: "#8B5CF6",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  modalPrimaryButton: {
    backgroundColor: "#8B5CF6",
  },
  modalSecondaryButton: {
    backgroundColor: "#3F3F46",
  },
});
