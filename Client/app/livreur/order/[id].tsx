import { useState, useEffect, useLocalSearchParams } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { livreurService } from "../../services/livreurService";

const COLORS = {
  primary: "#19b3e6",
  background: "#f6f7f8",
  white: "#ffffff",
  textPrimary: "#111618",
  textSecondary: "#637f88",
  success: "#22c55e",
  warning: "#f59e0b",
  danger: "#ef4444",
};

const StatusBadge = ({ status }: { status: string }) => {
  const getStatusConfig = () => {
    switch (status) {
      case "en_attente":
        return { label: "En attente", color: COLORS.warning };
      case "paye":
        return { label: "Payée", color: COLORS.success };
      case "en_cours_livraison":
        return { label: "En livraison", color: COLORS.primary };
      case "livre":
        return { label: "Livré", color: COLORS.success };
      case "termine":
        return { label: "Terminé", color: COLORS.success };
      case "annule":
        return { label: "Annulé", color: COLORS.danger };
      default:
        return { label: status, color: COLORS.textSecondary };
    }
  };

  const config = getStatusConfig();

  return (
    <View style={[styles.badge, { backgroundColor: config.color + "20" }]}>
      <Text style={[styles.badgeText, { color: config.color }]}>{config.label}</Text>
    </View>
  );
};

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    // In a real app, we'd fetch the specific order
    // For now, we'll just show the data we have
    setLoading(false);
  }, [id]);

  const handleAccept = async () => {
    Alert.alert(
      "Accepter la commande",
      "Voulez-vous accepter cette commande ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Accepter",
          onPress: async () => {
            setActionLoading(true);
            try {
              await livreurService.acceptOrder(id!);
              Alert.alert("Succès", "Commande acceptée !");
              router.back();
            } catch (error: any) {
              Alert.alert("Erreur", error.message || "Impossible d'accepter");
            } finally {
              setActionLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleDeclareFinished = async () => {
    Alert.alert(
      "Confirmer la livraison",
      "Avez-vous livré cette commande ?",
      [
        { text: "Non", style: "cancel" },
        {
          text: "Oui, livrer",
          onPress: async () => {
            setActionLoading(true);
            try {
              await livreurService.declareFinished(id!);
              Alert.alert("Succès", "Livraison terminée !");
              router.back();
            } catch (error: any) {
              Alert.alert("Erreur", error.message || "Impossible de terminer");
            } finally {
              setActionLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleCancel = () => {
    Alert.alert(
      "Annuler la livraison",
      "Êtes-vous sûr ? Une pénalité pourrait être appliquée.",
      [
        { text: "Non", style: "cancel" },
        {
          text: "Oui, annuler",
          style: "destructive",
          onPress: async () => {
            setActionLoading(true);
            try {
              await livreurService.cancelOrder(id!);
              Alert.alert("Succès", "Livraison annulée");
              router.back();
            } catch (error: any) {
              Alert.alert("Erreur", error.message || "Impossible d'annuler");
            } finally {
              setActionLoading(false);
            }
          },
        },
      ]
    );
  };

  if (loading || actionLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>
          {actionLoading ? "Traitement en cours..." : "Chargement..."}
        </Text>
      </View>
    );
  }

  const formatPrice = (price: number) => `${(price || 0).toFixed(2)} XOF`;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Détails de la commande</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Order ID & Status */}
        <View style={styles.orderHeader}>
          <View>
            <Text style={styles.orderId}>Commande #{id}</Text>
            <Text style={styles.orderDate}>
              {/* {new Date(order?.created_at).toLocaleDateString("fr-FR")} */}
              Date non disponible
            </Text>
          </View>
          <StatusBadge status={order?.status || "paye"} />
        </View>

        {/* Client Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informations client</Text>
          <View style={styles.card}>
            <View style={styles.infoRow}>
              <MaterialCommunityIcons name="account" size={20} color={COLORS.textSecondary} />
              <Text style={styles.infoText}>
                {order?.client?.full_name || "Client"}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <MaterialCommunityIcons name="phone" size={20} color={COLORS.textSecondary} />
              <Text style={styles.infoText}>
                {order?.client?.phone_number || "Téléphone non disponible"}
              </Text>
            </View>
          </View>
        </View>

        {/* Delivery Address */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Adresse de livraison</Text>
          <View style={styles.card}>
            <View style={styles.infoRow}>
              <MaterialCommunityIcons name="map-marker" size={20} color={COLORS.primary} />
              <Text style={styles.infoText}>
                {order?.delivery_lat && order?.delivery_long
                  ? `Lat: ${order.delivery_lat.toFixed(4)}, Lng: ${order.delivery_long.toFixed(4)}`
                  : "Adresse de livraison"}
              </Text>
            </View>
          </View>
        </View>

        {/* Order Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Articles</Text>
          <View style={styles.card}>
            {order?.items?.length > 0 ? (
              order.items.map((item: any, index: number) => (
                <View key={index} style={styles.itemRow}>
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemName}>{item.product?.name || "Produit"}</Text>
                    <Text style={styles.itemQty}>x{item.quantity}</Text>
                  </View>
                  <Text style={styles.itemPrice}>{formatPrice(item.price)}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.noItems}>Aucun article</Text>
            )}
          </View>
        </View>

        {/* Pricing */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Résumé</Text>
          <View style={styles.card}>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Sous-total</Text>
              <Text style={styles.priceValue}>{formatPrice(order?.total_price)}</Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Frais de livraison</Text>
              <Text style={[styles.priceValue, { color: COLORS.success }]}>
                {formatPrice(order?.delivery_fee)}
              </Text>
            </View>
            <View style={[styles.priceRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>
                {formatPrice((order?.total_price || 0) + (order?.delivery_fee || 0))}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actions}>
        {order?.status === "paye" && (
          <TouchableOpacity style={styles.acceptButton} onPress={handleAccept}>
            <MaterialCommunityIcons name="check-circle" size={20} color={COLORS.white} />
            <Text style={styles.acceptButtonText}>Accepter la commande</Text>
          </TouchableOpacity>
        )}

        {order?.status === "en_cours_livraison" && (
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
              <MaterialCommunityIcons name="close-circle" size={20} color={COLORS.white} />
              <Text style={styles.actionButtonText}>Annuler</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.finishButton} onPress={handleDeclareFinished}>
              <MaterialCommunityIcons name="check-circle" size={20} color={COLORS.white} />
              <Text style={styles.actionButtonText}>Terminer</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: COLORS.white,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingVertical: 16,
  },
  orderId: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.textPrimary,
  },
  orderDate: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 14,
    fontWeight: "600",
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textSecondary,
    marginBottom: 8,
    textTransform: "uppercase",
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 8,
  },
  infoText: {
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.background,
  },
  itemInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  itemName: {
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  itemQty: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  noItems: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: "center",
    paddingVertical: 12,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  priceLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  priceValue: {
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: COLORS.background,
    marginTop: 8,
    paddingTop: 12,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.textPrimary,
  },
  actions: {
    padding: 20,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.background,
  },
  acceptButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 16,
    gap: 8,
  },
  acceptButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "600",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.danger,
    borderRadius: 12,
    paddingVertical: 16,
    gap: 8,
  },
  finishButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.success,
    borderRadius: 12,
    paddingVertical: 16,
    gap: 8,
  },
  actionButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "600",
  },
});
