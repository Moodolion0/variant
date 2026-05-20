# Configuration des Frontends - Guide Setup

## 🎯 Objectif

Centralisez la configuration de l'URL de base de l'API pour tous les frontends (Admin, Client, Supplier) sans avoir à répéter `const API_BASE_URL = 'http://localhost:8000/api'` partout.

## 📋 Structure de Configuration

### Pour chaque frontend

Chaque application frontend a sa propre configuration:

```
admin/
├── .env                    # Variables d'environnement (gitignore)
├── .env.example           # Template pour .env
├── app/
│   ├── config.js          # Fichier de configuration qui charge .env
│   └── services/          # Services qui importent config
├── package.json
└── ...

Client/
├── .env                    # Variables d'environnement (gitignore)
├── .env.example           # Template pour .env
├── app/
│   ├── config.js          # Fichier de configuration
│   └── services/          # Services qui importent config
└── ...

supplier/
├── .env                    # Variables d'environnement (gitignore)
├── .env.example           # Template pour .env
├── src/
│   ├── config.ts          # Fichier de configuration TypeScript
│   └── services/          # Services qui importent config
└── ...
```

## 🔧 Configuration par Frontend

### 1. **Admin** (React avec Expo)

**Fichier: `admin/app/config.js`**
```javascript
export const config = {
  API_BASE_URL: 'http://localhost:8000/api',
};
export default config;
```

**Utilisation dans un service:**
```javascript
import config from '../config';
const API_BASE_URL = config.API_BASE_URL;
```

### 2. **Client** (React avec Expo)

**Fichier: `Client/app/config.js`**
```javascript
export const config = {
  API_BASE_URL: 'http://localhost:8000/api',
};
export default config;
```

**Utilisation dans un service:**
```javascript
import config from '../config';
const API_BASE_URL = config.API_BASE_URL;
```

### 3. **Supplier** (React avec Vite - TypeScript)

**Fichier: `supplier/src/config.ts`**
```typescript
export const config = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
};
export default config;
```

**Utilisation dans un service:**
```typescript
import { config } from '../config';
const API_BASE_URL = config.API_BASE_URL;
```

## 🔑 Variables d'Environnement

### Fichier `.env` (pour chaque app)

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

**Note:** 
- Pour Vite (Supplier), le préfixe `VITE_` est obligatoire
- Pour Expo (Admin, Client), on utilise un fichier config.js simple
- Le fichier `.env` est listé dans `.gitignore` pour la sécurité

### Copier depuis .env.example

```bash
# Pour Admin
cp admin/.env.example admin/.env

# Pour Client
cp Client/.env.example Client/.env

# Pour Supplier
cp supplier/.env.example supplier/.env
```

## 📝 Services Implémentés

Tous les services ont été mises à jour pour utiliser la configuration centralisée:

### Admin Services
- ✅ `productService.js` - Récupère les produits de la base de données
- ✅ `userService.js` - Récupère les utilisateurs enregistrés
- ✅ `supplierService.js` - Récupère les fournisseurs
- ✅ `orderService.js` - Récupère les commandes
- ✅ `dashboardService.js` - Récupère les stats du dashboard
- ✅ `ImageUploadService.js` - Upload d'images vers Cloudinary

### Client Services
- ✅ `authService.js` - Authentification
- ✅ `productService.js` - Récupère les produits du catalogue (NEW)
- ✅ `orderService.js` - Gestion des commandes client (NEW)
- ✅ `livreurService.js` - Services livreur

### Supplier Services
- ✅ `api.ts` - Authentification et autre API calls

## 🚀 Usage dans les Composants

### Exemple: Afficher la liste des produits (Admin)

**Avant (avec URL en dur):**
```javascript
const API_BASE_URL = 'http://localhost:8000/api';

async function loadProducts() {
  const response = await fetch(`${API_BASE_URL}/products`);
  return response.json();
}
```

**Après (avec configuration):**
```javascript
import productService from '../services/productService';

async function loadProducts() {
  return await productService.list();
}
```

### Exemple: Récupérer les utilisateurs (Admin)

```javascript
import userService from '../services/userService';

async function loadUsers() {
  return await userService.list('buyer'); // 'buyer', 'delivery', 'supplier'
}
```

### Exemple: Récupérer les produits du catalogue (Client)

```javascript
import productService from '../services/productService';

async function loadProducts() {
  return await productService.getPublicProducts();
}
```

## 🔐 Authentification

Les services incluent un helper `fetchWithAuth` qui:
1. Récupère automatiquement le token depuis localStorage/AsyncStorage
2. Ajoute le header `Authorization: Bearer <token>`
3. Gère les erreurs API

```javascript
// Exemple: Utiliser fetchWithAuth dans Admin
const fetchWithAuth = async (endpoint, options = {}) => {
  const token = localStorage.getItem('admin_token');
  // ... construit la requête avec le token
};
```

## 📊 Transformation des Données

Les services transforment les données API en format attendu par le frontend:

**Exemple (userService):**
```javascript
// API retourne: { id, full_name, email, role, status }
// Service transforme en: { id, name, email, type, status, avatar }
```

## ⚙️ Variables d'Environnement Supplémentaires (Futures)

Si vous avez besoin d'ajouter d'autres variables:

```env
# .env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_API_TIMEOUT=30000
VITE_MAX_FILE_SIZE=5242880
```

Chargez-les dans `config.js`:
```javascript
export const config = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
  API_TIMEOUT: import.meta.env.VITE_API_TIMEOUT || 30000,
  MAX_FILE_SIZE: import.meta.env.VITE_MAX_FILE_SIZE || 5 * 1024 * 1024,
};
```

## ✅ Checklist Setup

- [ ] Copier `.env.example` vers `.env` pour chaque app
- [ ] Vérifier que `config.js/ts` existe dans chaque app
- [ ] Vérifier que tous les services importent `config`
- [ ] Tester un appel API depuis Admin (productService.list())
- [ ] Tester un appel API depuis Client (productService.getPublicProducts())
- [ ] Tester un appel API depuis Supplier

## 🎓 Bonnes Pratiques

1. **Ne jamais commiter `.env`** - Listé dans `.gitignore`
2. **Toujours fournir `.env.example`** - Pour que les devs sachent quoi configurer
3. **Utiliser des valeurs par défaut** - `import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'`
4. **Centraliser la configuration** - Évite la duplication du code
5. **Documenter les variables** - Expliquez à quoi sert chaque variable

## 🐛 Dépannage

**Problème: "Cannot find module 'config'"**
- Vérifiez que le fichier `config.js/ts` existe au bon endroit
- Vérifiez le chemin d'import : `import config from '../config'`

**Problème: API URL toujours 'http://localhost:8000'**
- Vérifiez que `.env` existe et contient `VITE_API_BASE_URL=...`
- Pour Vite: Vérifiez le préfixe `VITE_`
- Redémarrez le serveur de développement après changement de .env

**Problème: 401 Unauthorized**
- Vérifiez que le token est stocké dans localStorage/AsyncStorage
- Vérifiez que fetchWithAuth récupère le bon token
- Vérifiez que le header `Authorization` est bien envoyé

