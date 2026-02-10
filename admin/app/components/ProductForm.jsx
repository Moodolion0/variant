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
import productService from "../services/productService";

export default function ProductForm({ onDone }) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    supplier: "",
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
      description: form.description,
      price: parseFloat(form.price) || 0,
      stock: parseInt(form.stock) || 0,
      supplier: form.supplier,
    };
    await productService.create(payload);
    setLoading(false);
    onDone();
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={onDone}>
          <MaterialIcons name="arrow_back_ios_new" size={20} color="#111618" />
        </TouchableOpacity>
        <Text style={styles.title}>Ajouter un Produit</Text>
        <View style={{ width: 20 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Photo du produit */}
        <View>
          <Text style={styles.sectionTitle}>Photos du produit</Text>
          <View style={styles.photoGrid}>
            <View style={styles.photoPlaceholder}>
              <MaterialIcons name="add_a_photo" size={28} color="#19b3e6" />
              <Text style={styles.photoLabel}>Ajouter</Text>
            </View>
          </View>
        </View>

        {/* Nom du produit */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Nom du produit</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Produit Haute Qualité"
            placeholderTextColor="#637f88"
            value={form.name}
            onChangeText={(v) => handleChange("name", v)}
          />
        </View>

        {/* Description */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, { height: 120, textAlignVertical: "top" }]}
            placeholder="Entrez la description détaillée du produit"
            placeholderTextColor="#637f88"
            multiline
            value={form.description}
            onChangeText={(v) => handleChange("description", v)}
          />
        </View>

        {/* Prix et Stock */}
        <View style={styles.rowContainer}>
          <View style={styles.halfField}>
            <Text style={styles.label}>Prix (€)</Text>
            <TextInput
              style={styles.input}
              placeholder="0.00"
              placeholderTextColor="#637f88"
              keyboardType="decimal-pad"
              value={form.price}
              onChangeText={(v) => handleChange("price", v)}
            />
          </View>
          <View style={styles.halfField}>
            <Text style={styles.label}>Stock</Text>
            <TextInput
              style={styles.input}
              placeholder="0"
              placeholderTextColor="#637f88"
              keyboardType="number-pad"
              value={form.stock}
              onChangeText={(v) => handleChange("stock", v)}
            />
          </View>
        </View>

        {/* Fournisseur */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Sélectionner un Fournisseur</Text>
          <View style={styles.selectWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Choisir un fournisseur"
              placeholderTextColor="#637f88"
              value={form.supplier}
              onChangeText={(v) => handleChange("supplier", v)}
            />
            <MaterialIcons
              name="expand_more"
              size={20}
              color="#637f88"
              style={styles.selectIcon}
            />
          </View>
        </View>
      </ScrollView>

      {/* Footer Button */}
      <View style={styles.footerContainer}>
        <TouchableOpacity
          style={styles.submitBtn}
          onPress={handleSubmit}
          disabled={loading}
        >
          <MaterialIcons name="publish" size={20} color="#fff" />
          <Text style={styles.submitText}>
            {loading ? "Publication..." : "Publier le produit"}
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
    borderBottomColor: "#dce3e5",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111618",
  },
  scrollView: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 12,
    paddingTop: 16,
    paddingBottom: 120,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111618",
    marginBottom: 12,
  },
  photoGrid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  photoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#dce3e5",
    borderStyle: "dashed",
    backgroundColor: "#f9fafb",
    alignItems: "center",
    justifyContent: "center",
  },
  photoLabel: {
    fontSize: 10,
    color: "#637f88",
    marginTop: 4,
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
  rowContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  halfField: {
    flex: 1,
  },
  selectWrapper: {
    position: "relative",
  },
  selectIcon: {
    position: "absolute",
    right: 12,
    top: 12,
  },
  footerContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#dce3e5",
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
