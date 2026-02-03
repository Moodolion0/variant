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

export const authService = {
  // Login
  async login(email, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erreur de connexion');
      }

      // Stocker le token et les infos utilisateur
      if (data.token) {
        await this.storeUserData(data);
      }

      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  // Register
  async register(userData) {
    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erreur d\'inscription');
      }

      // Stocker le token et les infos utilisateur si disponible
      if (data.token) {
        await this.storeUserData(data);
      }

      return data;
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  },

  // Logout
  async logout() {
    try {
      const token = await this.getToken();
      
      if (token) {
        await fetch(`${API_BASE_URL}/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
            'X-Requested-With': 'XMLHttpRequest',
          },
        });
      }

      // Nettoyer les données locales
      await this.clearUserData();
    } catch (error) {
      console.error('Logout error:', error);
      // Nettoyer quand même en cas d'erreur
      await this.clearUserData();
    }
  },

  // Obtenir le profil utilisateur
  async getProfile() {
    try {
      const token = await this.getToken();
      
      if (!token) {
        throw new Error('Non authentifié');
      }

      const response = await fetch(`${API_BASE_URL}/profile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
          'X-Requested-With': 'XMLHttpRequest',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erreur de récupération du profil');
      }

      return data;
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  },

  // Stocker les données utilisateur
  async storeUserData(userData) {
    try {
      await AsyncStorage.setItem('auth_token', userData.token);
      await AsyncStorage.setItem('user_data', JSON.stringify(userData.user || userData));
      return true;
    } catch (error) {
      console.error('Store user data error:', error);
      return false;
    }
  },

  // Obtenir le token
  async getToken() {
    try {
      return await AsyncStorage.getItem('auth_token');
    } catch (error) {
      console.error('Get token error:', error);
      return null;
    }
  },

  // Obtenir les données utilisateur
  async getUserData() {
    try {
      const userData = await AsyncStorage.getItem('user_data');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Get user data error:', error);
      return null;
    }
  },

  // Nettoyer les données utilisateur
  async clearUserData() {
    try {
      await AsyncStorage.removeItem('auth_token');
      await AsyncStorage.removeItem('user_data');
      return true;
    } catch (error) {
      console.error('Clear user data error:', error);
      return false;
    }
  },

  // Vérifier si l'utilisateur est connecté
  async isAuthenticated() {
    try {
      const token = await this.getToken();
      return !!token;
    } catch (error) {
      console.error('Check auth error:', error);
      return false;
    }
  },

  // Rafraîchir le token
  async refreshToken() {
    try {
      const token = await this.getToken();
      
      if (!token) {
        throw new Error('Pas de token à rafraîchir');
      }

      const response = await fetch(`${API_BASE_URL}/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
          'X-Requested-With': 'XMLHttpRequest',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erreur de rafraîchissement du token');
      }

      if (data.token) {
        await this.storeUserData({ token, user: await this.getUserData() });
      }

      return data;
    } catch (error) {
      console.error('Refresh token error:', error);
      // En cas d'erreur de rafraîchissement, déconnecter l'utilisateur
      await this.clearUserData();
      throw error;
    }
  },
};
