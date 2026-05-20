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

export async function list() {
  try {
    const token = localStorage.getItem('admin_token');
    const response = await fetch(`${API_BASE_URL}/admin/products`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
        Accept: "application/json",
        'X-Requested-With': 'XMLHttpRequest',
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    const data = await response.json();
    console.log('[productService] Raw response:', data);
    console.log('[productService] Products count:', (data.data || []).length);
    return data.data || data;
  } catch (error) {
    console.error("[productService] Error fetching products:", error);
    throw error;
  }
}

export async function getDetail(id) {
  try {
    const token = localStorage.getItem('admin_token');
    const response = await fetch(`${API_BASE_URL}/admin/products/${id}`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
        Accept: "application/json",
        'X-Requested-With': 'XMLHttpRequest',
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch product details');
    }
    const detail = await response.json();
    console.log('[productService] Product detail:', detail);
    return detail;
  } catch (error) {
    console.error("[productService] Error fetching product details:", error);
    throw error;
  }
}

export async function create(data) {
  try {
    return await fetchWithAuth('/admin/products', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
}

export async function update(id, data) {
  try {
    return await fetchWithAuth(`/admin/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
}

export async function remove(id) {
  try {
    return await fetchWithAuth(`/admin/products/${id}`, {
      method: 'DELETE',
    });
  } catch (error) {
    console.error('Error removing product:', error);
    throw error;
  }
}

export default { list, create, getDetail, update, remove };
