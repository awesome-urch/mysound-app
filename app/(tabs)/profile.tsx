import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useAuth } from "../contexts/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function Profile() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const menuItems = [
    {
      icon: "person-outline",
      title: "Edit Profile",
    //   onPress: () => router.push("/profile/edit"),
    },
    {
      icon: "musical-notes-outline",
      title: "My Purchases",
    //   onPress: () => router.push("/purchases"),
    },
    {
      icon: "heart-outline",
      title: "Liked Songs",
    //   onPress: () => router.push("/liked-songs"),
    },
    {
      icon: "people-outline",
      title: "Following",
    //   onPress: () => router.push("/following"),
    },
    {
      icon: "settings-outline",
      title: "Settings",
    //   onPress: () => router.push("/settings"),
    },
    {
      icon: "log-out-outline",
      title: "Logout",
      onPress: handleLogout,
      danger: true,
    },
  ];

  if (!user) return null;

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Image
            source={{
              uri:
                user.image || "https://ui-avatars.com/api/?name=" + user.name,
            }}
            style={styles.avatar}
          />
          <TouchableOpacity style={styles.editAvatarButton}>
            <Ionicons name="camera-outline" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.email}>{user.email}</Text>
      </View>

      {/* Stats Section */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>Following</Text>
        </View>
        <View style={[styles.statItem, styles.statBorder]}>
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>Purchases</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>Liked Songs</Text>
        </View>
      </View>

      {/* Menu Items */}
      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={item.onPress}
          >
            <View style={styles.menuItemContent}>
              <Ionicons
                name={item.icon as any}
                size={24}
                color={item.danger ? "#EF4444" : "#fff"}
              />
              <Text
                style={[
                  styles.menuItemText,
                  item.danger && styles.menuItemTextDanger,
                ]}
              >
                {item.title}
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={item.danger ? "#EF4444" : "#666"}
            />
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#161616",
  },
  header: {
    alignItems: "center",
    padding: 24,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#282828",
  },
  editAvatarButton: {
    position: "absolute",
    right: 0,
    bottom: 0,
    backgroundColor: "#8B5CF6",
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#161616",
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: "#999",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#333",
    marginBottom: 24,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statBorder: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: "#333",
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: "#999",
  },
  menuContainer: {
    padding: 16,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: "#282828",
    marginBottom: 8,
    borderRadius: 12,
  },
  menuItemContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  menuItemText: {
    fontSize: 16,
    color: "#fff",
  },
  menuItemTextDanger: {
    color: "#EF4444",
  },
});
