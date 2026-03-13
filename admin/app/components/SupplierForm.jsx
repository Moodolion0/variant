import { MaterialIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";

// Dynamically import expo-location with fallback
let Location = null;
try {
  Location = require("expo-location");
} catch (e) {
  console.warn("expo-location not available:", e.message);
}
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    ActivityIndicator,
} from "react-native";
import supplierService from "../services/supplierService";
import MapPicker from "./MapPicker";

export default function SupplierForm({ token, onDone }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address_text: "",
    latitude: null,
    longitude: null,
    password: "fournisseur123", // Mot de passe par défaut
    confirmPassword: "fournisseur123",
  });
  const [loading, setLoading] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);

  // Get current location on mount
  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    if (!Location) {
      console.warn("Location module not available, skipping automatic location");
      return;
    }

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission refusée",
          "Nous avons besoin de l'accès à votre localisation pour continuer"
        );
        return;
      }

      setLoadingLocation(true);
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      setForm((prev) => ({
        ...prev,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      }));
      setLoadingLocation(false);
    } catch (error) {
      console.error("Erreur de localisation:", error);
      Alert.alert("Erreur", "Impossible d'accéder à votre localisation");
      setLoadingLocation(false);
    }
  };

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleMapClick = (lat, lng) => {
    setForm((prev) => ({
      ...prev,
      latitude: lat,
      longitude: lng,
    }));
  };

  async function handleSubmit() {
    if (!form.name.trim()) {
      Alert.alert("Erreur", "Le nom est requis");
      return;
    }
    if (!form.email.trim()) {
      Alert.alert("Erreur", "L'email est requis pour le compte fournisseur");
      return;
    }
    if (form.latitude === null || form.longitude === null) {
      Alert.alert("Erreur", "La localisation est requise");
      return;
    }
    if (!form.password || form.password.length < 6) {
      Alert.alert("Erreur", "Le mot de passe doit contenir au moins 6 caractères");
      return;
    }
    if (form.password !== form.confirmPassword) {
      Alert.alert("Erreur", "Les mots de passe ne correspondent pas");
      return;
    }

    setLoading(true);
    try {
      // 1. Créer le fournisseur
      const supplierPayload = {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone || null,
        address_text: form.address_text || null,
        latitude: form.latitude,
        longitude: form.longitude,
      };
      await supplierService.create(supplierPayload);

      // 2. Créer le compte utilisateur avec rôle "fournisseur"
      const userPayload = {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone || null,
        password: form.password,
        role: "fournisseur",
      };
      
      // Appeler l'API pour créer l'utilisateur
      const response = await fetch("http://localhost:8000/api/admin/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${getAdminToken()}`,
          "Accept": "application/json",
        },
        body: JSON.stringify(userPayload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Erreur création compte");
      }

      Alert.alert(
        "Succès",
        `Fournisseur créé avec succès!\n\nEmail: ${form.email}\nMot de passe: ${form.password}\n\nLe fournisseur pourra changer son mot de passe après connexion.`
      );
      onDone();
    } catch (error) {
      Alert.alert("Erreur", error.message || "Impossible de créer le fournisseur");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  // Fonction pour récupérer le token admin depuis localStorage
  function getAdminToken() {
    if (token) return token;
    if (typeof window !== "undefined") {
      return localStorage.getItem("admin_token") || "";
    }
    return "";
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={onDone}>
          <MaterialIcons name="arrow_back_ios" size={20} color="#111618" />
        </TouchableOpacity>
        <Text style={styles.title}>Ajouter un Fournisseur</Text>
        <View style={{ width: 20 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Section Informations Générales */}
        <Text style={styles.sectionTitle}>Informations Générales</Text>

        {/* Nom du fournisseur */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Nom du fournisseur</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Logistics Pro"
            placeholderTextColor="#637f88"
            value={form.name}
            onChangeText={(v) => handleChange("name", v)}
          />
        </View>

        {/* Email */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Adresse email</Text>
          <TextInput
            style={styles.input}
            placeholder="contact@fournisseur.com"
            placeholderTextColor="#637f88"
            keyboardType="email-address"
            value={form.email}
            onChangeText={(v) => handleChange("email", v)}
          />
        </View>

        {/* Téléphone */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Téléphone</Text>
          <TextInput
            style={styles.input}
            placeholder="+33 6 00 00 00 00"
            placeholderTextColor="#637f88"
            keyboardType="phone-pad"
            value={form.phone}
            onChangeText={(v) => handleChange("phone", v)}
          />
        </View>

        {/* Section Compte Fournisseur */}
        <Text style={[styles.sectionTitle, { marginTop: 24 }]}>
          🔐 Compte Fournisseur
        </Text>
        <Text style={styles.helpText}>
          Le fournisseur pourra se connecter avec ces identifiants
        </Text>

        {/* Mot de passe */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Mot de passe</Text>
          <TextInput
            style={styles.input}
            placeholder="Mot de passe (min 6 caractères)"
            placeholderTextColor="#637f88"
            secureTextEntry
            value={form.password}
            onChangeText={(v) => handleChange("password", v)}
          />
        </View>

        {/* Confirmer mot de passe */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Confirmer le mot de passe</Text>
          <TextInput
            style={styles.input}
            placeholder="Confirmer le mot de passe"
            placeholderTextColor="#637f88"
            secureTextEntry
            value={form.confirmPassword}
            onChangeText={(v) => handleChange("confirmPassword", v)}
          />
        </View>

        {/* Section Localisation */}
        <Text style={[styles.sectionTitle, { marginTop: 24 }]}>
          Localisation
        </Text>

        {/* Localisation */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Adresse</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: 123 Rue de Paris"
            placeholderTextColor="#637f88"
            value={form.address_text}
            onChangeText={(v) => handleChange("address_text", v)}
          />
        </View>

        {/* Map Picker Component */}
        <MapPicker
          latitude={form.latitude}
          longitude={form.longitude}
          onLocationChange={handleMapClick}
        />

        {loadingLocation && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#19b3e6" />
            <Text style={styles.loadingText}>Récupération de la localisation...</Text>
          </View>
        )}
      </ScrollView>

      {/* Footer Button */}
      <View style={styles.footerContainer}>
        <TouchableOpacity
          style={styles.submitBtn}
          onPress={handleSubmit}
          disabled={loading}
        >
          <MaterialIcons name="save" size={20} color="#fff" />
          <Text style={styles.submitText}>
            {loading ? "Enregistrement..." : "Enregistrer le fournisseur"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111618",
  },
  scrollView: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 120,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111618",
    marginBottom: 12,
    marginTop: 8,
  },
  helpText: {
    fontSize: 12,
    color: "#637f88",
    marginBottom: 12,
    marginTop: -8,
  },
  fieldContainer: {
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    fontWeight: "500",
    color: "#111618",
    marginBottom: 6,
  },
  input: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#dce3e5",
    borderRadius: 6,
    fontSize: 13,
    color: "#111618",
    height: 44,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    gap: 8,
    backgroundColor: "#f0f9ff",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#bfdbfe",
    marginVertical: 12,
  },
  loadingText: {
    fontSize: 12,
    color: "#1e40af",
    fontWeight: "500",
  },
  footerContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  submitBtn: {
    backgroundColor: "#19b3e6",
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  submitText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
});
