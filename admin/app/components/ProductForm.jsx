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
import ProductImageManager from "./ProductImageManager";

export default function ProductForm({ token, onDone }) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock_quantity: "",
    supplier_id: "",
  });
  const [loading, setLoading] = useState(false);
  const [productId, setProductId] = useState(null);
  const [productCreated, setProductCreated] = useState(false);

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  async function handleCreateProduct() {
    if (!form.name.trim()) {
      Alert.alert("Erreur", "Le nom est requis");
      return;
    }
    if (!form.price || isNaN(parseFloat(form.price))) {
      Alert.alert("Erreur", "Prix valide requis");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        price: parseFloat(form.price),
        stock_quantity: parseInt(form.stock_quantity) || 0,
        supplier_id: parseInt(form.supplier_id) || 1,
      };

      const response = await fetch("http://localhost:8000/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erreur création produit");
      }

      setProductId(data.data?.id || data.id);
      setProductCreated(true);
      Alert.alert(
        "Succès",
        "Produit créé! Vous pouvez maintenant ajouter des images.",
      );
    } catch (error) {
      Alert.alert("Erreur", error.message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  // Écran 1: Créer le produit
  if (!productCreated) {
    return (
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={onDone}>
            <MaterialIcons
              name="arrow_back_ios_new"
              size={20}
              color="#111618"
            />
          </TouchableOpacity>
          <Text style={styles.title}>Ajouter un Produit</Text>
          <View style={{ width: 20 }} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Nom du produit */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Nom du produit *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: iPhone 15 Pro"
              placeholderTextColor="#637f88"
              value={form.name}
              onChangeText={(v) => handleChange("name", v)}
              editable={!loading}
            />
          </View>

          {/* Description */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, { height: 120, textAlignVertical: "top" }]}
              placeholder="Entrez la description détaillée..."
              placeholderTextColor="#637f88"
              multiline
              value={form.description}
              onChangeText={(v) => handleChange("description", v)}
              editable={!loading}
            />
          </View>

          {/* Prix et Stock */}
          <View style={styles.rowContainer}>
            <View style={styles.halfField}>
              <Text style={styles.label}>Prix (XOF) *</Text>
              <TextInput
                style={styles.input}
                placeholder="0.00"
                placeholderTextColor="#637f88"
                keyboardType="decimal-pad"
                value={form.price}
                onChangeText={(v) => handleChange("price", v)}
                editable={!loading}
              />
            </View>
            <View style={styles.halfField}>
              <Text style={styles.label}>Stock</Text>
              <TextInput
                style={styles.input}
                placeholder="0"
                placeholderTextColor="#637f88"
                keyboardType="number-pad"
                value={form.stock_quantity}
                onChangeText={(v) => handleChange("stock_quantity", v)}
                editable={!loading}
              />
            </View>
          </View>

          {/* Fournisseur */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>ID Fournisseur</Text>
            <TextInput
              style={styles.input}
              placeholder="1"
              placeholderTextColor="#637f88"
              keyboardType="number-pad"
              value={form.supplier_id}
              onChangeText={(v) => handleChange("supplier_id", v)}
              editable={!loading}
            />
          </View>
        </ScrollView>

        {/* Footer Button */}
        <View style={styles.footerContainer}>
          <TouchableOpacity
            style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
            onPress={handleCreateProduct}
            disabled={loading}
          >
            <MaterialIcons name="add" size={20} color="#fff" />
            <Text style={styles.submitText}>
              {loading ? "Création..." : "Créer le produit"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Écran 2: Ajouter les images
  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={onDone}>
          <MaterialIcons name="arrow_back_ios_new" size={20} color="#111618" />
        </TouchableOpacity>
        <Text style={styles.title}>Images du Produit</Text>
        <View style={{ width: 20 }} />
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.scrollContent}>
          <Text style={styles.productInfo}>
            Produit créé: <Text style={styles.productIdText}>#{productId}</Text>
          </Text>

          <ProductImageManager
            productId={productId}
            token={token}
            onImagesUpdate={(images) => {
              // Images mises à jour
            }}
          />

          <TouchableOpacity style={styles.finishBtn} onPress={onDone}>
            <MaterialIcons name="check-circle" size={20} color="#fff" />
            <Text style={styles.finishBtnText}>Terminer</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  submitBtnDisabled: {
    opacity: 0.6,
  },
  submitText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
  productInfo: {
    fontSize: 14,
    color: "#637f88",
    marginBottom: 16,
  },
  productIdText: {
    fontWeight: "700",
    color: "#19b3e6",
  },
  finishBtn: {
    backgroundColor: "#10b981",
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 20,
  },
  finishBtnText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
});
