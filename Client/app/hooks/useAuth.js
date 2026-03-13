import { useRouter } from "expo-router";
import { createContext, useContext, useEffect, useState } from "react";
import { Alert } from "react-native";
import { authService } from "../services/authService";

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
      // Timeout de 3 secondes pour éviter de rester bloqué
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Auth check timeout")), 3000),
      );

      const isAuth = await Promise.race([
        authService.isAuthenticated(),
        timeoutPromise,
      ]);

      if (isAuth) {
        const userData = await authService.getUserData();
        setUser(userData);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("Check auth status error:", error);
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
      if (response.user.role === "admin") {
        throw new Error(
          "Ce compte administrateur n'est pas autorisé sur cette application. Veuillez utiliser l'application admin.",
        );
      }

      setUser(response.user);
      setIsAuthenticated(true);
      await authService.storeUserData({ token: response.token, user: response.user });
      router.replace("/client");
    } catch (error) {
      console.error("Login hook error:", error);
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
      router.replace("/auth/login");

      return response;
    } catch (error) {
      console.error("Register hook error:", error);
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

      // Alerte visible pour confirmer la déconnexion
      try {
        Alert.alert("Déconnecté", "Vous avez été déconnecté.", [
          { text: "OK", onPress: () => router.replace("/auth/login") },
        ]);
      } catch (e) {
        // fallback si Alert n'est pas disponible
        router.replace("/auth/login");
      }
    } catch (error) {
      console.error("Logout hook error:", error);
      // Forcer le logout même en cas d'erreur
      setUser(null);
      setIsAuthenticated(false);
      try {
        Alert.alert("Déconnecté", "Vous avez été déconnecté.", [
          { text: "OK", onPress: () => router.replace("/auth/login") },
        ]);
      } catch (e) {
        router.replace("/auth/login");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Rediriger selon le rôle
  const redirectBasedOnRole = (role) => {
    switch (role) {
      case "client":
        router.replace("/client"); // Page d'accueil client
        break;
      case "livreur":
        router.replace("/livreur"); // Page livreur
        break;
      case "admin":
        // Ne devrait jamais arriver ici car on bloque les admins
        router.replace("/");
        break;
      default:
        router.replace("/"); // Page d'accueil par défaut
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

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook pour utiliser le contexte d'authentification
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}

// Hook pour protéger les routes
export function useRequireAuth() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/auth/login");
    }
  }, [isLoading, isAuthenticated, router]);

  return { isAuthenticated, isLoading, user };
}
