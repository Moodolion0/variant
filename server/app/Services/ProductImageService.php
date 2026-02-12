<?php

namespace App\Services;

use App\Models\Product_image;
use Illuminate\Http\UploadedFile;
use Exception;

class ProductImageService
{
    protected $cloudinaryService;

    public function __construct(CloudinaryService $cloudinaryService)
    {
        $this->cloudinaryService = $cloudinaryService;
    }

    public function paginate($perPage = 15)
    {
        return Product_image::paginate($perPage);
    }

    /**
     * Créer une image produit avec Cloudinary
     */
    public function create(array $data): Product_image
    {
        // Si un fichier est uploadé, utiliser Cloudinary
        if (isset($data['image']) && $data['image'] instanceof UploadedFile) {
            return $this->createWithUpload($data['product_id'], $data['image']);
        }

        // Sinon créer avec une URL directe
        return Product_image::create([
            'product_id' => $data['product_id'],
            'file_url' => $data['file_url'] ?? null,
        ]);
    }

    /**
     * Créer une image en uploadant vers Cloudinary
     */
    public function createWithUpload(int $productId, UploadedFile $file): Product_image
    {
        try {
            $uploadResult = $this->cloudinaryService->upload($file, 'products');

            if (!$uploadResult['success']) {
                throw new Exception($uploadResult['error']);
            }

            return Product_image::create([
                'product_id' => $productId,
                'file_url' => $uploadResult['url'],
                'cloudinary_public_id' => $uploadResult['public_id'],
                'width' => $uploadResult['width'],
                'height' => $uploadResult['height'],
            ]);
        } catch (Exception $e) {
            throw new Exception('Erreur lors de l\'upload: ' . $e->getMessage());
        }
    }

    public function update(Product_image $productImage, array $data): Product_image
    {
        // Si une nouvelle image est fournie, la remplacer
        if (isset($data['image']) && $data['image'] instanceof UploadedFile) {
            // Supprimer l'ancienne image de Cloudinary
            if ($productImage->cloudinary_public_id) {
                $this->cloudinaryService->delete($productImage->cloudinary_public_id);
            }

            // Upload la nouvelle
            $uploadResult = $this->cloudinaryService->upload($data['image'], 'products');

            if (!$uploadResult['success']) {
                throw new Exception($uploadResult['error']);
            }

            $productImage->update([
                'file_url' => $uploadResult['url'],
                'cloudinary_public_id' => $uploadResult['public_id'],
                'width' => $uploadResult['width'],
                'height' => $uploadResult['height'],
            ]);

            return $productImage;
        }

        // Sinon mettre à jour les données passées
        $productImage->fill(array_filter([
            'product_id' => $data['product_id'] ?? null,
            'file_url' => $data['file_url'] ?? null,
        ], fn($v) => !is_null($v)));

        $productImage->save();

        return $productImage;
    }

    public function delete(Product_image $productImage): bool
    {
        // Supprimer de Cloudinary si présent
        if ($productImage->cloudinary_public_id) {
            $this->cloudinaryService->delete($productImage->cloudinary_public_id);
        }

        return $productImage->delete();
    }
}
