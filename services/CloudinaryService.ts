import { Platform } from "react-native";

export default class CloudinaryService {
  static async uploadFile(imageFile: any, resourceType = "auto") {
    try {
      const formData = new FormData();

      if (Platform.OS === "web") {
        // For web, just append the file directly
        formData.append("file", imageFile);
      } else {
        // For native platforms, create a file-like object
        formData.append("file", {
          uri: imageFile.uri,
          type: "image/jpeg",
          name: "upload.jpg",
        } as any);
      }

      formData.append(
        "upload_preset",
        'mysound'
      );

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/dna7tnokp/${resourceType}/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error("Upload error response:", data);
        throw new Error(data.error?.message || "Upload failed");
      }

      return data.secure_url;
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      throw error;
    }
  }
}
