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

export async function list(type = 'client') {
  try {
    // Map frontend types to API role values
    const roleMap = {
      'buyer': 'client',
      'delivery': 'livreur',
      'supplier': 'fournisseur',
      'admin': 'admin',
      'client': 'client',
      'livreur': 'livreur',
      'fournisseur': 'fournisseur',
    };
    
    const role = roleMap[type] || type;
    const data = await fetchWithAuth(`/admin/users?role=${role}`);
    
    // Transform API response to frontend format if needed
    if (Array.isArray(data)) {
      return data.map(user => ({
        id: user.id,
        name: user.full_name,
        email: user.email,
        type: user.role === 'client' ? 'buyer' : 
              user.role === 'livreur' ? 'delivery' : 
              user.role,
        status: user.status === 'valide' ? 'active' : 
                user.status === 'en_attente' ? 'pending' : 
                'suspended',
        avatar: user.full_name?.substring(0, 2).toUpperCase() || 'U',
      }));
    }
    
    // If response is paginated
    if (data.data && Array.isArray(data.data)) {
      return data.data.map(user => ({
        id: user.id,
        name: user.full_name,
        email: user.email,
        type: user.role === 'client' ? 'buyer' : 
              user.role === 'livreur' ? 'delivery' : 
              user.role,
        status: user.status === 'valide' ? 'active' : 
                user.status === 'en_attente' ? 'pending' : 
                'suspended',
        avatar: user.full_name?.substring(0, 2).toUpperCase() || 'U',
      }));
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}

export async function getDetail(id) {
  try {
    const user = await fetchWithAuth(`/admin/users/${id}`);
    return {
      id: user.id,
      name: user.full_name,
      email: user.email,
      type: user.role === 'client' ? 'buyer' : 
            user.role === 'livreur' ? 'delivery' : 
            user.role,
      status: user.status === 'valide' ? 'active' : 
              user.status === 'en_attente' ? 'pending' : 
              'suspended',
      avatar: user.full_name?.substring(0, 2).toUpperCase() || 'U',
    };
  } catch (error) {
    console.error('Error fetching user details:', error);
    throw error;
  }
}

export default { list, getDetail };
