import { useState, useEffect } from "react";
import { Alert, ScrollView, StyleSheet, View, ActivityIndicator, Text } from "react-native";
import Banner from "../../components/Banner";
import Categories from "../../components/Categories";
import Featured from "../../components/Featured";
import Header from "../../components/Header";
import ProductGrid from "../../components/ProductGrid";
import SearchBar from "../../components/SearchBar";
import productService from "../../shared/services/productService";

interface Product {
  id: string;
  title: string;
  price: string;
  priceNumber: number;
  currency: string;
  image: string | null;
  category: string;
  description: string;
}

export default function HomeScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getProducts();
      setProducts(data);
    } catch (err: any) {
      setError(err.message);
      console.error("Error loading products:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      loadProducts();
      return;
    }
    
    try {
      setLoading(true);
      const results = await productService.searchProducts(query);
      setProducts(results);
    } catch (err: any) {
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && products.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#19b3e6" />
      </View>
    );
  }

  if (error) {
    Alert.alert("Erreur", error);
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Header />
        <SearchBar onSearch={handleSearch} />
        <Banner />
        <Categories />
        
        {products.length > 0 ? (
          <ProductGrid products={products} />
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Aucun produit disponible</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F7FA",
  },
  emptyContainer: {
    padding: 20,
    alignItems: "center",
  },
  emptyText: {
    color: "#666",
    fontSize: 16,
  },
});
