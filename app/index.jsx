import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Composant temporaire AuthGuard
const AuthGuard = ({ children, requireAuth }) => {
  if (requireAuth) {
    // Pour l'instant, on retourne toujours les enfants
    return <>{children}</>;
  }
  return <>{children}</>;
};

// Hook temporaire useAuth
const useAuth = () => ({
  isAuthenticated: false,
  isLoading: false,
});

export default function Welcome() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  // Si l'utilisateur est déjà connecté, il sera redirigé automatiquement par AuthGuard
  if (isAuthenticated) {
    return null;
  }

  return (
    <AuthGuard requireAuth={false}>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header Section */}
          <View style={styles.header}>
            <Text style={styles.title}>Bienvenue sur Variant</Text>
            <Text style={styles.subtitle}>Votre marketplace locale</Text>
          </View>

          {/* Simple CTA Section */}
          <View style={styles.ctaSection}>
            <Text style={styles.ctaDescription}>
              Rejoignez notre communauté de shopping local
            </Text>
            
            <TouchableOpacity 
              style={styles.primaryButton}
              onPress={() => router.push('/auth/choice')}
            >
              <Text style={styles.primaryButtonText}>S'inscrire</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.secondaryButton}
              onPress={() => router.push('/auth/login')}
            >
              <Text style={styles.secondaryButtonText}>Se connecter</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </AuthGuard>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f7f8',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 32,
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#111618',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#637f88',
    textAlign: 'center',
  },
  ctaSection: {
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  ctaDescription: {
    fontSize: 16,
    color: '#637f88',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  primaryButton: {
    backgroundColor: '#19b3e6',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    width: '100%',
    marginBottom: 12,
    shadowColor: '#19b3e6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    width: '100%',
    borderWidth: 2,
    borderColor: '#19b3e6',
  },
  secondaryButtonText: {
    color: '#19b3e6',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});