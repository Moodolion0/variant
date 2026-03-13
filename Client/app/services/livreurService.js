const API_BASE_URL = 'http://localhost:8000/api';

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
    throw new Error(data.message || data.errors?.flat().join(', ') || 'Erreur API');
  }

  return data;
};

export const livreurService = {
  // Obtenir les commandes disponibles à livrer
  async getAvailableOrders() {
    return fetchWithAuth('/livreur/available-orders');
  },

  // Accepter une commande
  async acceptOrder(orderId) {
    return fetchWithAuth(`/livreur/orders/${orderId}/accept`, {
      method: 'POST',
    });
  },

  // Annuler une commande (avec pénalité)
  async cancelOrder(orderId) {
    return fetchWithAuth(`/livreur/orders/${orderId}/cancel`, {
      method: 'POST',
    });
  },

  // Déclarer la livraison terminée
  async declareFinished(orderId) {
    return fetchWithAuth(`/livreur/orders/${orderId}/declare-finished`, {
      method: 'POST',
    });
  },

  // Obtenir l'historique du wallet
  async getWallet() {
    return fetchWithAuth('/livreur/wallet');
  },

  // Demander un retrait
  async requestWithdraw(amount) {
    return fetchWithAuth('/livreur/wallet/withdraw', {
      method: 'POST',
      body: JSON.stringify({ amount }),
    });
  },

  // Vérifier le statut du profil
  async getProfileStatus() {
    return fetchWithAuth('/livreur/profile-status');
  },

  // Soumettre des documents
  async uploadDocuments(documents) {
    const token = await AsyncStorage.getItem('auth_token');
    
    const formData = new FormData();
    documents.forEach((doc) => {
      formData.append('documents[]', doc);
    });

    const response = await fetch(`${API_BASE_URL}/livreur/documents`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erreur upload');
    }

    return data;
  },
};
