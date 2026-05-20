// ============================================================
// EXAMPLE: Composant Admin pour afficher la liste des produits
// ============================================================
// Ce fichier montre comment utiliser les services mis à jour

import { useEffect, useState } from 'react';
import productService from '../services/productService';

export function ProductsList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      setLoading(true);
      setError(null);
      
      // Utiliser le service pour récupérer les produits
      const data = await productService.list();
      setProducts(data);
    } catch (err) {
      setError(err.message);
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error}</div>;

  return (
    <div>
      <h2>Liste des Produits</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom (Admin)</th>
            <th>Nom (Fournisseur)</th>
            <th>Prix Fournisseur</th>
            <th>Intérêt</th>
            <th>Prix Final</th>
            <th>Stock</th>
            <th>Visible</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.name_by_admin || '-'}</td>
              <td>{product.name_supplier}</td>
              <td>{product.price_supplier}€</td>
              <td>{product.interest || 0}€</td>
              <td>{(parseFloat(product.price_supplier) + (product.interest || 0))}€</td>
              <td>{product.stock_quantity}</td>
              <td>{product.visible_in_catalog ? '✅' : '❌'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ============================================================
// EXAMPLE: Composant Admin pour afficher la liste des utilisateurs
// ============================================================

import userService from '../services/userService';

export function UsersList() {
  const [users, setUsers] = useState([]);
  const [userType, setUserType] = useState('client');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, [userType]);

  async function loadUsers() {
    try {
      setLoading(true);
      const data = await userService.list(userType);
      setUsers(data);
    } catch (err) {
      console.error('Error loading users:', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h2>Utilisateurs Enregistrés</h2>
      
      <select value={userType} onChange={(e) => setUserType(e.target.value)}>
        <option value="client">Clients</option>
        <option value="livreur">Livreurs</option>
        <option value="fournisseur">Fournisseurs</option>
      </select>

      {loading ? (
        <p>Chargement...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Nom</th>
              <th>Email</th>
              <th>Type</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.type}</td>
                <td>{user.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

// ============================================================
// EXAMPLE: Composant Client pour afficher les produits du catalogue
// ============================================================


export function ProductCatalog() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadCatalog();
  }, []);

  async function loadCatalog() {
    try {
      setLoading(true);
      const data = await productService.getPublicProducts();
      setProducts(data);
    } catch (err) {
      console.error('Error loading catalog:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSearch(e) {
    e.preventDefault();
    const results = await productService.searchProducts(searchQuery);
    setProducts(results);
  }

  return (
    <div>
      <h1>Catalogue Produits</h1>
      
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Rechercher un produit..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit">Rechercher</button>
      </form>

      {loading ? (
        <p>Chargement du catalogue...</p>
      ) : (
        <div className="product-grid">
          {products.map(product => (
            <div key={product.id} className="product-card">
              <h3>{product.name_by_admin || product.name_supplier}</h3>
              <p>{product.description_by_admin || product.description_supplier}</p>
              <p className="price">{product.price_supplier}€</p>
              <button onClick={() => addToCart(product.id)}>
                Ajouter au panier
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  async function addToCart(productId) {
    await productService.addToCart(productId, 1);
    alert('Produit ajouté au panier!');
  }
}

// ============================================================
// REMARQUES IMPORTANTES
// ============================================================

/*
1. SERVICES UTILISANT LA CONFIGURATION CENTRALISÉE:

   Admin:
   ✅ productService.js - list(), getDetail(id), create(), update(), remove()
   ✅ userService.js - list(type), getDetail(id)
   ✅ supplierService.js - list(), getDetail(id), create(), update(), remove()
   ✅ orderService.js - list(filter), getDetail(id)
   ✅ dashboardService.js - getStats()
   ✅ ImageUploadService.js - uploadProductImage()

   Client:
   ✅ authService.js - login(), logout(), getProfile()
   ✅ productService.js - getPublicProducts(), getProductDetail(), searchProducts()
   ✅ orderService.js - getClientOrders(), createOrder(), confirmReceipt()
   ✅ livreurService.js - getAvailableOrders(), acceptOrder()

   Supplier:
   ✅ api.ts - authService.login(), supplierService.createProduct()

2. AUTHENTIFICATION:
   - Admin: Utilise localStorage.getItem('admin_token')
   - Client: Utilise AsyncStorage.getItem('auth_token')
   - Supplier: Utilise localStorage.getItem('supplier_token')

3. TRANSFORMATION DES DONNÉES:
   - Les services transforment les données API en format frontend
   - Exemple: role='client' devient type='buyer'
   - Exemple: status='valide' devient status='active'

4. GESTION DES ERREURS:
   - Tous les services lancent des Error si la requête échoue
   - À vous de gérer les erreurs dans vos composants avec try/catch

5. AUTHENTIFICATION REQUISE:
   - Les endpoints /admin/* nécessitent un token admin
   - Les endpoints /client/* nécessitent un token client
   - Les endpoints /supplier/* nécessitent un token fournisseur
   - Les endpoints /products (GET) sont publics

*/
