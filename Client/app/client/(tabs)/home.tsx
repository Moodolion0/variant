import { useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import Banner from "../../components/Banner";
import Categories from "../../components/Categories";
import Featured from "../../components/Featured";
import Header from "../../components/Header";
import ProductGrid from "../../components/ProductGrid";
import SearchBar from "../../components/SearchBar";

const products = [
  {
    id: "1",
    title: "Premium Wireless Headphones",
    price: "120,00 XOF",
    priceNumber: 120,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=500&auto=format&fit=crop",
  },
  {
    id: "2",
    title: "Series 7 Smart Watch",
    price: "250,00 XOF",
    priceNumber: 250,
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=500&auto=format&fit=crop",
  },
  {
    id: "3",
    title: "Pro Running Shoes",
    price: "85,00 XOF",
    priceNumber: 85,
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=500&auto=format&fit=crop",
  },
  {
    id: "4",
    title: "Urban Leather Backpack",
    price: "45,00 XOF",
    priceNumber: 45,
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=500&auto=format&fit=crop",
  },
  {
    id: "5",
    title: "Noise Cancelling Earbuds",
    price: "95,00 XOF",
    priceNumber: 95,
    image:
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?q=80&w=500&auto=format&fit=crop",
  },
  {
    id: "6",
    title: "Fitness Band",
    price: "65,00 XOF",
    priceNumber: 65,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=500&auto=format&fit=crop",
  },
  {
    id: "7",
    title: "Wireless Charger",
    price: "30,00 XOF",
    priceNumber: 30,
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=500&auto=format&fit=crop",
  },
  {
    id: "8",
    title: "Portable Speaker",
    price: "75,00 XOF",
    priceNumber: 75,
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=500&auto=format&fit=crop",
  },
];

export default function HomeScreen() {
  const [addedToCart, setAddedToCart] = useState(false);

  const handleAddToCart = () => {
    setAddedToCart(true);
    Alert.alert("Succès", "Produit ajouté au panier! ✓");
    setTimeout(() => setAddedToCart(false), 1000);
  };

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <SearchBar />
        <Categories />
        <Banner />
        <Featured />
        <ProductGrid products={products} onAddToCart={handleAddToCart} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f7f8",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
});
