import * as ImagePicker from "expo-image-picker";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ImageUploadService } from "../services/ImageUploadService";

/**
 * Gestionnaire d'images pour produits (Admin) - React Native pour Web + Mobile
 */
export default function ProductImageManager({
  productId,
  token,
  onImagesUpdate,
}) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (productId && token) {
      loadImages();
    }
  }, [productId, token]);

  const loadImages = async () => {
    try {
      setLoading(true);
      const data = await ImageUploadService.getProductImages(productId, token);
      setImages(data);
      if (onImagesUpdate) onImagesUpdate(data);
    } catch (error) {
      console.error("Load error:", error);
      setImages([]);
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission", "Gallery permission required");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        await uploadImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission", "Camera permission required");
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        await uploadImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const uploadImage = async (imageUri) => {
    try {
      setUploading(true);

      // Convertir URI en File pour upload
      const response = await fetch(imageUri);
      const blob = await response.blob();
      const filename = imageUri.split("/").pop() || "image.jpg";

      // Créer un File object
      const file = new File([blob], filename, { type: blob.type });

      const uploadedImage = await ImageUploadService.uploadProductImage(
        file,
        productId,
        token
      );

      const newImages = [...images, uploadedImage];
      setImages(newImages);
      if (onImagesUpdate) onImagesUpdate(newImages);

      Alert.alert("Success", "Image uploaded");
    } catch (error) {
      Alert.alert("Upload error", error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = (imageId) => {
    Alert.alert("Delete", "Sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            setLoading(true);
            await ImageUploadService.deleteImage(imageId, token);
            const newImages = images.filter((img) => img.id !== imageId);
            setImages(newImages);
            if (onImagesUpdate) onImagesUpdate(newImages);
          } catch (error) {
            Alert.alert("Error", error.message);
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };

  if (!token) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>❌ Not authenticated</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>📸 Images ({images.length})</Text>

      {/* Action Buttons */}
      <View style={styles.buttonGroup}>
        <TouchableOpacity
          style={[styles.btn, styles.btnGallery]}
          onPress={pickImage}
          disabled={uploading}
        >
          <MaterialCommunityIcons
            name="image-search"
            size={18}
            color="#fff"
          />
          <Text style={styles.btnText}>Gallery</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btn, styles.btnCamera]}
          onPress={takePhoto}
          disabled={uploading}
        >
          <MaterialCommunityIcons name="camera" size={18} color="#fff" />
          <Text style={styles.btnText}>Photo</Text>
        </TouchableOpacity>
      </View>

      {uploading && (
        <View style={styles.uploadingContainer}>
          <ActivityIndicator size="small" color="#19b3e6" />
          <Text style={styles.uploadingText}>Uploading...</Text>
        </View>
      )}

      {/* Images Grid */}
      {loading ? (
        <ActivityIndicator size="large" color="#19b3e6" style={{ marginTop: 20 }} />
      ) : images.length === 0 ? (
        <View style={styles.emptyState}>
          <MaterialCommunityIcons name="image-off" size={40} color="#ccc" />
          <Text style={styles.emptyText}>No images</Text>
        </View>
      ) : (
        <View style={styles.imageGrid}>
          {images.map((img) => (
            <View key={img.id} style={styles.imageCard}>
              <Image
                source={{
                  uri: ImageUploadService.getTransformedUrl(
                    img.file_url,
                    "admin"
                  ),
                }}
                style={styles.image}
              />
              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => handleDelete(img.id)}
              >
                <MaterialCommunityIcons name="delete" size={14} color="#fff" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
    color: "#111618",
  },
  buttonGroup: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  btn: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  btnGallery: {
    backgroundColor: "#19b3e6",
  },
  btnCamera: {
    backgroundColor: "#38a169",
  },
  btnText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 13,
  },
  uploadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#f0f9ff",
    borderRadius: 6,
    marginBottom: 12,
  },
  uploadingText: {
    color: "#19b3e6",
    fontWeight: "600",
    fontSize: 13,
  },
  imageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  imageCard: {
    width: "31%",
    aspectRatio: 1,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#f0f0f0",
    position: "relative",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  deleteBtn: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: "rgba(239, 68, 68, 0.9)",
    borderRadius: 12,
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 24,
    backgroundColor: "#f6f7f8",
    borderRadius: 6,
  },
  emptyText: {
    color: "#637f88",
    fontSize: 13,
    marginTop: 8,
  },
  errorContainer: {
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  errorText: {
    color: "#ef4444",
    fontWeight: "600",
    fontSize: 14,
  },
});
