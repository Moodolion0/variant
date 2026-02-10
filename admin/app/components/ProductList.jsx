import { MaterialIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import productService from "../services/productService";
import supplierService from "../services/supplierService";
import ProductItem from "./ProductItem";

export default function ProductList({
  onCreate,
  onProductDetail,
  onSupplierDetail,
}) {
  const [tab, setTab] = useState("articles");
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      const [productsList, suppliersList] = await Promise.all([
        productService.list(),
        supplierService.list(),
      ]);
      if (mounted) {
        setProducts(productsList);
        setSuppliers(suppliersList);
        setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );
  const filteredSuppliers = suppliers.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleAddClick = () => {
    if (tab === "articles") {
      onCreate("product");
    } else {
      onCreate("supplier");
    }
  };

  return (
    <View style={styles.container}>
      {/* Header with back button and title */}
      <View style={styles.topBar}>
        <MaterialIcons name="arrow_back_ios" size={20} color="#111618" />
        <Text style={styles.title}>Produits</Text>
        <MaterialIcons name="more_horiz" size={20} color="#111618" />
      </View>

      {/* Segmented Buttons: Articles / Fournisseurs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, tab === "articles" && styles.tabActive]}
          onPress={() => setTab("articles")}
        >
          <Text
            style={[
              styles.tabLabel,
              tab === "articles" && styles.tabLabelActive,
            ]}
          >
            Articles
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, tab === "suppliers" && styles.tabActive]}
          onPress={() => setTab("suppliers")}
        >
          <Text
            style={[
              styles.tabLabel,
              tab === "suppliers" && styles.tabLabelActive,
            ]}
          >
            Fournisseurs
          </Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <MaterialIcons name="search" size={20} color="#637f88" />
        <TextInput
          style={styles.searchInput}
          placeholder={
            tab === "articles"
              ? "Rechercher un produit..."
              : "Rechercher un fournisseur..."
          }
          placeholderTextColor="#637f88"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Content Area */}
      {loading ? (
        <Text style={{ color: "#637f88", padding: 12 }}>Chargement...</Text>
      ) : tab === "articles" ? (
        <FlatList
          data={filteredProducts}
          keyExtractor={(i) => i.id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => onProductDetail?.(item.id)}>
              <ProductItem item={item} />
            </TouchableOpacity>
          )}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      ) : (
        <FlatList
          data={filteredSuppliers}
          keyExtractor={(s) => s.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => onSupplierDetail?.(item.id)}
              activeOpacity={0.7}
            >
              <View style={styles.supplierCard}>
                <View style={styles.supplierIcon}>
                  <MaterialIcons name="factory" size={24} color="#19b3e6" />
                </View>
                <View style={styles.supplierInfo}>
                  <Text style={styles.supplierName}>{item.name}</Text>
                  <View style={styles.supplierMeta}>
                    <MaterialIcons
                      name="location_on"
                      size={14}
                      color="#637f88"
                    />
                    <Text style={styles.supplierLocation}>{item.location}</Text>
                  </View>
                </View>
                <MaterialIcons
                  name="chevron_right"
                  size={20}
                  color="#999"
                  style={{ alignSelf: "center" }}
                />
              </View>
            </TouchableOpacity>
          )}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}

      {/* Floating Action Button (Articles only) */}
      <TouchableOpacity style={styles.fab} onPress={handleAddClick}>
        <MaterialIcons name="add" size={28} color="#fff" />
      </TouchableOpacity>
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
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111618",
  },
  tabContainer: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
    marginHorizontal: 12,
    marginVertical: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
    backgroundColor: "transparent",
  },
  tabActive: {
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabLabel: {
    fontSize: 13,
    fontWeight: "500",
    color: "#637f88",
  },
  tabLabelActive: {
    color: "#111618",
    fontWeight: "600",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 12,
    marginVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#f3f4f6",
    borderRadius: 6,
    height: 40,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 13,
    color: "#111618",
  },
  supplierCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    backgroundColor: "#fff",
  },
  supplierIcon: {
    width: 48,
    height: 48,
    borderRadius: 6,
    backgroundColor: "rgba(25, 179, 230, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  supplierInfo: {
    flex: 1,
  },
  supplierName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111618",
  },
  supplierMeta: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  supplierLocation: {
    fontSize: 12,
    color: "#637f88",
    marginLeft: 4,
  },
  fab: {
    position: "absolute",
    bottom: 80,
    right: 12,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#19b3e6",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
