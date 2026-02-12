# Cloudinary Integration for Product Images

## Configuration

Le projet est configuré pour utiliser Cloudinary pour le stockage et la gestion des images de produits.

### Variables d'Environnement

Les variables suivantes doivent être présentes dans le fichier `.env`:

```env
CLOUDINARY_URL=cloudinary://API_KEY:API_SECRET@CLOUD_NAME
CLOUDINARY_CLOUD_NAME=dkkdblw4z
CLOUDINARY_API_KEY=797929554533524
CLOUDINARY_API_SECRET=CqC5P31fsRx18xk6YRx7Uck9gYU
```

Ces variables sont utilisées par:

- `config/cloudinary.php` - Configuration générale
- `app/Services/CloudinaryService.php` - Service de gestion Cloudinary

## Services

### CloudinaryService

Le service `CloudinaryService` fournit les méthodes suivantes:

#### `upload($file, $folder = 'products')`

Upload une image vers Cloudinary

```php
$result = $cloudinaryService->upload($uploadedFile, 'products');

if ($result['success']) {
    $imageUrl = $result['url'];
    $publicId = $result['public_id'];
}
```

**Paramètres:**

- `$file` - Fichier uploadé (UploadedFile)
- `$folder` - Dossier de destination

**Retour:**

```php
[
    'success' => true/false,
    'url' => 'https://...',      // URL de l'image
    'public_id' => 'products/...',
    'width' => 800,
    'height' => 600,
    'error' => 'Message d\'erreur'  // Si success = false
]
```

#### `delete($publicId)`

Supprimer une image de Cloudinary

```php
$cloudinaryService->delete('products/image-id');
```

#### `getTransformedUrl($publicId, $options = [])`

Générer une URL transformée

```php
$thumbUrl = $cloudinaryService->getTransformedUrl('products/image-id', [
    'width' => 200,
    'height' => 200,
    'crop' => 'fill',
    'quality' => 'auto'
]);
```

## Modèles

### Product_image

Le modèle `Product_image` a été mis à jour pour enregistrer les informations Cloudinary:

```php
$image = Product_image::create([
    'product_id' => 1,
    'file_url' => 'https://res.cloudinary.com/...',
    'cloudinary_public_id' => 'products/image-id',
    'width' => 800,
    'height' => 600,
]);
```

**Colonnes:**

- `id` - ID unique
- `product_id` - ID du produit associé
- `file_url` - URL complète de l'image sur Cloudinary
- `cloudinary_public_id` - Identifiant public Cloudinary (pour suppression/transformation)
- `width` - Largeur de l'image en pixels
- `height` - Hauteur de l'image en pixels
- `created_at`, `updated_at` - Timestamps

## Routes API

### Upload une image pour un produit

```
POST /api/supplier/products/{product}/images
Content-Type: multipart/form-data

{
    "image": <file>
}
```

**Authentification:** Requiert le profil de fournisseur (supplier)

**Retour (201):**

```json
{
    "success": true,
    "message": "Image uploadée avec succès",
    "data": {
        "id": 1,
        "product_id": 1,
        "file_url": "https://res.cloudinary.com/...",
        "cloudinary_public_id": "products/...",
        "width": 800,
        "height": 600,
        "created_at": "2026-02-12T...",
        "updated_at": "2026-02-12T..."
    }
}
```

### Récupérer les images d'un produit

```
GET /api/supplier/products/{product}/images
```

**Retour (200):**

```json
{
    "success": true,
    "data": [
        {
            "id": 1,
            "product_id": 1,
            "file_url": "https://res.cloudinary.com/...",
            ...
        }
    ]
}
```

### Supprimer une image

```
DELETE /api/supplier/images/{image}
```

**Retour (200):**

```json
{
    "success": true,
    "message": "Image supprimée avec succès"
}
```

## Utilisation dans les Services

### ProductImageService

Le service `ProductImageService` gère automatiquement Cloudinary:

```php
use App\Services\ProductImageService;

class MyService {
    public function createImageWithUpload(int $productId, UploadedFile $file) {
        $image = $this->productImageService->createWithUpload($productId, $file);
        return $image;
    }
}
```

## Transformations

Les transformations Cloudinary sont pré-configurées dans `config/cloudinary.php`:

```php
'transformations' => [
    'product_thumb' => [
        'width' => 200,
        'height' => 200,
        'crop' => 'fill',
        'quality' => 'auto',
    ],
    'product_detail' => [
        'width' => 800,
        'height' => 800,
        'crop' => 'fill',
        'quality' => 'auto',
    ],
]
```

Pour utiliser une transformation:

```php
$thumbUrl = $cloudinaryService->getTransformedUrl('products/image-id', [
    'width' => 200,
    'height' => 200,
    'crop' => 'fill',
]);
```

## Architecture

```
server/
├── app/
│   ├── Services/
│   │   ├── CloudinaryService.php    # Gère les uploads/deletions Cloudinary
│   │   └── ProductImageService.php  # Logique métier, utilise CloudinaryService
│   ├── Http/
│   │   └── Controllers/
│   │       ├── ImageController.php         # Routes d'upload (deprecated)
│   │       └── ProductImageController.php  # CRUD des images produits
│   └── Models/
│       └── Product_image.php        # Modèle avec colonnes Cloudinary
├── config/
│   └── cloudinary.php               # Configuration Cloudinary
└── routes/
    └── api.php                      # Routes API /supplier/*/images
```

## Flux d'Upload Typique

1. **Upload via FormData**

    ```javascript
    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch("/api/supplier/products/1/images", {
        method: "POST",
        body: formData,
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    ```

2. **Laravel traite le fichier**
    - `ImageController::uploadProductImage()` reçoit le fichier
    - `CloudinaryService::upload()` envoie à Cloudinary
    - `Product_image::create()` enregistre en base de données

3. **Réponse avec URL**
    - L'URL Cloudinary est retournée
    - Le `public_id` est sauvegardé pour suppression ultérieure
    - Dimensions enregistrées pour les transformations

## Gestion des Erreurs

```php
try {
    $result = $cloudinaryService->upload($file, 'products');

    if (!$result['success']) {
        throw new Exception($result['error']);
    }
} catch (Exception $e) {
    // Gérer l'erreur
}
```

## Notes de Performance

- Les images sont stockées dans le cloud Cloudinary (pas en local)
- Les URL générées sont des CDN URLs (performance optimisée)
- Les transformations sont générées dynamiquement (caching recommandé)
- Limites: 5MB par image (configurable dans le contrôleur)

## Sécurité

- **Authentification**: Seuls les fournisseurs (suppliers) peuvent uploader
- **Autorisation**: Chaque fournisseur ne peut upload que pour ses produits
- **Validation**: Fichiers images uniquement, 5MB max
- **Suppression**: Supprime de Cloudinary ET de la base de données

## Migrations

Deux migrations ont été créées/modifiées:

1. **2026_01_13_093210_create_product_images_table.php**
    - Création initiale de la table (modifiée pour ajouter colonnes Cloudinary)

2. **2026_02_12_000001_add_cloudinary_columns_to_product_images.php**
    - Ajoute les colonnes `cloudinary_public_id`, `width`, `height`
    - Compatible avec les bases existantes

Pour exécuter les migrations:

```bash
php artisan migrate
```

## Suppression

Quand une image est supprimée:

1. L'enregistrement est retiré de la base de données
2. L'image est supprimée de Cloudinary (via le `public_id`)

Cela évite les fichiers orphelins sur Cloudinary.
