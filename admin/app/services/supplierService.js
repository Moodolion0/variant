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
    const data = await fetchWithAuth('/admin/suppliers');
    return data.data || data;
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    throw error;
  }
}

export async function getDetail(id) {
  try {
    return await fetchWithAuth(`/admin/suppliers/${id}`);
  } catch (error) {
    console.error('Error fetching supplier details:', error);
    throw error;
  }
}

export async function create(data) {
  try {
    return await fetchWithAuth('/admin/suppliers', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  } catch (error) {
    console.error('Error creating supplier:', error);
    throw error;
  }
}

export async function update(id, data) {
  try {
    return await fetchWithAuth(`/admin/suppliers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  } catch (error) {
    console.error('Error updating supplier:', error);
    throw error;
  }
}

export async function remove(id) {
  try {
    return await fetchWithAuth(`/admin/suppliers/${id}`, {
      method: 'DELETE',
    });
  } catch (error) {
    console.error('Error removing supplier:', error);
    throw error;
  }
}


export default { list, create, update, remove, getDetail };
