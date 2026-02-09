import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { authService } from '../../services/authService';

// Couleurs temporaires
const colors = {
  primary: '#19b3e6',
  backgroundLight: '#f6f7f8',
  textPrimary: '#111618',
  textSecondary: '#637f88',
};

// Hook temporaire
const useAuth = () => ({
  register: authService.register,
  isLoading: false,
});

export default function RegisterClient() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Effacer le message d'erreur quand l'utilisateur tape
    if (errorMessage) setErrorMessage('');
  };

  const handleSubmit = async () => {
    // Validation basique
    if (!formData.name || !formData.email || !formData.phone || !formData.password) {
      setErrorMessage('Veuillez remplir tous les champs');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Les mots de passe ne correspondent pas');
      return;
    }

    setIsRegistering(true);
    setErrorMessage('');
    
    try {
      const result = await authService.register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: 'client'
      });
      console.log('Inscription réussie:', result);
      
      // Redirection directe après succès
      router.replace('/auth/login');
    } catch (error: any) {
      console.log('Erreur inscription:', error);
      console.log('Message erreur:', error.message);
      setErrorMessage(error.message || 'Impossible de créer le compte');
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Inscription Acheteur</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Main Content */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Headline Section */}
        <View style={styles.headlineSection}>
          <Text style={styles.headlineTitle}>Créer un compte client</Text>
          <Text style={styles.headlineSubtitle}>
            Rejoignez-nous et profitez de la meilleure expérience de shopping.
          </Text>
        </View>

        {/* Form Section */}
        <View style={styles.formSection}>
          {/* Message d'erreur */}
          {errorMessage ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          ) : null}

          {/* Nom complet */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Nom complet</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Jean Dupont"
              value={formData.name}
              onChangeText={(value) => handleInputChange('name', value)}
            />
          </View>

          {/* Email */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="exemple@email.com"
              keyboardType="email-address"
              value={formData.email}
              onChangeText={(value) => handleInputChange('email', value)}
            />
          </View>

          {/* Téléphone */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Numéro de téléphone</Text>
            <TextInput
              style={styles.input}
              placeholder="+33 6 12 34 56 78"
              keyboardType="phone-pad"
              value={formData.phone}
              onChangeText={(value) => handleInputChange('phone', value)}
            />
          </View>

          {/* Mot de passe */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Mot de passe</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="••••••••"
                secureTextEntry={!showPassword}
                value={formData.password}
                onChangeText={(value) => handleInputChange('password', value)}
              />
              <TouchableOpacity 
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Text style={styles.iconText}>{showPassword ? '👁️' : '👁️‍🗨️'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Confirmation Mot de passe */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Confirmer le mot de passe</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="••••••••"
                secureTextEntry={!showConfirmPassword}
                value={formData.confirmPassword}
                onChangeText={(value) => handleInputChange('confirmPassword', value)}
              />
              <TouchableOpacity 
                style={styles.eyeIcon}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <Text style={styles.iconText}>{showConfirmPassword ? '👁️' : '👁️‍🗨️'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Submit Button */}
        <View style={styles.submitSection}>
          <TouchableOpacity 
            style={styles.submitButton}
            onPress={handleSubmit}
            disabled={isRegistering}
          >
            <Text style={styles.submitButtonText}>
              {isRegistering ? 'Création...' : 'Créer mon compte acheteur'}
            </Text>
          </TouchableOpacity>
          
          <View style={styles.loginSection}>
            <Text style={styles.loginText}>Déjà un compte ?</Text>
            <TouchableOpacity onPress={() => router.push('/auth/login')}>
              <Text style={styles.loginLink}>Se connecter</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Security/TOS Footer */}
        <View style={styles.footerSection}>
          <Text style={styles.footerText}>
            En créant un compte, vous acceptez nos Conditions d'Utilisation et notre Politique de Confidentialité.
          </Text>
        </View>
      </ScrollView>
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
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    paddingTop: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  backButton: {
    width: 48,
    height: 48,
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
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  headlineSection: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 16,
  },
  formSection: {
    paddingHorizontal: 16,
    gap: 16,
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
  headlineTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  headlineSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  formContainer: {
    gap: 8,
  },
  fieldContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textPrimary,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#dce3e5',
    borderRadius: 8,
    backgroundColor: '#fff',
    height: 56,
    paddingHorizontal: 15,
    fontSize: 16,
    color: colors.textPrimary,
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    borderWidth: 1,
    borderColor: '#dce3e5',
    borderRadius: 8,
    backgroundColor: '#fff',
    height: 56,
    paddingHorizontal: 15,
    paddingRight: 48,
    fontSize: 16,
    color: colors.textPrimary,
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    top: 18,
  },
  iconText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  submitSection: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    gap: 16,
  },
  submitButton: {
    backgroundColor: colors.primary,
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  loginText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  loginLink: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  footerSection: {
    paddingHorizontal: 32,
    paddingBottom: 20,
    paddingTop: 16,
  },
  footerText: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
});
