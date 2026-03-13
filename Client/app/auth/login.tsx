import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { authService } from '../services/authService';

// Couleurs temporaires
const colors = {
  primary: '#19b3e6',
  backgroundLight: '#f6f7f8',
  textPrimary: '#111618',
  textSecondary: '#637f88',
};

// Composant temporaire InputField
const InputField = ({ label, placeholder, value, onChangeText, keyboardType, icon, secureTextEntry, onIconPress }: any) => (
  <View style={styles.inputContainer}>
    <Text style={styles.inputLabel}>{label}</Text>
    <View style={styles.inputWrapper}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
      />
      {icon && (
        <TouchableOpacity onPress={onIconPress} style={styles.iconButton}>
          <Text>{icon}</Text>
        </TouchableOpacity>
      )}
    </View>
  </View>
);

export default function Login() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Effacer le message d'erreur quand l'utilisateur tape
    if (errorMessage) setErrorMessage('');
  };

  const handleLogin = async () => {
    if (!formData.email || !formData.password) {
      setErrorMessage('Veuillez remplir tous les champs');
      return;
    }

    setIsLoggingIn(true);
    setErrorMessage('');
    
    try {
      const result = await authService.login(formData.email, formData.password);
      console.log('Connexion réussie:', result);
      
      // Redirection selon le rôle
      const user = result.user;
      if (user.role === 'livreur') {
        router.replace('/livreur');
      } else if (user.role === 'fournisseur') {
        router.replace('/fournisseur');
      } else {
        // client ou admin
        router.replace('/client');
      }
    } catch (error: any) {
      console.log('Erreur connexion:', error);
      console.log('Message erreur:', error.message);
      setErrorMessage(error.message || 'Identifiants incorrects');
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.logoSection}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoIcon}>🛒</Text>
          </View>
          <Text style={styles.logoText}>E-Commerce</Text>
          <Text style={styles.logoSubtitle}>Multi-profils</Text>
        </View>

        <View style={styles.formSection}>
          {/* Message d'erreur */}
          {errorMessage ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          ) : null}

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
            style={[styles.loginButton, isLoggingIn && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={isLoggingIn}
            activeOpacity={0.9}
          >
            <Text style={styles.loginButtonText}>
              {isLoggingIn ? 'Connexion...' : 'Se connecter'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.signUpSection}>
          <Text style={styles.signUpText}>Pas encore de compte ? </Text>
          <TouchableOpacity onPress={() => router.push('/auth/choice')}>
            <Text style={styles.signUpLinkText}>S'inscrire</Text>
          </TouchableOpacity>
        </View>

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
  errorContainer: {
    backgroundColor: '#fee2e2',
    borderColor: '#fecaca',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: '#dc2626',
    fontSize: 14,
    textAlign: 'center',
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
    height: 213,
    borderRadius: 12,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111618',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  input: {
    flex: 1,
    padding: 16,
    fontSize: 16,
    color: '#111618',
  },
  iconButton: {
    padding: 16,
  },
});
