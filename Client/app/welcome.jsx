import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

export default function Welcome() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.title}>Bienvenue sur Variant</Text>
          <Text style={styles.subtitle}>Votre marketplace locale</Text>
        </View>

        {/* Hero Section */}
        <View style={styles.hero}>
          <View style={styles.heroCard}>
            <Text style={styles.heroTitle}>Découvrez des produits près de chez vous</Text>
            <Text style={styles.heroDescription}>
              Commandez et faites-vous livrer en moins d'une heure par nos livreurs locaux
            </Text>
          </View>
        </View>

        {/* Features */}
        <View style={styles.features}>
          <View style={styles.featureCard}>
            <View style={[styles.featureIcon, { backgroundColor: '#e3f2fd' }]}>
              <Text style={styles.featureIconText}>🛍️</Text>
            </View>
            <Text style={styles.featureTitle}>Shopping Local</Text>
            <Text style={styles.featureDescription}>Soutenez les commerces de votre quartier</Text>
          </View>

          <View style={styles.featureCard}>
            <View style={[styles.featureIcon, { backgroundColor: '#f3e5f5' }]}>
              <Text style={styles.featureIconText}>🚚</Text>
            </View>
            <Text style={styles.featureTitle}>Livraison Rapide</Text>
            <Text style={styles.featureDescription}>Livraison en moins d'1km, moins d'une heure</Text>
          </View>

          <View style={styles.featureCard}>
            <View style={[styles.featureIcon, { backgroundColor: '#e8f5e8' }]}>
              <Text style={styles.featureIconText}>💰</Text>
            </View>
            <Text style={styles.featureTitle}>Devenez Livreur</Text>
            <Text style={styles.featureDescription}>Gagnez de l'argent en livrant localement</Text>
          </View>
        </View>

        {/* CTA Section */}
        <View style={styles.ctaSection}>
          <Text style={styles.ctaTitle}>Prêt à commencer ?</Text>
          <Text style={styles.ctaDescription}>
            Rejoignez notre communauté et découvrez une nouvelle façon de shopping
          </Text>
          
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={() => router.push('/auth/register')}
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
  hero: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  heroCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111618',
    textAlign: 'center',
    marginBottom: 12,
  },
  heroDescription: {
    fontSize: 16,
    color: '#637f88',
    textAlign: 'center',
    lineHeight: 24,
  },
  features: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  featureCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureIconText: {
    fontSize: 20,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111618',
    marginBottom: 4,
    flex: 1,
  },
  featureDescription: {
    fontSize: 14,
    color: '#637f88',
    flex: 1,
  },
  ctaSection: {
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111618',
    textAlign: 'center',
    marginBottom: 8,
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
