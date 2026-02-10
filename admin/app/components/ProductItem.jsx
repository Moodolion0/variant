import { Image, StyleSheet, Text, View } from "react-native";

export default function ProductItem({ item }) {
  return (
    <View style={styles.row}>
      <View style={styles.left}>
        <View style={styles.thumb}>
          {item.image ? (
            <Image source={{ uri: item.image }} style={styles.img} />
          ) : (
            <Text style={styles.placeholder}>IMG</Text>
          )}
        </View>
        <View style={styles.meta}>
          <Text style={styles.name} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.stock}>{item.stock} en stock</Text>
        </View>
      </View>
      <View style={styles.right}>
        <Text style={styles.price}>{item.price.toFixed(2)}€</Text>
        <Text style={styles.ref}>{item.ref || ""}</Text>
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
  price: { fontWeight: "700" },
  ref: { fontSize: 12, color: "#9aa8ad" },
});
