<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Product_image;
use App\Models\SupplierProduct;
use App\Models\SupplierProductImage;
use App\Services\CloudinaryService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ImageController extends Controller
{
    protected $cloudinaryService;

    public function __construct(CloudinaryService $cloudinaryService)
    {
        $this->cloudinaryService = $cloudinaryService;
    }

    /**
     * Upload une image pour un produit
     *
     * @param Request $request
     * @param Product $product
     * @return JsonResponse
     */
    public function uploadProductImage(Request $request, Product $product): JsonResponse
    {
        try {
            // Validation
            $request->validate([
                'image' => 'required|image|max:5120', // 5MB max
            ]);

            // Vérifier que le produit appartient au fournisseur authentifié
            if ($product->supplier_id !== auth()->user()->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Non autorisé',
                ], 403);
            }

            // Upload vers Cloudinary
            $uploadResult = $this->cloudinaryService->upload(
                $request->file('image'),
                'products'
            );

            if (!$uploadResult['success']) {
                return response()->json([
                    'success' => false,
                    'message' => 'Erreur lors de l\'upload: ' . $uploadResult['error'],
                ], 500);
            }

            // Sauvegarder en base de données
            $image = Product_image::create([
                'product_id' => $product->id,
                'file_url' => $uploadResult['url'],
                'cloudinary_public_id' => $uploadResult['public_id'],
                'width' => $uploadResult['width'],
                'height' => $uploadResult['height'],
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Image uploadée avec succès',
                'data' => $image,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Supprimer une image produit
     *
     * @param Product_image $image
     * @return JsonResponse
     */
    public function deleteProductImage(Product_image $image): JsonResponse
    {
        try {
            // Vérifier l'autorisation
            $product = $image->product;
            if ($product->supplier_id !== auth()->user()->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Non autorisé',
                ], 403);
            }

            // Supprimer de Cloudinary
            if ($image->cloudinary_public_id) {
                $this->cloudinaryService->delete($image->cloudinary_public_id);
            }

            // Supprimer de la base de données
            $image->delete();

            return response()->json([
                'success' => true,
                'message' => 'Image supprimée avec succès',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Récupérer toutes les images d'un produit (admin - sans restriction)
     *
     * @param Product $product
     * @return JsonResponse
     */
    public function getProductImagesAdmin(Product $product): JsonResponse
    {
        try {
            $images = $product->images()->get();

            return response()->json([
                'success' => true,
                'data' => $images,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Upload une image pour un produit (admin - sans restriction de fournisseur)
     *
     * @param Request $request
     * @param Product $product
     * @return JsonResponse
     */
    public function uploadProductImageAdmin(Request $request, Product $product): JsonResponse
    {
        try {
            // Validation
            $request->validate([
                'image' => 'required|image|max:5120', // 5MB max
            ]);

            // Upload vers Cloudinary
            $uploadResult = $this->cloudinaryService->upload(
                $request->file('image'),
                'products'
            );

            if (!$uploadResult['success']) {
                return response()->json([
                    'success' => false,
                    'message' => 'Erreur lors de l\'upload: ' . $uploadResult['error'],
                ], 500);
            }

            // Sauvegarder en base de données
            $image = Product_image::create([
                'product_id' => $product->id,
                'file_url' => $uploadResult['url'],
                'cloudinary_public_id' => $uploadResult['public_id'],
                'width' => $uploadResult['width'],
                'height' => $uploadResult['height'],
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Image uploadée avec succès',
                'data' => $image,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Supprimer une image produit (admin - sans restriction)
     *
     * @param Product_image $image
     * @return JsonResponse
     */
    public function deleteProductImageAdmin(Product_image $image): JsonResponse
    {
        try {
            // Supprimer de Cloudinary
            if ($image->cloudinary_public_id) {
                $this->cloudinaryService->delete($image->cloudinary_public_id);
            }

            // Supprimer de la base de données
            $image->delete();

            return response()->json([
                'success' => true,
                'message' => 'Image supprimée avec succès',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    // ========== Images pour les produits fournisseurs ==========

    /**
     * Upload une image pour un produit fournisseur
     *
     * @param Request $request
     * @param SupplierProduct $supplierProduct
     * @return JsonResponse
     */
    public function uploadSupplierProductImage(Request $request, SupplierProduct $supplierProduct): JsonResponse
    {
        try {
            $request->validate([
                'image' => 'required|image|max:5120',
            ]);

            // Upload vers Cloudinary
            $uploadResult = $this->cloudinaryService->upload(
                $request->file('image'),
                'supplier_products'
            );

            if (!$uploadResult['success']) {
                return response()->json([
                    'success' => false,
                    'message' => $uploadResult['error'],
                ], 500);
            }

            $image = SupplierProductImage::create([
                'supplier_product_id' => $supplierProduct->id,
                'file_url' => $uploadResult['url'],
                'cloudinary_public_id' => $uploadResult['public_id'],
                'width' => $uploadResult['width'],
                'height' => $uploadResult['height'],
            ]);

            return response()->json([
                'success' => true,
                'data' => $image,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Récupérer les images d'un produit fournisseur
     *
     * @param SupplierProduct $supplierProduct
     * @return JsonResponse
     */
    public function getSupplierProductImages(SupplierProduct $supplierProduct): JsonResponse
    {
        $images = $supplierProduct->images()->get();

        return response()->json([
            'success' => true,
            'data' => $images,
        ]);
    }

    /**
     * Supprimer une image de produit fournisseur
     *
     * @param SupplierProductImage $image
     * @return JsonResponse
     */
    public function deleteSupplierProductImage(SupplierProductImage $image): JsonResponse
    {
        try {
            if ($image->cloudinary_public_id) {
                $this->cloudinaryService->delete($image->cloudinary_public_id);
            }

            $image->delete();

            return response()->json([
                'success' => true,
                'message' => 'Image supprimée avec succès',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}
