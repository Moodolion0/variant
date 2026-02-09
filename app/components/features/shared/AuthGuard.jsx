import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '../../../shared/hooks/useAuth';

export default function AuthGuard({ children, requireAuth = true, allowedRoles = [] }) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Si le chargement est terminé
    if (!isLoading) {
      // Si l'authentification est requise mais que l'utilisateur n'est pas connecté
      if (requireAuth && !isAuthenticated) {
        router.replace('/auth/login');
        return;
      }

      // Si des rôles spécifiques sont requis et que l'utilisateur n'a pas le bon rôle
      if (requireAuth && isAuthenticated && allowedRoles.length > 0) {
        const userRole = user?.role;
        
        if (!allowedRoles.includes(userRole)) {
          // Rediriger selon le rôle actuel
          switch (userRole) {
            case 'client':
              router.replace('/(tabs)');
              break;
            case 'livreur':
              router.replace('/(livreur)');
              break;
            case 'admin':
              router.replace('/(admin)');
              break;
            default:
              router.replace('/auth/login');
          }
          return;
        }
      }

      // Si l'utilisateur est connecté mais essaie d'accéder aux pages d'auth
      if (isAuthenticated && (router.pathname === '/auth/login' || router.pathname === '/auth/register' || router.pathname === '/auth/choice')) {
        // Rediriger selon le rôle
        const userRole = user?.role;
        switch (userRole) {
          case 'client':
            router.replace('/(tabs)');
            break;
          case 'livreur':
            router.replace('/(livreur)');
            break;
          case 'admin':
            router.replace('/(admin)');
            break;
          default:
            router.replace('/(tabs)');
        }
        return;
      }
    }
  }, [isLoading, isAuthenticated, user, router, requireAuth, allowedRoles]);

  // Afficher un indicateur de chargement pendant la vérification
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f6f7f8' }}>
        <ActivityIndicator size="large" color="#19b3e6" />
      </View>
    );
  }

  // Si l'authentification est requise mais que l'utilisateur n'est pas connecté
  if (requireAuth && !isAuthenticated) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f6f7f8' }}>
        <ActivityIndicator size="large" color="#19b3e6" />
      </View>
    );
  }

  // Si des rôles spécifiques sont requis mais que l'utilisateur n'a pas le bon rôle
  if (requireAuth && isAuthenticated && allowedRoles.length > 0) {
    const userRole = user?.role;
    if (!allowedRoles.includes(userRole)) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f6f7f8' }}>
          <ActivityIndicator size="large" color="#19b3e6" />
        </View>
      );
    }
  }

  // Si tout est OK, afficher le contenu
  return children;
}
