import {
    View,
    Text,
    ScrollView,
    Image,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    ViewStyle,
    TextStyle,
    ImageStyle,
  } from "react-native";
  import { useState, useEffect } from "react";
  import { useRouter } from "expo-router";
  import ChartsService from "../../services/charts";
  
  const { width } = Dimensions.get("window");
  const ITEM_WIDTH = width * 0.4;
  
  interface Song {
    id: string;
    title: string;
    artist_name: string;
    cover_image: string;
    play_count: number;
  }
  
  export default function TopCharts() {
    const router = useRouter();
    const [songs, setSongs] = useState<Song[]>([]);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      fetchCharts();
    }, []);
  
    const fetchCharts = async () => {
      try {
        const response = await ChartsService.getChartsWith50Songs();
        setSongs(response?.data || []);
      } catch (error) {
        console.error("Error fetching charts:", error);
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Top Charts</Text>
        </View>
  
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {songs.slice(0, 6).map((song) => (
            <TouchableOpacity
              key={song.id}
              style={styles.songItem}
              // onPress={() => handlePlaySong(song)}
            >
              <View style={styles.imageContainer}>
                <Image 
                  source={{ uri: song.cover_image }} 
                  style={styles.songImage} 
                />
                <View style={styles.playCountContainer}>
                  <Text style={styles.playCount}>
                    {song.play_count || 0} plays
                  </Text>
                </View>
              </View>
              <Text style={styles.songTitle} numberOfLines={1}>
                {song.title}
              </Text>
              <Text style={styles.songArtist} numberOfLines={1}>
                {song.artist_name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  }
  
  interface Styles {
    container: ViewStyle;
    header: ViewStyle;
    title: TextStyle;
    scrollContent: ViewStyle;
    songItem: ViewStyle;
    imageContainer: ViewStyle;
    songImage: ImageStyle;
    playCountContainer: ViewStyle;
    playCount: TextStyle;
    songTitle: TextStyle;
    songArtist: TextStyle;
  }
  
  const styles = StyleSheet.create<Styles>({
    container: {
      paddingVertical: 16,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
      paddingHorizontal: 16,
    },
    title: {
      fontSize: 20,
      fontWeight: "bold",
      color: "#fff",
    },
    scrollContent: {
      paddingHorizontal: 16,
    },
    songItem: {
      width: ITEM_WIDTH,
      marginRight: 12,
      backgroundColor: "#282828",
      borderRadius: 8,
      padding: 12,
    },
    imageContainer: {
      width: "100%",
      aspectRatio: 1,
      marginBottom: 8,
      borderRadius: 4,
      overflow: "hidden",
      position: "relative",
    },
    songImage: {
      width: "100%",
      height: "100%",
    },
    playCountContainer: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: "rgba(0,0,0,0.6)",
      padding: 4,
    },
    playCount: {
      color: "#fff",
      fontSize: 12,
      textAlign: "center",
    },
    songTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: "#fff",
      marginBottom: 4,
    },
    songArtist: {
      fontSize: 14,
      color: "#999",
    },
  });