# Guide d'Intégration Cloudinary

## 🎯 Objectif

Intégrer Cloudinary pour le stockage et la gestion des images de produits dans l'application e-commerce multi-profils.

## ✅ Ce qui a été implémenté

### Backend (Laravel - Server)

#### 1. **Service Cloudinary** (`app/Services/CloudinaryService.php`)

- Gère les uploads vers Cloudinary
- Supprime les images de Cloudinary
- Génère des URLs transformées

#### 2. **Mise à jour du modèle Product_image**

- Ajout des colonnes:
  - `cloudinary_public_id` - Identifiant pour suppression
  - `width` - Dimensions de l'image
  - `height` - Dimensions de l'image

#### 3. **Service ProductImageService** (`app/Services/ProductImageService.php`)

- Gère la création des images avec upload Cloudinary
- Gère la suppression automatique de Cloudinary
- Gère la mise à jour des images

#### 4. **Contrôleur ImageController** (`app/Http/Controllers/ImageController.php`)

- Routes pour upload d'images produits
- Routes pour récupération des images
- Routes pour suppression des images

#### 5. **Routes API**

```
POST   /api/supplier/products/{product}/images    - Upload
GET    /api/supplier/products/{product}/images    - Récupérer les images
DELETE /api/supplier/images/{image}               - Supprimer
```

#### 6. **Configuration** (`config/cloudinary.php`)

- Variables de configuration Cloudinary
- Paramètres de transformation

#### 7. **Variables d'environnement** (`.env`)

```env
CLOUDINARY_URL=cloudinary://797929554533524:CqC5P31fsRx18xk6YRx7Uck9gYU@dkkdblw4z
CLOUDINARY_CLOUD_NAME=dkkdblw4z
CLOUDINARY_API_KEY=797929554533524
CLOUDINARY_API_SECRET=CqC5P31fsRx18xk6YRx7Uck9gYU
```

#### 8. **Migrations**

- `2026_01_13_093210_create_product_images_table.php` - Modifiée pour ajouter colonnes Cloudinary
- `2026_02_12_000001_add_cloudinary_columns_to_product_images.php` - Migration de mise à jour

### Frontend (React Native - Client)

#### 1. **Service ImageUploadService** (`services/ImageUploadService.ts`)

- `pickImage()` - Sélectionner image de galerie
- `takePhoto()` - Prendre photo avec caméra
- `uploadProductImage()` - Uploader vers le serveur
- `getProductImages()` - Récupérer les images d'un produit
- `deleteImage()` - Supprimer une image
- `getTransformedUrl()` - Générer URLs transformées

#### 2. **Service ImageCacheService**

- Cacher les images localement pour performance
- Effacer le cache

#### 3. **Types TypeScript** (`types/image.ts`)

- `ProductImage` - Structure d'une image
- `UploadResponse` - Réponse d'upload
- `TransformationOptions` - Options de transformation

#### 4. **Composant Exemple** (`components/ProductImageUploadExample.tsx`)

- Affiche comment uploader des images
- Affiche le galerie/caméra
- Gère la liste des images uploadées

## 🚀 Comment utiliser

### Sur le Client (React Native)

#### Importer le service:

```typescript
import { ImageUploadService } from "../services/ImageUploadService";
import { useAuth } from "../hooks/useAuth";

function MyComponent() {
  const { user } = useAuth();

  // Uploader une image
  const handleUpload = async (imageUri) => {
    try {
      const image = await ImageUploadService.uploadProductImage(
        imageUri,
        productId,
        user.token,
      );
      console.log("Image uploadée:", image.file_url);
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  // Récupérer les images
  const handleGetImages = async () => {
    const images = await ImageUploadService.getProductImages(
      productId,
      user.token,
    );
    console.log("Images:", images);
  };
}
```

#### Sélectionner et uploader:

```typescript
const imageUri = await ImageUploadService.pickImage();
if (imageUri) {
  const uploadedImage = await ImageUploadService.uploadProductImage(
    imageUri,
    productId,
    user.token,
  );
}
```

### Sur le Serveur (Laravel)

#### Injection du service:

```php
<?php

namespace App\Http\Controllers;

use App\Services\ProductImageService;
use Illuminate\Http\Request;

class MyController extends Controller
{
    public function __construct(private ProductImageService $imageService)
    {
    }

    public function createImage(Request $request)
    {
        $image = $this->imageService->create([
            'product_id' => 1,
            'image' => $request->file('image'),
        ]);

        return response()->json($image);
    }
}
```

## 📋 Flux d'upload Complet

```
[User]
   |
   v
[Pick/Take Image] (ImageUploadService)
   |
   v
[Client: FormData + image]
   |
   v
[Server: /api/supplier/products/{id}/images]
   |
   v
[ImageController::uploadProductImage]
   |
   v
[CloudinaryService::upload]
   |
   v
[Cloudinary API]
   |
   v
[Get URL + Public ID]
   |
   v
[ProductImageService::create]
   |
   v
[Save to Database]
   |
   v
[Return JSON to Client]
   |
   v
[User sees uploaded image]
```

## 🔒 Sécurité

### Authentication

- Seuls les utilisateurs authentifiés peuvent uploader
- Routes protégées par middleware `auth:sanctum`

### Authorization

- Chaque fournisseur ne peut uploader que pour ses propres produits
- Vérification `$product->supplier_id === auth()->user()->id`

### Validation

- Fichiers images uniquement
- Taille maximale: 5MB
- Types MIME validés

### Suppression

- Suppression atomique (base de données + Cloudinary)
- Évite les fichiers orphelins

## 🎨 Transformations Disponibles

### Configuration préexistante:

```php
'product_thumb' => [
    'width' => 200,
    'height' => 200,
    'crop' => 'fill',
    'quality' => 'auto',
]

'product_detail' => [
    'width' => 800,
    'height' => 800,
    'crop' => 'fill',
    'quality' => 'auto',
]
```

### Générer une URL transformée:

```php
$thumbUrl = $cloudinaryService->getTransformedUrl(
    'products/my-image',
    ['width' => 200, 'height' => 200, 'crop' => 'fill']
);
```

## 📱 Structure des réponses API

### Upload réussit:

```json
{
  "success": true,
  "message": "Image uploadée avec succès",
  "data": {
    "id": 1,
    "product_id": 1,
    "file_url": "https://res.cloudinary.com/dkkdblw4z/image/upload/...",
    "cloudinary_public_id": "products/image-123",
    "width": 800,
    "height": 600,
    "created_at": "2026-02-12T...",
    "updated_at": "2026-02-12T..."
  }
}
```

### Erreur:

```json
{
  "success": false,
  "message": "Erreur lors de l'upload: ..."
}
```

## 🔄 Processus étape par étape

### 1. Installation (Déjà fait ✅)

- Laravel: `composer install` (cloudinary/cloudinary_php déjà en require)
- React Native: Services et types créés

### 2. Configuration (Déjà faite ✅)

- Variables `.env` définies
- Config Cloudinary créée
- Services créés

### 3. Utilisation dans votre app

#### Admin/Fournisseur:

```typescript
// Dans le formulaire de création/édition produit
import ProductImageUploadExample from '../components/ProductImageUploadExample';

function ProductForm() {
  return (
    <View>
      <ProductImageUploadExample productId={productId} />
    </View>
  );
}
```

#### Client/Affichage:

```typescript
import { Image } from 'react-native';
import { ImageUploadService } from '../services/ImageUploadService';

function ProductCard({ product }) {
  const imageUrl = product.images[0]?.file_url;
  const thumbUrl = ImageUploadService.getTransformedUrl(
    product.images[0]?.cloudinary_public_id,
    { width: 300, height: 300, crop: 'fill' }
  );

  return (
    <Image
      source={{ uri: thumbUrl || imageUrl }}
      style={{ width: 300, height: 300 }}
    />
  );
}
```

## 🧪 Tests

### Test upload via cURL:

```bash
curl -X POST http://localhost:8000/api/supplier/products/1/images \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "image=@/path/to/image.jpg"
```

### Test récupération:

```bash
curl -X GET http://localhost:8000/api/supplier/products/1/images \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 📚 Documentation

Pour plus d'informations:

- [CLOUDINARY.md](./CLOUDINARY.md) - Documentation technique complète
- [Cloudinary Docs](https://cloudinary.com/documentation) - Documentation officielle

## ✨ Avantages

- ☁️ Stockage cloud illimité
- 🚀 CDN global pour performances optimales
- 🎨 Transformations d'images automatiques
- 📦 Compression et optimisation incluses
- 🔒 Sécurisé et fiable
- 🆓 Plan gratuit généreux

## 🆘 Troubleshooting

### "CLOUDINARY_URL not defined"

- Vérifier que `.env` a les variables Cloudinary
- Exécuter: `php artisan config:cache`

### "Erreur lors de l'upload"

- Vérifier les permissions du dossier `storage`
- Vérifier que le fichier est une image valide
- Vérifier la limite de 5MB

### "Image orpheline sur Cloudinary"

- Les images perdues peuvent être nettoyées manuellement
- Le système supprime automatiquement lors de la suppression DB

## 🎓 Prochaines étapes

1. Intégrer le composant `ProductImageUploadExample` dans votre admin
2. Mettre à jour les formulaires produit pour uploader des images
3. Afficher les images Cloudinary dans les listes produits
4. Ajouter des transformations personnalisées selon vos besoins
5. Tester avec des vrais produits

---

**Créé le:** 2026-02-12  
**Version:** 1.0  
**Status:** ✅ Production-ready
