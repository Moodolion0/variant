# 🚀 QUICK START - Configuration API

## 5 Minutes Setup

### 1. Copier les fichiers .env

```bash
# Depuis la racine du projet
cp admin/.env.example admin/.env
cp Client/.env.example Client/.env
cp supplier/.env.example supplier/.env
```

### 2. Vérifier .env

Ouvrez chaque fichier `.env` et vérifiez que l'URL est correcte:

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

**Si le backend est sur un port différent, modifiez cette URL.**

### 3. C'est prêt! 🎉

Les services utiliseront automatiquement cette configuration.

---

## ✨ Utilisation dans vos composants

### Admin - Afficher les Produits

```javascript
import productService from '../services/productService';
import { useEffect, useState } from 'react';

export function Products() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Récupère les produits de la base de données
    productService.list().then(setProducts);
  }, []);

  return (
    <div>
      {products.map(p => (
        <div key={p.id}>{p.name_supplier} - {p.price_supplier}€</div>
      ))}
    </div>
  );
}
```

### Admin - Afficher les Utilisateurs

```javascript
import userService from '../services/userService';

const clients = await userService.list('client');
const livreurs = await userService.list('livreur');
const suppliers = await userService.list('fournisseur');
```

### Admin - Afficher les Commandes

```javascript
import orderService from '../services/orderService';

const orders = await orderService.list(); // Toutes les commandes
const detriledOrder = await orderService.getDetail(orderId);
```

### Client - Afficher le Catalogue

```javascript
import { productService } from '../services/productService';

// Tous les produits visibles
const products = await productService.getPublicProducts();

// Rechercher
const results = await productService.searchProducts('iPhone');

// Ajouter au panier
await productService.addToCart(productId, quantity);
```

### Client - Afficher Mes Commandes

```javascript
import { orderService } from '../services/orderService';

const myOrders = await orderService.getClientOrders();
```

### Supplier - Créer un Produit

```javascript
import { supplierService } from '../services/api';

const newProduct = await supplierService.createProduct(token, {
  name_supplier: 'Mon Produit',
  price_supplier: 99.99,
  stock_quantity: 100,
});
```

---

## 📊 Services Disponibles

### Admin Services

| Service | Méthodes |
|---------|----------|
| **productService** | `list()`, `getDetail(id)`, `create(data)`, `update(id, data)`, `remove(id)` |
| **userService** | `list(type)`, `getDetail(id)` |
| **supplierService** | `list()`, `getDetail(id)`, `create(data)`, `update(id, data)`, `remove(id)` |
| **orderService** | `list(filter)`, `getDetail(id)` |
| **dashboardService** | `getStats()` |
| **ImageUploadService** | `uploadProductImage(file, productId)` |

### Client Services

| Service | Méthodes |
|---------|----------|
| **authService** | `login(email, password)`, `logout()`, `getProfile()` |
| **productService** | `getPublicProducts()`, `getProductDetail(id)`, `searchProducts(query)`, `addToCart(id, qty)` |
| **orderService** | `getClientOrders()`, `createOrder(data)`, `confirmReceipt(id)` |
| **livreurService** | `getAvailableOrders()`, `acceptOrder(id)`, `cancelOrder(id)` |

### Supplier Services

| Service | Méthodes |
|---------|----------|
| **authService** | `login(email, password)` |
| **supplierService** | `getProducts(token)`, `createProduct(token, data)`, `updateProduct(token, id, data)`, `deleteProduct(token, id)` |

---

## 🧪 Tester dans la Console

### Tester Admin

```javascript
// Dans la console Admin (F12) 
import productService from '../services/productService';

// Récupérer tous les produits
productService.list().then(products => {
  console.log('Products:', products);
}).catch(err => console.error('Error:', err));
```

### Tester Client

```javascript
// Dans la console Client (F12)
import { productService } from '../services/productService';

// Récupérer le catalogue
productService.getPublicProducts().then(products => {
  console.log('Catalog:', products);
});
```

---

## 🔐 Authentification

Chaque service include automatiquement le token d'authentification:

- **Admin**: lit le token de `localStorage.getItem('admin_token')`
- **Client**: lit le token de `AsyncStorage.getItem('auth_token')`
- **Supplier**: lit le token de `localStorage.getItem('supplier_token')`

Vous n'avez rien à faire - c'est automatique! 🎯

---

## ⚠️ Problèmes Courants

### Erreur: "Config module not found"

```
SyntaxError: Cannot find module '../config'
```

**Solution:** Vérifiez que le fichier `config.js` existe:
- Admin: `admin/app/config.js`
- Client: `Client/app/config.js`
- Supplier: `supplier/src/config.ts`

### Erreur: 401 Unauthorized

```
{"message":"Unauthenticated."}
```

**Solution:**
1. Assurez-vous que vous êtes connecté
2. Vérifiez que le token existe dans localStorage (F12 → Storage)
3. Reconnectez-vous pour obtenir un nouveau token

### Erreur: "API URL not found"

Vérifiez que `.env` existe et contient:
```env
VITE_API_BASE_URL=http://localhost:8000/api
```

### Récupère des données vides ou null

1. Vérifiez que le backend tourne: `http://localhost:8000`
2. Vérifiez dans la concole du navigateur (F12) s'il y a des erreurs réseau
3. Vérifiez dans les logs du backend Laravel pour les erreurs

---

## 📚 Pour Plus d'Informations

- `CONFIG_SETUP.md` - Guide complet de configuration
- `SETUP_SUMMARY.md` - Résumé des changements
- `SERVICES_EXAMPLES.jsx` - Plus d'exemples de code

---

## ✅ Checklist

- [ ] `.env` copié pour Admin
- [ ] `.env` copié pour Client  
- [ ] `.env` copié pour Supplier
- [ ] Backend Laravel démarre sur http://localhost:8000
- [ ] Frontend Admin démarre
- [ ] Frontend Client démarre
- [ ] Frontend Supplier démarre
- [ ] Test: `productService.list()` dans Admin console
- [ ] Test: `productService.getPublicProducts()` dans Client console
- [ ] Test: Créer un produit dans Supplier

---

Besoin d'aide? Consultez les fichiers de documentation créés! 📖
