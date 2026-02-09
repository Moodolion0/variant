import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Couleurs temporaires
const colors = {
  primary: '#19b3e6',
  backgroundLight: '#f6f7f8',
  textPrimary: '#111618',
  textSecondary: '#637f88',
};

export default function ChoiceScreen() {
  const router = useRouter();
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null);

  const handleProfileSelect = (profile: string) => {
    setSelectedProfile(profile);
  };

  const handleContinue = () => {
    if (selectedProfile) {
      if (selectedProfile === 'acheteur') {
        router.push('/auth/register/client');
      } else if (selectedProfile === 'livreur') {
        router.push('/auth/register/livreur');
      }
    } else {
      Alert.alert('Sélection requise', 'Veuillez choisir un type de compte pour continuer');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Inscription</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {/* Header Text Section */}
        <View style={styles.titleSection}>
          <Text style={styles.mainTitle}>Commencez l'aventure</Text>
          <Text style={styles.subtitle}>
            Choisissez votre type de compte pour continuer votre expérience.
          </Text>
        </View>

        {/* Visual Selection Cards */}
        <View style={styles.cardsContainer}>
          {/* Option 1: Acheteur */}
          <TouchableOpacity 
            style={[
              styles.profileCard,
              selectedProfile === 'acheteur' && styles.selectedCard
            ]}
            onPress={() => handleProfileSelect('acheteur')}
          >
            <View style={styles.cardImageContainer}>
              <Image 
                source={{ uri: 'https://picsum.photos/seed/shopper/200/300' }}
                style={styles.cardImage}
                resizeMode="cover"
              />
              <View style={styles.imageOverlay} />
              {selectedProfile === 'acheteur' && (
                <View style={styles.checkIcon}>
                  <Text style={styles.checkText}>✓</Text>
                </View>
              )}
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Acheteur</Text>
            </View>
          </TouchableOpacity>

          {/* Option 2: Livreur */}
          <TouchableOpacity 
            style={[
              styles.profileCard,
              selectedProfile === 'livreur' && styles.selectedCard
            ]}
            onPress={() => handleProfileSelect('livreur')}
          >
            <View style={styles.cardImageContainer}>
              <Image 
                source={{ uri: 'https://picsum.photos/seed/delivery/200/300' }}
                style={styles.cardImage}
                resizeMode="cover"
              />
              <View style={styles.imageOverlay} />
              {selectedProfile === 'livreur' && (
                <View style={styles.checkIcon}>
                  <Text style={styles.checkText}>✓</Text>
                </View>
              )}
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Livreur</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Progress indicator */}
        <View style={styles.progressIndicator}>
          <View style={[styles.progressDot, styles.activeDot]} />
          <View style={[styles.progressDot, styles.inactiveDot]} />
          <View style={[styles.progressDot, styles.inactiveDot]} />
        </View>
      </View>

      {/* Sticky Bottom Actions */}
      <View style={styles.bottomActions}>
        <TouchableOpacity 
          style={[
            styles.continueButton,
            !selectedProfile && styles.disabledButton
          ]}
          onPress={handleContinue}
          disabled={!selectedProfile}
        >
          <Text style={styles.continueButtonText}>Continuer</Text>
        </TouchableOpacity>
        
        <View style={styles.loginSection}>
          <Text style={styles.loginText}>Vous avez déjà un compte ?</Text>
          <TouchableOpacity onPress={() => router.push('/auth/login')}>
            <Text style={styles.loginLink}>Se connecter</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    paddingTop: 50,
    backgroundColor: colors.backgroundLight,
  },
  backButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    flex: 1,
    textAlign: 'center',
    paddingRight: 48,
  },
  placeholder: {
    width: 48,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
  },
  titleSection: {
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 32,
  },
  mainTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 16,
  },
  cardsContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 32,
  },
  profileCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedCard: {
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOpacity: 0.3,
  },
  cardImageContainer: {
    height: 200,
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  cardContent: {
    padding: 12,
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  checkIcon: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  checkText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  progressIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginTop: 32,
  },
  progressDot: {
    height: 6,
    borderRadius: 3,
  },
  activeDot: {
    width: 32,
    backgroundColor: colors.primary,
  },
  inactiveDot: {
    width: 8,
    backgroundColor: '#dce3e5',
  },
  bottomActions: {
    paddingHorizontal: 16,
    paddingBottom: 32,
    gap: 16,
  },
  continueButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  disabledButton: {
    backgroundColor: '#a0d0e8',
    shadowOpacity: 0,
    elevation: 0,
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginSection: {
    alignItems: 'center',
    gap: 8,
  },
  loginText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  loginLink: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primary,
  },
});
