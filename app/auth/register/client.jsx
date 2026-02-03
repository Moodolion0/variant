import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import InputField from '../../components/auth/InputField';
import { useAuth } from '../../hooks/useAuth';

export default function RegisterClient() {
  const router = useRouter();
  const { register, isLoading } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'client',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRegister = async () => {
    const { name, email, phone, password, confirmPassword } = formData;
    
    if (!name || !email || !phone || !password || !confirmPassword) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Erreur', 'Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    try {
      await register(formData);
      // La redirection est gérée dans le hook useAuth
    } catch (error) {
      Alert.alert('Erreur d\'inscription', error.message || 'Une erreur est survenue lors de l\'inscription');
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
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.mainTitle}>Créer votre compte</Text>
          <Text style={styles.subtitle}>
            Rejoignez notre communauté d'acheteurs pour profiter de nos meilleures offres.
          </Text>
        </View>

        {/* Form Fields */}
        <View style={styles.formSection}>
          <InputField
            label="Nom complet"
            placeholder="Ex: Jean Dupont"
            value={formData.name}
            onChangeText={(value) => updateField('name', value)}
          />

          <InputField
            label="Email"
            placeholder="exemple@email.com"
            value={formData.email}
            onChangeText={(value) => updateField('email', value)}
            keyboardType="email-address"
          />

          <InputField
            label="Numéro de téléphone"
            placeholder="+33 6 12 34 56 78"
            value={formData.phone}
            onChangeText={(value) => updateField('phone', value)}
            keyboardType="phone-pad"
          />

          <InputField
            label="Mot de passe"
            placeholder="••••••••"
            value={formData.password}
            onChangeText={(value) => updateField('password', value)}
            secureTextEntry={!showPassword}
            onIconPress={() => setShowPassword(!showPassword)}
            icon="👁️"
          />

          <InputField
            label="Confirmation Mot de passe"
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChangeText={(value) => updateField('confirmPassword', value)}
            secureTextEntry={!showConfirmPassword}
            onIconPress={() => setShowConfirmPassword(!showConfirmPassword)}
            icon="👁️"
          />
        </View>

        {/* Submit Button */}
        <View style={styles.submitSection}>
          <TouchableOpacity 
            style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
            onPress={handleRegister}
            disabled={isLoading}
            activeOpacity={0.9}
          >
            <Text style={styles.submitButtonText}>
              {isLoading ? 'Création...' : 'Créer mon compte acheteur'}
            </Text>
          </TouchableOpacity>

          <View style={styles.loginLink}>
            <Text style={styles.loginText}>Déjà un compte ?</Text>
            <TouchableOpacity onPress={() => router.push('/auth/login')}>
              <Text style={styles.loginLinkText}>Se connecter</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Terms */}
        <View style={styles.termsSection}>
          <Text style={styles.termsText}>
            En créant un compte, vous acceptez nos{' '}
            <Text style={styles.termsLink}>Conditions d'Utilisation</Text>
            {' '}et notre{' '}
            <Text style={styles.termsLink}>Politique de Confidentialité</Text>.
          </Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
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
    marginRight: 64,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  titleSection: {
    paddingTop: 32,
    paddingBottom: 24,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111618',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#637f88',
    lineHeight: 24,
  },
  formSection: {
    marginBottom: 32,
  },
  submitSection: {
    paddingHorizontal: 16,
    paddingVertical: 32,
  },
  submitButton: {
    backgroundColor: '#19b3e6',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#19b3e6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 24,
  },
  submitButtonDisabled: {
    backgroundColor: '#a0d0e8',
  },
  submitButtonText: {
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
    fontSize: 16,
    color: '#637f88',
  },
  loginLinkText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#19b3e6',
  },
  termsSection: {
    paddingHorizontal: 32,
    paddingVertical: 20,
  },
  termsText: {
    fontSize: 12,
    color: '#637f88',
    textAlign: 'center',
    lineHeight: 18,
  },
  termsLink: {
    color: '#19b3e6',
    textDecorationLine: 'underline',
  },
});
