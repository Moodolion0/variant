/**
 * Service pour uploader les images vers Cloudinary via le serveur Laravel
 * Pour utilisation dans l'admin (fournisseurs et admins)
 */

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api";

export const ImageUploadService = {
  /**
   * Uploader une image vers le serveur (pour Cloudinary)
   * @param {File} file Fichier sélectionné
   * @param {number} productId ID du produit
   * @param {string} token Token d'authentification
   * @returns {Promise<Object>} Données de l'image uploadée
   */
  async uploadProductImage(file, productId, token) {
    try {
      if (!file) {
        throw new Error("Aucun fichier sélectionné");
      }

      if (
        !["image/jpeg", "image/png", "image/webp", "image/gif"].includes(
          file.type,
        )
      ) {
        throw new Error(
          "Format d'image invalide. Acceptés: JPEG, PNG, WebP, GIF",
        );
      }

      if (file.size > 5 * 1024 * 1024) {
        throw new Error("Fichier trop volumineux. Maximum: 5MB");
      }

      // Créer un FormData
      const formData = new FormData();
      formData.append("image", file);

      // Envoyer la requête
      const response = await fetch(
        `${API_URL}/admin/products/${productId}/images`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
          body: formData,
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erreur lors de l'upload");
      }

      return data.data;
    } catch (error) {
      console.error("Erreur lors de l'upload de l'image:", error);
      throw error;
    }
  },

  /**
   * Récupérer les images d'un produit
   */
  async getProductImages(productId, token) {
    try {
      const response = await fetch(
        `${API_URL}/admin/products/${productId}/images`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Erreur lors de la récupération des images",
        );
      }

      return data.data || [];
    } catch (error) {
      console.error("Erreur lors de la récupération des images:", error);
      throw error;
    }
  },

  /**
   * Supprimer une image
   */
  async deleteImage(imageId, token) {
    try {
      const response = await fetch(`${API_URL}/admin/images/${imageId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erreur lors de la suppression");
      }

      return data;
    } catch (error) {
      console.error("Erreur lors de la suppression de l'image:", error);
      throw error;
    }
  },

  /**
   * Générer une URL transformée pour thumbnail, card, detail
   * Insère les paramètres de transformation dans l'URL Cloudinary
   */
  getTransformedUrl(cloudinaryUrl, transformation = "thumb") {
    if (!cloudinaryUrl) return null;

    const transformations = {
      thumb: "c_fill,h_200,w_200,q_auto",
      detail: "c_fill,h_800,w_800,q_auto",
      card: "c_fill,h_300,w_300,q_auto",
      admin: "c_fill,h_150,w_150,q_auto",
    };

    const trans = transformations[transformation] || transformations.thumb;

    // Si l'URL contient /upload/, insérer les transformations juste après
    if (cloudinaryUrl.includes("/upload/")) {
      return cloudinaryUrl.replace("/upload/", `/upload/${trans}/`);
    }

    return cloudinaryUrl;
  },

  /**
   * Convertir un fichier sélectionné en données URL (pour aperçu)
   */
  async fileToDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  },

  /**
   * Valider un fichier image
   */
  validateImageFile(file) {
    const errors = [];

    if (!file) {
      errors.push("Aucun fichier sélectionné");
    } else {
      if (
        !["image/jpeg", "image/png", "image/webp", "image/gif"].includes(
          file.type,
        )
      ) {
        errors.push("Format invalide. Acceptés: JPEG, PNG, WebP, GIF");
      }
      if (file.size > 5 * 1024 * 1024) {
        errors.push("Fichier > 5MB");
      }
      if (file.size < 1024) {
        errors.push("Fichier trop petit (min 1KB)");
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  },
};
