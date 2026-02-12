import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import useCart from "../hooks/useCart";

interface Product {
  id: string;
  title: string;
  price: string;
  priceNumber: number;
  image: string;
}

interface ProductCardProps {
  product: Product;
  onAddToCart?: () => void;
}

export default function ProductCard({
  product,
  onAddToCart,
}: ProductCardProps) {
  const router = useRouter();
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem(
      {
        id: product.id,
        title: product.title,
        price: product.price,
        priceNumber: product.priceNumber,
        image: product.image,
      },
      1,
    );
    if (onAddToCart) onAddToCart();
  };

  const handleProductPress = () => {
    router.push(`/product/${product.id}`);
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={handleProductPress}
      activeOpacity={0.7}
    >
      <TouchableOpacity
        style={styles.favoriteButton}
        onPress={(e) => e.stopPropagation()}
      >
        <MaterialCommunityIcons
          name="heart-outline"
          size={16}
          color="#637f88"
        />
      </TouchableOpacity>

      <Image
        source={{ uri: product.image }}
        style={styles.image}
        resizeMode="cover"
      />

      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>
          {product.title}
        </Text>

        <View style={styles.footer}>
          <Text style={styles.price}>{product.price}</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={(e) => {
              e.stopPropagation();
              handleAddToCart();
            }}
          >
            <MaterialCommunityIcons name="plus" size={16} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#f3f4f6",
  },
  favoriteButton: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  image: {
    width: "100%",
    aspectRatio: 1,
    backgroundColor: "#f3f4f6",
  },
  info: {
    padding: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: "500",
    color: "#111618",
    marginBottom: 8,
    minHeight: 32,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#19b3e6",
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#19b3e6",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#19b3e6",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
});
