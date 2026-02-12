<?php

namespace App\Services;

use Cloudinary\Cloudinary;
use Cloudinary\Api\Upload\UploadApi;
use Exception;

class CloudinaryService
{
    protected $cloudinary;

    public function __construct()
    {
        $this->cloudinary = new Cloudinary([
            'cloud' => [
                'api_key' => config('cloudinary.api_key'),
                'api_secret' => config('cloudinary.api_secret'),
                'cloud_name' => config('cloudinary.cloud_name'),
            ]
        ]);
    }

    /**
     * Upload une image vers Cloudinary
     *
     * @param mixed $file Fichier uploadé (UploadedFile)
     * @param string $folder Dossier de destination (ex: 'products')
     * @return array URL et public_id de l'image uploadée
     */
    public function upload($file, $folder = 'products')
    {
        try {
            $filePath = $file->getRealPath();
            $filename = $file->getClientOriginalName();

            $uploadApi = new UploadApi($this->cloudinary);

            $response = $uploadApi->upload($filePath, [
                'folder' => $folder,
                'resource_type' => 'auto',
                'public_id' => pathinfo($filename, PATHINFO_FILENAME),
            ]);

            return [
                'success' => true,
                'url' => $response['secure_url'],
                'public_id' => $response['public_id'],
                'width' => $response['width'] ?? null,
                'height' => $response['height'] ?? null,
            ];
        } catch (Exception $e) {
            return [
                'success' => false,
                'error' => $e->getMessage(),
            ];
        }
    }

    /**
     * Supprimer une image de Cloudinary
     *
     * @param string $publicId Public ID de l'image
     * @return bool Succès de la suppression
     */
    public function delete($publicId)
    {
        try {
            $uploadApi = new UploadApi($this->cloudinary);
            $response = $uploadApi->destroy($publicId);

            return isset($response['result']) && $response['result'] === 'ok';
        } catch (Exception $e) {
            return false;
        }
    }

    /**
     * Générer une URL transformée pour une image
     *
     * @param string $publicId Public ID de l'image
     * @param array $options Options de transformation (width, height, quality, etc.)
     * @return string URL transformée
     */
    public function getTransformedUrl($publicId, $options = [])
    {
        try {
            return $this->cloudinary->image($publicId)
                ->transform($options)
                ->toUrl();
        } catch (Exception $e) {
            return null;
        }
    }
}
