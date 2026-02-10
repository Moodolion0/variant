import { useEffect, useState } from "react";
import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import productService from "../services/productService";
import ProductItem from "./ProductItem";

export default function ProductList({ onCreate }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      const list = await productService.list();
      if (mounted) {
        setItems(list);
        setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <View>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Produits</Text>
        <TouchableOpacity onPress={onCreate} style={styles.addBtn}>
          <Text style={styles.addText}>Ajouter</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <Text style={{ color: "#637f88" }}>Chargement...</Text>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(i) => i.id}
          renderItem={({ item }) => <ProductItem item={item} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  title: { fontSize: 18, fontWeight: "700" },
  addBtn: {
    backgroundColor: "#19b3e6",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addText: { color: "#fff", fontWeight: "700" },
});
