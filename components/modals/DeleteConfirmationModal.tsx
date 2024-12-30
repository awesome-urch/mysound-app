import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
  playlistName: string;
}

export default function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
  playlistName,
}: DeleteConfirmationModalProps) {
  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/70 justify-center items-center px-4">
        <View className="bg-surface rounded-xl p-6 w-full max-w-sm">
          <View className="items-center">
            <View className="w-16 h-16 rounded-full bg-red-500/10 items-center justify-center mb-4">
              <Ionicons name="warning-outline" size={32} color="#ef4444" />
            </View>

            <Text className="text-text-primary text-xl font-semibold mb-2">
              Delete Playlist?
            </Text>

            <Text className="text-text-secondary text-center mb-6">
              Are you sure you want to delete "{playlistName}"? This action
              cannot be undone.
            </Text>

            <View className="flex-row gap-3 w-full">
              <TouchableOpacity
                onPress={onClose}
                disabled={isLoading}
                className="flex-1 px-4 py-3 rounded-lg bg-surface-elevated"
              >
                <Text className="text-text-secondary text-center">Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={onConfirm}
                disabled={isLoading}
                className="flex-1 px-4 py-3 rounded-lg bg-red-500 
                          disabled:opacity-50 items-center justify-center"
              >
                {isLoading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white">Delete</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}
