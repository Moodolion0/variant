import { useRouter } from 'expo-router';
import { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../services/authService';

// Créer le contexte d'authentification
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  // Vérifier l'état d'authentification au démarrage
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const isAuth = await authService.isAuthenticated();
      
      if (isAuth) {
        const userData = await authService.getUserData();
        setUser(userData);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Check auth status error:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction de login
  const login = async (email, password) => {
    try {
      setIsLoading(true);
      
      const response = await authService.login(email, password);
      
      // Vérifier si l'utilisateur est admin et bloquer l'accès sur l'application client
      if (response.user.role === 'admin') {
        throw new Error('Ce compte administrateur n\'est pas autorisé sur cette application. Veuillez utiliser l\'application admin.');
      }
      
      setUser(response.user);
      setIsAuthenticated(true);
      await authService.storeUserData(response.token, response.user);
      alert("lol")
      redirectBasedOnRole(response.user.role);
    } catch (error) {
      console.error('Login hook error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction d'inscription
  const register = async (userData) => {
    try {
      setIsLoading(true);
      
      const response = await authService.register(userData);
      
      // Après inscription réussie, rediriger vers la page de login
      // L'utilisateur devra se connecter avec ses nouveaux identifiants
      router.replace('/auth/login');
      
      return response;
    } catch (error) {
      console.error('Register hook error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction de logout
  const logout = async () => {
    try {
      setIsLoading(true);
      await authService.logout();
      setUser(null);
      setIsAuthenticated(false);
      
      // Rediriger vers la page d'accueil
      router.replace('/');
    } catch (error) {
      console.error('Logout hook error:', error);
      // Forcer le logout même en cas d'erreur
      setUser(null);
      setIsAuthenticated(false);
      router.replace('/');
    } finally {
      setIsLoading(false);
    }
  };

  // Rediriger selon le rôle
  const redirectBasedOnRole = (role) => {
    switch (role) {
      case 'client':
        router.replace('/cart'); // Page d'accueil client
        break;
      case 'livreur':
        router.replace('/livreur'); // Page livreur
        break;
      case 'admin':
        // Ne devrait jamais arriver ici car on bloque les admins
        router.replace('/');
        break;
      default:
        router.replace('/'); // Page d'accueil par défaut
    }
  };

  // Mettre à jour le profil utilisateur
  const updateProfile = (userData) => {
    setUser(userData);
  };

  // Valeurs fournies par le contexte
  const value = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile,
    checkAuthStatus,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook pour utiliser le contexte d'authentification
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}

// Hook pour protéger les routes
export function useRequireAuth() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/auth/login');
    }
  }, [isLoading, isAuthenticated, router]);

  return { isAuthenticated, isLoading, user };
}
