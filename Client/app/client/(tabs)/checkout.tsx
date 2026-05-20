import { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import useCart from "../../hooks/useCart";
import { orderService } from "../../shared/services/orderService";

const COLORS = {
  primary: "#19b3e6",
  background: "#f6f7f8",
  white: "#ffffff",
  textPrimary: "#111618",
  textSecondary: "#637f88",
  success: "#22c55e",
  danger: "#ef4444",
  border: "#e5e7eb",
};

export default function CheckoutScreen() {
  const router = useRouter();
  const { cart, total, clearCart } = useCart();

  const [deliveryLat, setDeliveryLat] = useState("");
  const [deliveryLong, setDeliveryLong] = useState("");
  const [deliveryFee, setDeliveryFee] = useState("500");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const deliveryFeeNum = parseFloat(deliveryFee) || 0;
  const grandTotal = total + deliveryFeeNum;

  const handleSubmit = async () => {
    // Validation
    if (!deliveryLat || !deliveryLong) {
      Alert.alert("Adresse requise", "Veuillez entrer les coordonnées de livraison.");
      return;
    }

    const lat = parseFloat(deliveryLat);
    const lng = parseFloat(deliveryLong);
    if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      Alert.alert("Coordonnées invalides", "Vérifiez les coordonnées GPS.");
      return;
    }

    if (cart.length === 0) {
      Alert.alert("Panier vide", "Ajoutez des produits avant de commander.");
      return;
    }

    setIsSubmitting(true);
    try {
      // Construire les items pour l'API
      const items = cart.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
        price: item.priceNumber,
      }));

      await orderService.createOrder({
        delivery_lat: lat,
        delivery_long: lng,
        total_price: grandTotal,
        delivery_fee: deliveryFeeNum,
        status: "paye",
        items,
      });

      Alert.alert(
        "Commande envoyée !",
        `Votre commande de ${grandTotal.toFixed(2)} XOF a été enregistrée.`,
        [
          {
            text: "OK",
            onPress: () => {
              clearCart();
              router.replace("/client/(tabs)/orders");
            },
          },
        ]
      );
    } catch (error: any) {
      Alert.alert("Erreur", error.message || "Impossible de créer la commande");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyState}>
          <MaterialCommunityIcons name="shopping-off" size={64} color={COLORS.textSecondary} />
          <Text style={styles.emptyTitle}>Panier vide</Text>
          <Text style={styles.emptyText}>Ajoutez des produits pour passer commande.</Text>
          <TouchableOpacity style={styles.primaryBtn} onPress={() => router.back()}>
            <Text style={styles.primaryBtnText}>Continuer les achats</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Validation de commande</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Récapitulatif panier */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Votre panier ({cart.length} article{cart.length > 1 ? "s" : ""})</Text>
        {cart.map((item) => (
          <View key={item.id} style={styles.cartItem}>
            <Text style={styles.itemName} numberOfLines={1}>
              {item.title}
            </Text>
            <Text style={styles.itemPrice}>
              {typeof item.price === "string" ? item.price : `${item.priceNumber.toFixed(2)} XOF`} × {item.quantity}
            </Text>
            <Text style={styles.itemTotal}>
              {(item.priceNumber * item.quantity).toFixed(2)} XOF
            </Text>
          </View>
        ))}
        <View style={styles.divider} />
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Sous-total</Text>
          <Text style={styles.summaryValue}>{total.toFixed(2)} XOF</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Frais de livraison</Text>
          <TextInput
            style={styles.feeInput}
            value={deliveryFee}
            onChangeText={setDeliveryFee}
            keyboardType="numeric"
            placeholder="500"
          />
        </View>
        <View style={[styles.summaryRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>{grandTotal.toFixed(2)} XOF</Text>
        </View>
      </View>

      {/* Coordonnées de livraison */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Adresse de livraison</Text>
        <View style={styles.inputGroup}>
          <MaterialCommunityIcons name="map-marker-radius" size={18} color={COLORS.primary} />
          <Text style={styles.inputHint}>Entrez les coordonnées GPS du point de livraison</Text>
        </View>
        <View style={styles.coordRow}>
          <View style={styles.coordInput}>
            <Text style={styles.coordLabel}>Latitude</Text>
            <TextInput
              style={styles.input}
              value={deliveryLat}
              onChangeText={setDeliveryLat}
              keyboardType="numeric"
              placeholder="6.4922"
            />
          </View>
          <View style={styles.coordInput}>
            <Text style={styles.coordLabel}>Longitude</Text>
            <TextInput
              style={styles.input}
              value={deliveryLong}
              onChangeText={setDeliveryLong}
              keyboardType="numeric"
              placeholder="2.6280"
            />
          </View>
        </View>
      </View>

      {/* Bouton valider */}
      <TouchableOpacity
        style={[styles.validateBtn, isSubmitting && styles.validateBtnDisabled]}
        onPress={handleSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <MaterialCommunityIcons name="check-circle" size={20} color="#fff" />
        )}
        <Text style={styles.validateBtnText}>
          {isSubmitting ? "Traitement..." : `Confirmer et payer ${grandTotal.toFixed(2)} XOF`}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    padding: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  section: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  cartItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.background,
  },
  itemName: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  itemPrice: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  itemTotal: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.primary,
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 12,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
  },
  summaryLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.primary,
  },
  feeInput: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.primary,
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textPrimary,
    minWidth: 80,
    textAlign: "right",
    paddingVertical: 2,
  },
  inputGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  inputHint: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  coordRow: {
    flexDirection: "row",
    gap: 12,
  },
  coordInput: {
    flex: 1,
  },
  coordLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: COLORS.textPrimary,
    backgroundColor: COLORS.background,
  },
  validateBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 16,
    marginTop: 8,
  },
  validateBtnDisabled: {
    opacity: 0.6,
  },
  validateBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
  primaryBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 16,
  },
  primaryBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
});
