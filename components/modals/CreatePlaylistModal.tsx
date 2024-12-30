import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  ActivityIndicator,
  Platform,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { toast } from "@/utils/toast";

interface CreatePlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLoading: boolean;
  onSubmit: (playlistData: {
    name: string;
    description: string;
    image: any;
  }) => Promise<void>;
}

export default function CreatePlaylistModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}: CreatePlaylistModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: null as any,
  });
  const [formErrors, setFormErrors] = useState({
    name: "",
    description: "",
    image: "",
  });

  const handleSubmit = () => {
    // Validate form
    const errors = {
      name: "",
      description: "",
      image: "",
    };

    if (!formData.name.trim()) {
      errors.name = "Playlist name is required";
    }
    if (!formData.description.trim()) {
      errors.description = "Description is required";
    }
    if (!formData.image) {
      errors.image = "Please upload an image";
    }

    if (errors.name || errors.description || errors.image) {
      setFormErrors(errors);
      return;
    }

    onSubmit(formData);
  };

  const handleClose = () => {
    setFormData({ name: "", description: "", image: null });
    setFormErrors({ name: "", description: "", image: "" });
    onClose();
  };

  const pickImage = async () => {
    try {
      if (Platform.OS !== "web") {
        // Request permissions for mobile devices
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          toast.error(
            "Sorry, we need camera roll permissions to make this work!"
          );
          return;
        }

        // Launch the image picker
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });

        if (!result.canceled) {
          // Check file size (limit to 5MB)
          const response = await fetch(result.assets[0].uri);
          const blob = await response.blob();
          const fileSize = blob.size;

          if (fileSize > 5 * 1024 * 1024) {
            toast.error("Image size should be less than 5MB");
            return;
          }

          setFormData({ ...formData, image: result.assets[0] });
          setFormErrors({ ...formErrors, image: "" });
        }
      }
    } catch (error) {
      toast.error("Error picking image");
    }
  };

  return (
    <Modal
      visible={isOpen}
      animationType="slide"
      transparent
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Create New Playlist</Text>
            <TouchableOpacity
              onPress={handleClose}
              disabled={isLoading}
              style={styles.closeButton}
            >
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Image Upload */}
          <TouchableOpacity
            onPress={pickImage}
            disabled={isLoading}
            style={styles.imageUploadContainer}
          >
            <Text style={styles.label}>Playlist Cover</Text>
            <View
              style={[
                styles.imageContainer,
                formErrors.image && styles.errorBorder,
              ]}
            >
              {formData.image ? (
                <Image
                  source={{ uri: formData.image.uri }}
                  style={styles.image}
                />
              ) : (
                <View style={styles.placeholderContainer}>
                  <Ionicons
                    name="image-outline"
                    size={40}
                    color="#666"
                    style={styles.placeholderIcon}
                  />
                  <Text style={styles.placeholderText}>
                    Tap to upload image
                  </Text>
                </View>
              )}
            </View>
            {formErrors.image ? (
              <Text style={styles.errorText}>{formErrors.image}</Text>
            ) : null}
          </TouchableOpacity>

          {/* Form Fields */}
          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Playlist Name</Text>
              <TextInput
                value={formData.name}
                onChangeText={(text) => {
                  setFormData({ ...formData, name: text });
                  if (formErrors.name) {
                    setFormErrors({ ...formErrors, name: "" });
                  }
                }}
                placeholder="Enter playlist name"
                placeholderTextColor="#666"
                style={[styles.input, formErrors.name && styles.errorBorder]}
                editable={!isLoading}
              />
              {formErrors.name ? (
                <Text style={styles.errorText}>{formErrors.name}</Text>
              ) : null}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                value={formData.description}
                onChangeText={(text) => {
                  setFormData({ ...formData, description: text });
                  if (formErrors.description) {
                    setFormErrors({ ...formErrors, description: "" });
                  }
                }}
                placeholder="Describe your playlist"
                placeholderTextColor="#666"
                multiline
                numberOfLines={4}
                style={[
                  styles.input,
                  styles.textArea,
                  formErrors.description && styles.errorBorder,
                ]}
                editable={!isLoading}
              />
              {formErrors.description ? (
                <Text style={styles.errorText}>{formErrors.description}</Text>
              ) : null}
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={handleClose}
              disabled={isLoading}
              style={[styles.button, styles.cancelButton]}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={
                isLoading ||
                !formData.name ||
                !formData.description ||
                !formData.image
              }
              style={[styles.button, styles.submitButton]}
            >
              {isLoading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator color="white" style={styles.loader} />
                  <Text style={styles.submitButtonText}>Creating...</Text>
                </View>
              ) : (
                <Text style={styles.submitButtonText}>Create Playlist</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#18181B",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: "90%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  closeButton: {
    padding: 8,
  },
  imageUploadContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    color: "#A1A1AA",
    marginBottom: 8,
  },
  imageContainer: {
    height: 200,
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#3F3F46",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  placeholderContainer: {
    alignItems: "center",
  },
  placeholderIcon: {
    marginBottom: 8,
  },
  placeholderText: {
    color: "#A1A1AA",
    fontSize: 16,
  },
  formContainer: {
    gap: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    backgroundColor: "#27272A",
    borderRadius: 12,
    padding: 16,
    color: "#FFFFFF",
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  errorBorder: {
    borderWidth: 1,
    borderColor: "#EF4444",
    backgroundColor: "rgba(239, 68, 68, 0.1)",
  },
  errorText: {
    color: "#EF4444",
    fontSize: 14,
    marginTop: 4,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 24,
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    backgroundColor: "#27272A",
  },
  submitButton: {
    backgroundColor: "#8B5CF6",
    opacity: 1,
  },
  cancelButtonText: {
    color: "#A1A1AA",
    fontSize: 16,
    fontWeight: "500",
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  loader: {
    marginRight: 8,
  },
});
