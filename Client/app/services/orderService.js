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

export const orderService = {
  // Obtenir les commandes du client
  async getClientOrders() {
    return fetchWithAuth('/client/orders');
  },

  // Obtenir les détails d'une commande
  async getOrderDetail(orderId) {
    return fetchWithAuth(`/client/orders/${orderId}`);
  },

  // Créer une nouvelle commande
  async createOrder(orderData) {
    return fetchWithAuth('/client/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },

  // Confirmer la réception d'une commande
  async confirmReceipt(orderId) {
    return fetchWithAuth(`/client/orders/${orderId}/confirm-receipt`, {
      method: 'POST',
    });
  },
};

export default orderService;
