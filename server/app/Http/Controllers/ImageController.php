<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Product_image;
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
     * Récupérer toutes les images d'un produit
     *
     * @param Product $product
     * @return JsonResponse
     */
    public function getProductImages(Product $product): JsonResponse
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
}
