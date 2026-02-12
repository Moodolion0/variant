/**
 * Types pour les services d'image et Cloudinary
 */

// Types pour les images de produits
export interface ProductImage {
  id: number;
  product_id: number;
  file_url: string;
  cloudinary_public_id: string;
  width: number | null;
  height: number | null;
  created_at: string;
  updated_at: string;
}

// Réponse d'upload
export interface UploadResponse {
  success: boolean;
  message: string;
  data: ProductImage;
}

// Options de transformation Cloudinary
export interface TransformationOptions {
  width?: number;
  height?: number;
  crop?: "fill" | "fit" | "crop" | "pad" | "lfill";
  quality?: "auto" | string;
  format?: string;
  fetch_format?: string;
}

// Résultat d'upload Cloudinary (depuis le service)
export interface CloudinaryUploadResult {
  success: boolean;
  url?: string;
  public_id?: string;
  width?: number;
  height?: number;
  error?: string;
}

// Props pour composants affichant des images
export interface ImageDisplayProps {
  imageUrl: string;
  width?: number;
  height?: number;
  transformation?: "thumb" | "detail" | "card";
  placeholder?: string;
}
