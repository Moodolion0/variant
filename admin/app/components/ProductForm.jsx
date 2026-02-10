import { useState } from "react";
import {
    Alert,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import productService from "../services/productService";

export default function ProductForm({ onDone }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [supplier, setSupplier] = useState("");

  async function submit() {
    if (!name.trim()) {
      Alert.alert("Erreur", "Le nom est requis");
      return;
    }
    const payload = {
      name: name.trim(),
      description,
      price: parseFloat(price) || 0,
      stock: parseInt(stock) || 0,
      supplier,
    };
    await productService.create(payload);
    onDone();
  }

  return (
    <View>
      <Text style={styles.label}>Nom du produit</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Ex: Produit Haute Qualité"
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, { height: 100 }]}
        value={description}
        onChangeText={setDescription}
        multiline
        placeholder="Entrez la description détaillée"
      />

      <View style={{ flexDirection: "row", gap: 8 }}>
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>Prix (€)</Text>
          <TextInput
            style={styles.input}
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
            placeholder="0.00"
          />
        </View>
        <View style={{ width: 100 }}>
          <Text style={styles.label}>Stock</Text>
          <TextInput
            style={styles.input}
            value={stock}
            onChangeText={setStock}
            keyboardType="numeric"
            placeholder="0"
          />
        </View>
      </View>

      <Text style={styles.label}>Fournisseur</Text>
      <TextInput
        style={styles.input}
        value={supplier}
        onChangeText={setSupplier}
        placeholder="Choisir un fournisseur"
      />

      <TouchableOpacity style={styles.submit} onPress={submit}>
        <Text style={styles.submitText}>Publier le produit</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: 14, fontWeight: "600", marginTop: 12, marginBottom: 6 },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e6eaec",
    padding: 12,
    borderRadius: 8,
  },
  submit: {
    marginTop: 18,
    backgroundColor: "#19b3e6",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  submitText: { color: "#fff", fontWeight: "700" },
});
