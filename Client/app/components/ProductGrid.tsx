import { StyleSheet, Text, View } from "react-native";
import ProductCard from "./ProductCard";

interface Product {
  id: string;
  title: string;
  price: string;
  priceNumber: number;
  image: string | null;
}

interface ProductGridProps {
  products: Product[];
  onAddToCart?: () => void;
}

export default function ProductGrid({
  products,
  onAddToCart,
}: ProductGridProps) {
  // Créer des paires de produits pour afficher 2 colonnes
  const rows = [];
  for (let i = 0; i < products.length; i += 2) {
    rows.push([products[i], products[i + 1]].filter(Boolean));
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Popular Products</Text>
      {rows.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((product) => (
            <View key={product.id} style={styles.col}>
              <ProductCard product={product} onAddToCart={onAddToCart} />
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111618",
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  col: {
    flex: 1,
  },
});
