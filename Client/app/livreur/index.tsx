import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
  ActivityIndicator,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { livreurService } from "../services/livreurService";
import { useAuth } from "../hooks/useAuth";

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

// Statut badge component
const StatusBadge = ({ status }: { status: string }) => {
  const getStatusConfig = () => {
    switch (status) {
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

// Order card component
const OrderCard = ({ order, onAccept }: { order: any; onAccept: (id: string) => void }) => {
  const router = useRouter();

  const formatPrice = (price: number) => {
    return `${price.toFixed(2)} XOF`;
  };

  return (
    <TouchableOpacity
      style={styles.orderCard}
      onPress={() => router.push(`/livreur/order/${order.id}`)}
    >
      <View style={styles.orderHeader}>
        <View>
          <Text style={styles.orderId}>Commande #{order.id}</Text>
          <Text style={styles.orderDate}>
            {new Date(order.created_at).toLocaleDateString("fr-FR", {
              day: "numeric",
              month: "short",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </View>
        <StatusBadge status={order.status} />
      </View>

      <View style={styles.orderDetails}>
        <View style={styles.detailRow}>
          <MaterialCommunityIcons name="map-marker" size={16} color={COLORS.textSecondary} />
          <Text style={styles.detailText}>
            {order.delivery_lat && order.delivery_long
              ? `Lat: ${order.delivery_lat.toFixed(4)}, Lng: ${order.delivery_long.toFixed(4)}`
              : "Adresse de livraison"}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <MaterialCommunityIcons name="currency-usd" size={16} color={COLORS.textSecondary} />
          <Text style={styles.detailText}>Total: {formatPrice(order.total_price)}</Text>
        </View>
        {order.delivery_fee > 0 && (
          <View style={styles.detailRow}>
            <MaterialCommunityIcons name="truck" size={16} color={COLORS.success} />
            <Text style={[styles.detailText, { color: COLORS.success }]}>
              Frais de livraison: {formatPrice(order.delivery_fee)}
            </Text>
          </View>
        )}
      </View>

      {order.status === "paye" && (
        <TouchableOpacity
          style={styles.acceptButton}
          onPress={(e) => {
            e.stopPropagation();
            onAccept(order.id);
          }}
        >
          <MaterialCommunityIcons name="check-circle" size={20} color={COLORS.white} />
          <Text style={styles.acceptButtonText}>Accepter</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

export default function LivreurHomeScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrders = useCallback(async () => {
    try {
      const data = await livreurService.getAvailableOrders();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      Alert.alert("Erreur", "Impossible de charger les commandes disponibles");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  const handleAcceptOrder = async (orderId: string) => {
    Alert.alert(
      "Accepter la commande",
      "Voulez-vous accepter cette commande ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Accepter",
          onPress: async () => {
            try {
              await livreurService.acceptOrder(orderId);
              Alert.alert("Succès", "Commande acceptée !");
              fetchOrders();
            } catch (error: any) {
              Alert.alert("Erreur", error.message || "Impossible d'accepter la commande");
            }
          },
        },
      ]
    );
  };

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <MaterialCommunityIcons name="package-variant" size={64} color={COLORS.textSecondary} />
      <Text style={styles.emptyTitle}>Aucune commande disponible</Text>
      <Text style={styles.emptySubtitle}>
        Revenez plus tard pour voir les nouvelles commandes
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Bonjour, {user?.full_name || "Livreur"}</Text>
          <Text style={styles.subtitle}>Commandes disponibles près de chez vous</Text>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <MaterialCommunityIcons name="bell-outline" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <MaterialCommunityIcons name="truck-delivery" size={24} color={COLORS.primary} />
          <Text style={styles.statValue}>{orders.filter(o => o.status === "paye").length}</Text>
          <Text style={styles.statLabel}>Disponibles</Text>
        </View>
        <View style={styles.statCard}>
          <MaterialCommunityIcons name="clock-outline" size={24} color={COLORS.warning} />
          <Text style={styles.statValue}>0</Text>
          <Text style={styles.statLabel}>En cours</Text>
        </View>
        <View style={styles.statCard}>
          <MaterialCommunityIcons name="check-circle-outline" size={24} color={COLORS.success} />
          <Text style={styles.statValue}>0</Text>
          <Text style={styles.statLabel}>Terminées</Text>
        </View>
      </View>

      {/* Orders List */}
      <View style={styles.listContainer}>
        <Text style={styles.sectionTitle}>Nouvelles commandes</Text>
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <OrderCard order={item} onAccept={handleAcceptOrder} />}
          ListEmptyComponent={renderEmptyList}
          contentContainerStyle={orders.length === 0 ? styles.emptyList : styles.list}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[COLORS.primary]}
              tintColor={COLORS.primary}
            />
          }
          showsVerticalScrollIndicator={false}
        />
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
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: COLORS.white,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.textPrimary,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
  },
  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.textPrimary,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  list: {
    paddingBottom: 100,
  },
  emptyList: {
    flexGrow: 1,
    justifyContent: "center",
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 8,
    textAlign: "center",
  },
  orderCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  orderId: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  orderDate: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  orderDetails: {
    gap: 8,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  acceptButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 12,
    gap: 8,
  },
  acceptButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "600",
  },
});
