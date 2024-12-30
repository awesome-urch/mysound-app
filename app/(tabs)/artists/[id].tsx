import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import ArtistService from "@/services/artist";
import AlbumCard from "@/components/albums/AlbumCard";
import SongCard from "@/components/songs/SongCard";
import DonateModal from "@/components/modals/DonateModal";
import PaymentModal from "@/components/modals/PaymentModal";
import { useAuth } from "@/app/contexts/AuthContext";

export default function ArtistProfile() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();

  const [artist, setArtist] = useState<any>({});
  const [artistSongs, setArtistSongs] = useState<any>([]);
  const [artistEvents, setArtistEvents] = useState<any>([]);
  const [albums, setAlbums] = useState<any>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [showDonateModal, setShowDonateModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [donationAmount, setDonationAmount] = useState("");

  useEffect(() => {
    if (!user) {
      router.replace("/login");
      return;
    }
    loadArtistData();
  }, [id]);

  const loadArtistData = async () => {
    try {
      const [artistData, songsData, albumsData, followStatus] =
        await Promise.all([
          ArtistService.getArtistById(id as string),
          ArtistService.getArtistSongs(id as string),
          ArtistService.getArtistAlbums(id as string),
          ArtistService.checkFollowStatus(id as string),
        ]);
      console.log(followStatus?.data?.isFollowing);
      setArtist(artistData.data);
      setArtistSongs(songsData.data);
      setAlbums(albumsData.data);
      setIsFollowing(followStatus?.data?.isFollowing);
    } catch (error) {
      console.error("Error loading artist data:", error);
    }
  };

  const handleFollow = async () => {
    try {
      if (isFollowing) {
        await ArtistService.unfollowArtist(id as string);
      } else {
        await ArtistService.followArtist(id as string);
      }
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error("Error following/unfollowing artist:", error);
    }
  };

  const handleSocialLink = (url: string) => {
    if (url) Linking.openURL(url);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Hero Section */}
      <View style={styles.heroSection}>
        <Image source={{ uri: artist.image }} style={styles.heroImage} />
        <View style={styles.heroOverlay}>
          <Text style={styles.artistName}>{artist.name}</Text>

          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.followButton}
              onPress={handleFollow}
            >
              <Text style={styles.buttonText}>
                {isFollowing ? "Unfollow" : "Follow"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.donateButton}
              onPress={() => setShowDonateModal(true)}
            >
              <Text style={styles.buttonText}>Fund Artist</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* About Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <Text style={styles.bioText}>{artist.bio}</Text>

        <View style={styles.socialLinks}>
          {artist.instagram && (
            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => handleSocialLink(artist.instagram)}
            >
              <FontAwesome name="instagram" size={24} color="#fff" />
            </TouchableOpacity>
          )}
          {/* Add other social buttons similarly */}
        </View>
      </View>

      {/* Latest Release */}
      {artistSongs.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Latest Release</Text>
          <SongCard song={artistSongs[0]} />
        </View>
      )}

      {/* Albums */}
      {albums.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Popular Albums</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {albums.map((album: any) => (
              <AlbumCard key={album.id} album={album} />
            ))}
          </ScrollView>
        </View>
      )}

      {/* Modals */}
      <DonateModal
        visible={showDonateModal}
        onClose={() => setShowDonateModal(false)}
        onSubmit={(amount: any) => {
          setDonationAmount(amount);
          setShowDonateModal(false);
          setShowPaymentModal(true);
        }}
        artistName={artist.name}
      />

      <PaymentModal
        visible={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        amount={Number(donationAmount)}
        artistId={artist.id}
        type="tip_artist"
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#161616",
  },
  heroSection: {
    height: 400,
    position: "relative",
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  heroOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  artistName: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 16,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
  },
  followButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  donateButton: {
    backgroundColor: "#8B5CF6",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  section: {
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 16,
  },
  bioText: {
    color: "#999",
    lineHeight: 24,
    marginBottom: 16,
  },
  socialLinks: {
    flexDirection: "row",
    gap: 12,
  },
  socialButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#282828",
    alignItems: "center",
    justifyContent: "center",
  },
});
