import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { authService } from '../../services/authService';

// Couleurs temporaires
const colors = {
  primary: '#19b3e6',
  backgroundLight: '#f6f7f8',
  textPrimary: '#111618',
  textSecondary: '#637f88',
};

// Composant temporaire InputField
const InputField = ({ label, placeholder, value, onChangeText, keyboardType, secureTextEntry, onIconPress, icon }: any) => (
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

export default function RegisterLivreur() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    vehicleType: '',
    licensePlate: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    // Validation basique
    if (!formData.name || !formData.email || !formData.phone || !formData.password || !formData.vehicleType || !formData.licensePlate) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas');
      return;
    }

    setIsRegistering(true);
    try {
      const result = await authService.register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: 'livreur'
      });
      Alert.alert('Succès', 'Compte livreur créé avec succès ! En attente de validation.', [
        {
          text: 'OK',
          onPress: () => {
            router.replace('/auth/login');
          }
        }
      ]);
    } catch (error: any) {
      Alert.alert('Erreur', error.message || 'Impossible de créer le compte');
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Inscription Livreur</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.titleSection}>
          <Text style={styles.mainTitle}>Devenir livreur</Text>
          <Text style={styles.subtitle}>
            Rejoignez notre flotte de partenaires et commencez à gagner de l'argent dès aujourd'hui.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informations personnelles</Text>
          
          <InputField
            label="Nom complet"
            placeholder="Ex: Jean Dupont"
            value={formData.name}
            onChangeText={(value) => updateField('name', value)}
          />

          <InputField
            label="Email professionnel"
            placeholder="jean.dupont@exemple.com"
            value={formData.email}
            onChangeText={(value) => updateField('email', value)}
            keyboardType="email-address"
          />

          <InputField
            label="Numéro de téléphone"
            placeholder="+33 6 00 00 00 00"
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
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Documents obligatoires</Text>
          <Text style={styles.documentsSubtitle}>
            Formats acceptés : JPG, PNG, PDF (Max 5Mo)
          </Text>
          
          <TouchableOpacity style={styles.documentCard}>
            <View style={styles.documentInfo}>
              <View style={styles.documentIcon}>
                <Text style={styles.documentIconText}>🆔</Text>
              </View>
              <View>
                <Text style={styles.documentTitle}>Pièce d'identité</Text>
                <Text style={styles.documentDescription}>Recto / Verso</Text>
              </View>
            </View>
            <Text style={styles.uploadIcon}>⬆️</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.documentCard}>
            <View style={styles.documentInfo}>
              <View style={styles.documentIcon}>
                <Text style={styles.documentIconText}>🪪</Text>
              </View>
              <View>
                <Text style={styles.documentTitle}>Permis de conduire</Text>
                <Text style={styles.documentDescription}>En cours de validité</Text>
              </View>
            </View>
            <Text style={styles.uploadIcon}>⬆️</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoBoxIcon}>ℹ️</Text>
          <Text style={styles.infoBoxText}>
            Votre candidature sera examinée par un administrateur. Vous recevrez une notification de validation sous 24h à 48h.
          </Text>
        </View>

        <View style={styles.submitSection}>
          <TouchableOpacity 
            style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
            onPress={handleRegister}
            disabled={isLoading}
            activeOpacity={0.9}
          >
            <Text style={styles.submitButtonText}>
              {isLoading ? 'Soumission...' : 'Soumettre ma candidature'}
            </Text>
          </TouchableOpacity>

          <Text style={styles.termsText}>
            En cliquant sur "Soumettre", vous acceptez nos{' '}
            <Text style={styles.termsLink}>Conditions Générales</Text>
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
    width: 40,
    height: 40,
    borderRadius: 20,
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
    marginRight: 48,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  titleSection: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 16,
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
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111618',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  documentsSubtitle: {
    fontSize: 12,
    color: '#637f88',
    marginBottom: 12,
  },
  documentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderWidth: 2,
    borderColor: '#dce3e5',
    borderStyle: 'dashed',
    borderRadius: 12,
    backgroundColor: '#fff',
    marginBottom: 12,
  },
  documentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  documentIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: 'rgba(25, 179, 230, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  documentIconText: {
    fontSize: 20,
  },
  documentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111618',
    marginBottom: 2,
  },
  documentDescription: {
    fontSize: 12,
    color: '#637f88',
  },
  uploadIcon: {
    fontSize: 20,
    color: '#19b3e6',
  },
  infoBox: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: 'rgba(25, 179, 230, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(25, 179, 230, 0.2)',
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 24,
  },
  infoBoxIcon: {
    fontSize: 16,
    color: '#19b3e6',
    marginRight: 12,
  },
  infoBoxText: {
    flex: 1,
    fontSize: 14,
    color: '#111618',
    lineHeight: 20,
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
    marginBottom: 16,
  },
  submitButtonDisabled: {
    backgroundColor: '#a0d0e8',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
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
    color: colors.textPrimary,
  },
  iconButton: {
    padding: 16,
  },
});
