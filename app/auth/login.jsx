import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import InputField from '../components/auth/InputField';
import { useAuth } from '../hooks/useAuth';

export default function Login() {
  const router = useRouter();
  const { login, isLoading } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLogin = async () => {
    if (!formData.email || !formData.password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    try {
      await login(formData.email, formData.password);
      // La redirection est gérée dans le hook useAuth
    } catch (error) {
      Alert.alert('Erreur de connexion', error.message || 'Identifiants incorrects');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Logo Section */}
        <View style={styles.logoSection}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoIcon}>🛒</Text>
          </View>
          <Text style={styles.welcomeTitle}>Bienvenue</Text>
          <Text style={styles.welcomeSubtitle}>Accédez à votre compte pour continuer</Text>
        </View>

        {/* Login Form */}
        <View style={styles.formContainer}>
          <InputField
            label="Email"
            placeholder="exemple@email.com"
            value={formData.email}
            onChangeText={(value) => updateField('email', value)}
            keyboardType="email-address"
            icon="📧"
          />

          <InputField
            label="Mot de passe"
            placeholder="••••••••"
            value={formData.password}
            onChangeText={(value) => updateField('password', value)}
            secureTextEntry={!showPassword}
            icon="🔒"
            onIconPress={() => setShowPassword(!showPassword)}
          />

          <TouchableOpacity style={styles.forgotPasswordLink}>
            <Text style={styles.forgotPasswordText}>Mot de passe oublié ?</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={isLoading}
            activeOpacity={0.9}
          >
            <Text style={styles.loginButtonText}>
              {isLoading ? 'Connexion...' : 'Se connecter'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Sign Up Link */}
        <View style={styles.signUpSection}>
          <Text style={styles.signUpText}>Pas encore de compte ? </Text>
          <TouchableOpacity onPress={() => router.push('/auth/choice')}>
            <Text style={styles.signUpLinkText}>S'inscrire</Text>
          </TouchableOpacity>
        </View>

        {/* Background Illustration */}
        <View style={styles.illustrationContainer}>
          <Image 
            source={{ 
              uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA28Ispi7mH7erl1Ep2_ZDNIRX0BscAGzOXfVINtrgsxY3RrfCT7QDlHy7tFIN9bSwJZN7VcNi_xv2tVVkykDSgBeqzJkjVxKmu_hUwVxjNyppjxDNNAQoaKJ6ROdQ4Ceadbm67B6bNi5xA4vanhOnx0WWvRlDaj5AJwf6G8sSW7XuCwh0nxvqDmbzpykkTC8S6rq-vvFn44ENmfkQKJRMVpp0UMxfJpq_TZsZEfW4687clURGHLzSCsRFhsasXoIDvgahmL1ZTDBQ'
            }} 
            style={styles.illustration}
            resizeMode="cover"
          />
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
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  logoSection: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 32,
  },
  logoContainer: {
    width: 96,
    height: 96,
    backgroundColor: '#19b3e6',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#19b3e6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  logoIcon: {
    fontSize: 48,
    color: '#fff',
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111618',
    textAlign: 'center',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: '#637f88',
    textAlign: 'center',
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  forgotPasswordLink: {
    alignSelf: 'flex-end',
    marginBottom: 32,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#19b3e6',
    fontWeight: '500',
  },
  loginButton: {
    backgroundColor: '#19b3e6',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#19b3e6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  loginButtonDisabled: {
    backgroundColor: '#a0d0e8',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signUpSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32,
  },
  signUpText: {
    fontSize: 16,
    color: '#637f88',
  },
  signUpLinkText: {
    fontSize: 16,
    color: '#19b3e6',
    fontWeight: 'bold',
  },
  illustrationContainer: {
    marginTop: 48,
    width: '100%',
    maxWidth: 320,
    alignSelf: 'center',
    opacity: 0.4,
  },
  illustration: {
    width: '100%',
    height: 213, // aspect ratio 3/2
    borderRadius: 12,
  },
});
