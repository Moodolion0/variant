import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import useCart from "../../hooks/useCart";

// Couleurs
const colors = {
  primary: "#19b3e6",
  backgroundLight: "#f6f7f8",
  textPrimary: "#111618",
  textSecondary: "#637f88",
  surface: "#ffffff",
};

export default function CartScreen() {
  const router = useRouter();
  const { cart, removeItem, updateQuantity, clearCart, total, loaded } =
    useCart();

  if (!loaded) {
    return (
      <View style={styles.container}>
        <Text>Chargement du panier...</Text>
      </View>
    );
  }

  const isEmpty = cart.length === 0;
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialCommunityIcons
            name="arrow-left"
            size={24}
            color={colors.textSecondary}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mon Panier</Text>
        <TouchableOpacity onPress={clearCart} disabled={isEmpty}>
          <MaterialCommunityIcons
            name="delete-sweep"
            size={24}
            color={isEmpty ? "#ccc" : "#ef4444"}
          />
        </TouchableOpacity>
      </View>

      {isEmpty ? (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons
            name="shopping"
            size={64}
            color={colors.textSecondary}
          />
          <Text style={styles.emptyText}>Votre panier est vide</Text>
          <TouchableOpacity
            style={styles.continueBtn}
            onPress={() => router.push("/client")}
          >
            <Text style={styles.continueBtnText}>Continuer les achats</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <ScrollView
            style={styles.content}
            contentContainerStyle={{ paddingBottom: 40 }}
          >
            {cart.map((item) => (
              <View key={item.id} style={styles.cartItem}>
                <Image source={{ uri: item.image }} style={styles.itemImage} />
                <View style={styles.itemInfo}>
                  <View style={styles.itemHeader}>
                    <Text style={styles.itemTitle} numberOfLines={1}>
                      {item.title}
                    </Text>
                    <TouchableOpacity onPress={() => removeItem(item.id)}>
                      <MaterialCommunityIcons
                        name="close"
                        size={20}
                        color={colors.textSecondary}
                      />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.itemPrice}>{item.price}</Text>
                  <View style={styles.qtyControl}>
                    <TouchableOpacity
                      style={styles.qtyBtn}
                      onPress={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      <Text style={styles.qtyBtnText}>−</Text>
                    </TouchableOpacity>
                    <Text style={styles.qty}>{item.quantity}</Text>
                    <TouchableOpacity
                      style={styles.qtyBtn}
                      onPress={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <Text style={styles.qtyBtnText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>

          {/* Summary & Checkout */}
          <View style={styles.summary}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>
                Sous-total ({itemCount} articles)
              </Text>
              <Text style={styles.summaryValue}>{total.toFixed(2)} XOF</Text>
            </View>
            <TouchableOpacity style={styles.checkoutBtn}>
              <MaterialCommunityIcons
                name="shopping-bag"
                size={20}
                color="#fff"
              />
              <Text style={styles.checkoutText}>Valider la commande</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.backgroundLight },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#fff",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  content: { flex: 1, paddingHorizontal: 8, paddingVertical: 8 },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  emptyText: { fontSize: 16, color: colors.textSecondary },
  continueBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  continueBtnText: { color: "#fff", fontWeight: "700" },
  cartItem: {
    flexDirection: "row",
    gap: 12,
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: "#eee",
  },
  itemInfo: { flex: 1, justifyContent: "space-between" },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  itemTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  itemPrice: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.primary,
    marginVertical: 4,
  },
  qtyControl: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#f3f4f6",
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: "flex-start",
  },
  qtyBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  qtyBtnText: { fontSize: 14, fontWeight: "700", color: colors.textPrimary },
  qty: { fontSize: 12, fontWeight: "600", width: 20, textAlign: "center" },
  summary: {
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#e5e7eb",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  summaryLabel: { fontSize: 12, color: colors.textSecondary },
  summaryValue: { fontSize: 18, fontWeight: "700", color: colors.textPrimary },
  checkoutBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  checkoutText: { color: "#fff", fontWeight: "700", fontSize: 14 },
});
