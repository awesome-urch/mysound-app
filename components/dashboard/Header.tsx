import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { useAuth } from "../../app/contexts/AuthContext";
import { Ionicons } from "@expo/vector-icons";

export default function Header() {
  const { user } = useAuth();

  const getInitials = (name: string) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  return (
    <View style={styles.header}>
      {/* Logo */}
      <Image
        source={require("../../assets/images/logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      {/* Right Section */}
      <View style={styles.rightSection}>
        <TouchableOpacity style={styles.searchButton}>
          <Ionicons name="search" size={24} color="#fff" />
        </TouchableOpacity>

        {user?.picture ? (
          <Image source={{ uri: user.picture }} style={styles.profilePic} />
        ) : (
          <View style={styles.initialsContainer}>
            <Text style={styles.initials}>{getInitials(user?.name)}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 60,
    backgroundColor: "#161616",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#282828",
  },
  logo: {
    height: 30,
    width: 120,
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#282828",
    alignItems: "center",
    justifyContent: "center",
  },
  profilePic: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  initialsContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#8B5CF6",
    alignItems: "center",
    justifyContent: "center",
  },
  initials: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
});
