import config from '../config';

const API_BASE_URL = config.API_BASE_URL;

// Importer AsyncStorage correctement pour le web et React Native
let AsyncStorage;
try {
  AsyncStorage = require('@react-native-async-storage/async-storage').default;
} catch (error) {
  // Pour le web, utiliser localStorage comme fallback
  AsyncStorage = {
    getItem: async (key) => localStorage.getItem(key),
    setItem: async (key, value) => localStorage.setItem(key, value),
    removeItem: async (key) => localStorage.removeItem(key),
  };
}

// Helper pour les requêtes API avec auth
const fetchWithAuth = async (endpoint, options = {}) => {
  const token = await AsyncStorage.getItem('auth_token');
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
      'X-Requested-With': 'XMLHttpRequest',
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || data.errors?.flat?.().join(', ') || 'Erreur API');
  }

  return data;
};

export const productService = {
  // Obtenir tous les produits visibles dans le catalogue
  async getPublicProducts() {
    try {
      const response = await fetch(`${API_BASE_URL}/products`);
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching public products:', error);
      throw error;
    }
  },

  // Obtenir les détails d'un produit
  async getProductDetail(productId) {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${productId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch product details');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching product details:', error);
      throw error;
    }
  },

  // Obtenir les produits par catégorie
  async getProductsByCategory(category) {
    try {
      const response = await fetch(`${API_BASE_URL}/products?category=${category}`);
      if (!response.ok) {
        throw new Error('Failed to fetch products by category');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching products by category:', error);
      throw error;
    }
  },

  // Rechercher des produits
  async searchProducts(query) {
    try {
      const response = await fetch(`${API_BASE_URL}/products?search=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error('Failed to search products');
      }
      return await response.json();
    } catch (error) {
      console.error('Error searching products:', error);
      throw error;
    }
  },

  // Ajouter un produit au panier (si un endpoint existe)
  async addToCart(productId, quantity, properties = {}) {
    try {
      return await fetchWithAuth('/client/cart', {
        method: 'POST',
        body: JSON.stringify({
          product_id: productId,
          quantity,
          properties,
        }),
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  },
};

export default productService;
