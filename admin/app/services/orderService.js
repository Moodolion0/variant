import config from '../config';

const API_BASE_URL = config.API_BASE_URL;

// Helper pour les requêtes API avec authentification
const fetchWithAuth = async (endpoint, options = {}) => {
  const token = localStorage.getItem('admin_token');
  
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

export async function list(filter = 'all') {
  try {
    let endpoint = '/admin/all-orders';
    if (filter !== 'all') {
      endpoint += `?status=${filter}`;
    }
    
    const data = await fetchWithAuth(endpoint);
    
    // Transform API response if needed
    const orders = Array.isArray(data) ? data : (data.data || []);
    
    return orders.map(order => ({
      id: order.id,
      ref: `#ORD-${order.id}`,
      customer: order.client?.full_name || order.customer_name || 'N/A',
      amount: order.total || 0,
      items: order.order_items?.length || 0,
      status: order.status || 'pending',
      date: new Date(order.created_at).toLocaleDateString('fr-FR'),
    }));
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
}

export async function getDetail(id) {
  try {
    const order = await fetchWithAuth(`/admin/orders/${id}`);
    
    return {
      id: order.id,
      ref: `#ORD-${order.id}`,
      customer: {
        name: order.client?.full_name || order.customer_name || 'N/A',
        address: order.location?.address_text || 'N/A',
        phone: order.client?.phone_number || 'N/A',
      },
      items: (order.order_items || []).map(item => ({
        name: item.product?.name_supplier || item.product_name || 'N/A',
        supplier: item.product?.supplier?.name || 'N/A',
        quantity: item.quantity,
        price: item.price_at_purchase,
        total: (item.price_at_purchase || 0) * item.quantity,
      })),
      subtotal: order.subtotal || 0,
      shippingFee: order.shipping_fee || 0,
      total: order.total || 0,
      delivery: {
        name: order.livreur?.full_name || 'Non assigné',
        status: order.status,
      },
      status: order.status,
      date: new Date(order.created_at).toLocaleDateString('fr-FR'),
    };
  } catch (error) {
    console.error('Error fetching order details:', error);
    throw error;
  }
}

export default { list, getDetail };
