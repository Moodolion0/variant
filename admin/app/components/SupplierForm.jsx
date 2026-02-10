import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import supplierService from "../services/supplierService";

export default function SupplierForm({ onDone }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  async function handleSubmit() {
    if (!form.name.trim()) {
      Alert.alert("Erreur", "Le nom est requis");
      return;
    }
    setLoading(true);
    const payload = {
      name: form.name.trim(),
      email: form.email,
      phone: form.phone,
      location: form.location,
    };
    await supplierService.create(payload);
    setLoading(false);
    onDone();
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

        {/* Section Localisation */}
        <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Localisation</Text>

        {/* Localisation */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Localisation</Text>
          <View style={styles.locationInputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Paris, France"
              placeholderTextColor="#637f88"
              value={form.location}
              onChangeText={(v) => handleChange("location", v)}
            />
            <MaterialIcons
              name="location_on"
              size={20}
              color="#19b3e6"
              style={styles.locationIcon}
            />
          </View>
        </View>

        {/* Map Placeholder */}
        <View style={styles.mapPlaceholder}>
          <MaterialIcons name="location_on" size={32} color="#19b3e6" />
          <Text style={styles.mapText}>Maintenez et glissez pour ajuster</Text>
        </View>
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
  locationInputWrapper: {
    position: "relative",
  },
  locationIcon: {
    position: "absolute",
    right: 12,
    top: 12,
  },
  mapPlaceholder: {
    height: 160,
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#dce3e5",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
    marginBottom: 12,
  },
  mapText: {
    fontSize: 12,
    color: "#637f88",
    marginTop: 8,
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
