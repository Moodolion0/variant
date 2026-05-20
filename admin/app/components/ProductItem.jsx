import { Image, StyleSheet, Text, View } from "react-native";

export default function ProductItem({ item }) {
  console.log('[ProductItem] item:', JSON.stringify(item));
  const name = item.name_by_admin || item.name_supplier || "Sans nom";
  // console.log(typeof item.price_supplier, 'price_supplier:', item.price_supplier);
  const displayPrice = parseFloat(item.price_supplier ?? 0) || 0;
  const displayStock = item.stock_quantity ?? item.stock ?? 0;
  const imageUrl = item.images && Array.isArray(item.images) && item.images[0]?.file_url ? item.images[0].file_url : item.image || null;

  return (
    <View style={styles.row}>
      <View style={styles.left}>
        <View style={styles.thumb}>
          {imageUrl ? (
            <Image source={{ uri: imageUrl }} style={styles.img} />
          ) : (
            <Text style={styles.placeholder}>IMG</Text>
          )}
        </View>
        <View style={styles.meta}>
          <Text style={styles.name} numberOfLines={1}>
            {name}
          </Text>
          <Text style={styles.stock}>{displayStock} en stock</Text>
        </View>
      </View>
      <View style={styles.right}>
        <Text style={styles.price}>{displayPrice.toFixed(2)} XOF</Text>
        <Text style={styles.ref}>{item.ref || `#PRD-${item.id}`}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderColor: "#f0f0f0",
  },
  left: { flexDirection: "row", alignItems: "center", flex: 1 },
  thumb: {
    width: 56,
    height: 56,
    borderRadius: 8,
    backgroundColor: "#f3f3f3",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  img: { width: "100%", height: "100%", borderRadius: 8 },
  placeholder: { color: "#999" },
  meta: { flex: 1 },
  name: { fontSize: 14, fontWeight: "600" },
  stock: { fontSize: 12, color: "#637f88", marginTop: 4 },
  right: { alignItems: "flex-end" },
  price: { fontWeight: "700", color: "#111618" },
  ref: { fontSize: 12, color: "#9aa8ad" },
});