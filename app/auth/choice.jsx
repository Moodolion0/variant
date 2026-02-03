import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Choice() {
  const router = useRouter();

  const profiles = [
    {
      id: 'client',
      title: 'Acheteur',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB38ImTL1mJafMw3a_kxwbChmZNu8d82PbtIerhj7EX24MRKoSACsTQG6GEBlY1xf4G9aDpRBnLCMB8Uk3WS8g5hDNWa-G3iE3V4IQpG6jWGL6QtB6HyQj9a1iMu4_b5UP4PWD3IoAS3QuWyBPlmjhFtl9rSmEAePN0_utheaDBOkXxNu1AnthAe-SGMdZ0JqwglcXTKNi62Apco5QwYMwceuu3RZsGVSGw7KLLZtHtVfuJz0xGpEPGgxgChIMJDaKT140ZeYzdOpE',
    },
    {
      id: 'livreur',
      title: 'Livreur',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuACIMmRbrBxz1dALUK0f22ELWkZCYPkEK7ImMnwHtwM8Xfm7wMFR7guI-F789eKAAcaNgw-B_Pt5H8fc15KwFUDE7qDc3F12aGiijayfwoSZTnOmkkNK-s7YVhgBd1gEcUr5JdTHQDaoivpKtYTVB0gJARkvOWIwLAIhZ6uqpc8W2E-5lb15y0k7zcJAPjGSdZlGtpXiKjielDjtXeks_5OAVxSFew2YIMlHYa4m_4R5ShcOBCP5OO283KYm4EcDs8UXXlg68BQQBI',
    }
  ];

  const [selectedProfile, setSelectedProfile] = useState('client');

  const handleContinue = () => {
    if (selectedProfile === 'client') {
      router.push('/auth/register/client');
    } else if (selectedProfile === 'livreur') {
      router.push('/auth/register/livreur');
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
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.mainTitle}>Commencez l'aventure</Text>
          <Text style={styles.subtitle}>
            Choisissez votre type de compte pour continuer votre expérience.
          </Text>
        </View>

        {/* Profile Cards */}
        <View style={styles.profilesGrid}>
          {profiles.map((profile) => (
            <TouchableOpacity
              key={profile.id}
              style={[
                styles.profileCard,
                selectedProfile === profile.id && styles.profileCardSelected
              ]}
              onPress={() => setSelectedProfile(profile.id)}
              activeOpacity={0.8}
            >
              <View style={styles.profileImage}>
                <Image 
                  source={{ uri: profile.image }} 
                  style={styles.image}
                  resizeMode="cover"
                />
                <View style={styles.imageOverlay} />
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.profileTitle}>{profile.title}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Progress Indicator */}
        <View style={styles.progressIndicator}>
          <View style={[styles.progressDot, styles.progressDotActive]} />
          <View style={styles.progressDot} />
          <View style={styles.progressDot} />
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        <TouchableOpacity 
          style={styles.continueButton}
          onPress={handleContinue}
          activeOpacity={0.9}
        >
          <Text style={styles.continueButtonText}>Continuer</Text>
        </TouchableOpacity>
        
        <View style={styles.loginLink}>
          <Text style={styles.loginText}>Vous avez déjà un compte ? </Text>
          <TouchableOpacity onPress={() => router.push('/auth/login')}>
            <Text style={styles.loginLinkText}>Se connecter</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f7f8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  backButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  backText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111618',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111618',
    flex: 1,
    textAlign: 'center',
    marginRight: 64, // Compensate for back button
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  titleSection: {
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 32,
  },
  mainTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#111618',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#637f88',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 16,
  },
  profilesGrid: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 32,
  },
  profileCard: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileCardSelected: {
    borderColor: '#19b3e6',
  },
  profileImage: {
    height: 200,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '40%',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  profileInfo: {
    padding: 12,
    alignItems: 'center',
  },
  profileTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111618',
  },
  progressIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginTop: 32,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#dce3e5',
  },
  progressDotActive: {
    backgroundColor: '#19b3e6',
    width: 32,
  },
  bottomActions: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 16,
  },
  continueButton: {
    backgroundColor: '#19b3e6',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#19b3e6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    fontSize: 14,
    color: '#637f88',
  },
  loginLinkText: {
    fontSize: 14,
    color: '#19b3e6',
    fontWeight: 'bold',
  },
});
