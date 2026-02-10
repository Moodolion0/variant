import { useState } from "react";
import {
    Alert,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import supplierService from "../services/supplierService";

export default function SupplierForm({ onDone }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");

  async function submit() {
    if (!name.trim()) {
      Alert.alert("Erreur", "Le nom est requis");
      return;
    }
    const payload = { name: name.trim(), email, phone, location };
    await supplierService.create(payload);
    onDone();
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ajouter un Fournisseur</Text>

      <Text style={styles.label}>Nom du fournisseur</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Ex: TechDistri Corp"
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="contact@fournisseur.com"
        keyboardType="email-address"
      />

      <Text style={styles.label}>Téléphone</Text>
      <TextInput
        style={styles.input}
        value={phone}
        onChangeText={setPhone}
        placeholder="+33 6 12 34 56 78"
      />

      <Text style={styles.label}>Localisation</Text>
      <TextInput
        style={styles.input}
        value={location}
        onChangeText={setLocation}
        placeholder="Paris, France"
      />

      <TouchableOpacity style={styles.submit} onPress={submit}>
        <Text style={styles.submitText}>Ajouter le fournisseur</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 120 },
  title: { fontSize: 18, fontWeight: "700", marginBottom: 16 },
  label: { fontSize: 14, fontWeight: "600", marginTop: 12, marginBottom: 6 },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e6eaec",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  submit: {
    marginTop: 20,
    backgroundColor: "#19b3e6",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  submitText: { color: "#fff", fontWeight: "700" },
});
