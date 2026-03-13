const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:8000/api";

/**
 * Transform API order to app order format
 */
function transformOrder(apiOrder) {
  return {
    id: String(apiOrder.id),
    orderNumber: `CMD-${String(apiOrder.id).padStart(5, '0')}`,
    date: apiOrder.created_at ? new Date(apiOrder.created_at).toLocaleDateString('fr-FR') : new Date().toLocaleDateString('fr-FR'),
    status: apiOrder.status || 'en_attente',
    total: Number(apiOrder.total_amount || 0),
    itemsCount: apiOrder.items?.length || 0,
    items: apiOrder.items || [],
  };
}

/**
 * Fetch with authentication
 */
async function fetchWithAuth(endpoint, options = {}) {
  const AsyncStorage = require('@react-native-async-storage/async-storage').default;
  const token = await AsyncStorage.getItem('auth_token');
  
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Erreur de requête');
  }

  return response.json();
}

export const orderService = {
  /**
   * Get client's orders
   */
  async getClientOrders() {
    try {
      const data = await fetchWithAuth('/client/orders');
      if (Array.isArray(data)) {
        return data.map(transformOrder);
      }
      if (data.data) {
        return data.data.map(transformOrder);
      }
      return [];
    } catch (error) {
      console.error('Error fetching client orders:', error);
      return [];
    }
  },

  /**
   * Get order details
   */
  async getOrderDetails(orderId) {
    try {
      const data = await fetchWithAuth(`/client/orders/${orderId}`);
      return transformOrder(data);
    } catch (error) {
      console.error('Error fetching order details:', error);
      return null;
    }
  },

  /**
   * Confirm order receipt
   */
  async confirmReceipt(orderId) {
    try {
      const data = await fetchWithAuth(`/client/orders/${orderId}/confirm-receipt`, {
        method: 'POST',
      });
      return data;
    } catch (error) {
      console.error('Error confirming receipt:', error);
      throw error;
    }
  },

  /**
   * Create new order
   */
  async createOrder(orderData) {
    try {
      const data = await fetchWithAuth('/client/orders', {
        method: 'POST',
        body: JSON.stringify(orderData),
      });
      return data;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },
};
