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

const DeliveryCard = ({ order, onDeclareFinished, onCancel }: { 
  order: any; 
  onDeclareFinished: (id: string) => void;
  onCancel: (id: string) => void;
}) => {
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
        {order.client && (
          <View style={styles.detailRow}>
            <MaterialCommunityIcons name="account" size={16} color={COLORS.textSecondary} />
            <Text style={styles.detailText}>Client: {order.client.full_name || order.client.email}</Text>
          </View>
        )}
      </View>

      {order.status === "en_cours_livraison" && (
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.cancelButton]}
            onPress={(e) => {
              e.stopPropagation();
              onCancel(order.id);
            }}
          >
            <MaterialCommunityIcons name="close-circle" size={20} color={COLORS.white} />
            <Text style={styles.actionButtonText}>Annuler</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.finishButton]}
            onPress={(e) => {
              e.stopPropagation();
              onDeclareFinished(order.id);
            }}
          >
            <MaterialCommunityIcons name="check-circle" size={20} color={COLORS.white} />
            <Text style={styles.actionButtonText}>Terminer</Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default function DeliveriesScreen() {
  const router = useRouter();
  const [activeOrders, setActiveOrders] = useState<any[]>([]);
  const [completedOrders, setCompletedOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<"active" | "completed">("active");

  const fetchOrders = useCallback(async () => {
    try {
      // Get available orders (could be filtered to show only accepted orders)
      const availableOrders = await livreurService.getAvailableOrders();
      // Filter to show only orders accepted by this livreur
      // For now, we'll show all non-available orders as "active"
      // This would ideally come from a separate endpoint
      setActiveOrders(availableOrders.filter((o: any) => o.status === "en_cours_livraison"));
      setCompletedOrders(availableOrders.filter((o: any) => ["livre", "termine"].includes(o.status)));
    } catch (error) {
      console.error("Error fetching orders:", error);
      Alert.alert("Erreur", "Impossible de charger les livraisons");
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

  const handleDeclareFinished = async (orderId: string) => {
    Alert.alert(
      "Confirmer la livraison",
      "Avez-vous livré cette commande ?",
      [
        { text: "Non", style: "cancel" },
        {
          text: "Oui, livré",
          onPress: async () => {
            try {
              await livreurService.declareFinished(orderId);
              Alert.alert("Succès", "Livraison marquée comme terminée !");
              fetchOrders();
            } catch (error: any) {
              Alert.alert("Erreur", error.message || "Impossible de terminer la livraison");
            }
          },
        },
      ]
    );
  };

  const handleCancel = (orderId: string) => {
    Alert.alert(
      "Annuler la livraison",
      "Êtes-vous sûr ? Une pénalité pourrait être appliquée.",
      [
        { text: "Non", style: "cancel" },
        {
          text: "Oui, annuler",
          style: "destructive",
          onPress: async () => {
            try {
              await livreurService.cancelOrder(orderId);
              Alert.alert("Succès", "Livraison annulée");
              fetchOrders();
            } catch (error: any) {
              Alert.alert("Erreur", error.message || "Impossible d'annuler la livraison");
            }
          },
        },
      ]
    );
  };

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <MaterialCommunityIcons 
        name={activeTab === "active" ? "truck-delivery" : "check-circle"} 
        size={64} 
        color={COLORS.textSecondary} 
      />
      <Text style={styles.emptyTitle}>
        {activeTab === "active" ? "Aucune livraison en cours" : "Aucune livraison terminée"}
      </Text>
      <Text style={styles.emptySubtitle}>
        {activeTab === "active" 
          ? "Acceptez des commandes depuis l'accueil"
          : "Vos livraisons terminées apparaîtront ici"}
      </Text>
    </View>
  );

  const orders = activeTab === "active" ? activeOrders : completedOrders;

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
        <Text style={styles.title}>Mes Livraisons</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "active" && styles.activeTab]}
          onPress={() => setActiveTab("active")}
        >
          <Text style={[styles.tabText, activeTab === "active" && styles.activeTabText]}>
            En cours ({activeOrders.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "completed" && styles.activeTab]}
          onPress={() => setActiveTab("completed")}
        >
          <Text style={[styles.tabText, activeTab === "completed" && styles.activeTabText]}>
            Terminées ({completedOrders.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Orders List */}
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <DeliveryCard 
            order={item} 
            onDeclareFinished={handleDeclareFinished}
            onCancel={handleCancel}
          />
        )}
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
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
      />
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
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: COLORS.white,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.textPrimary,
  },
  tabs: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: COLORS.white,
    gap: 12,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 8,
    backgroundColor: COLORS.background,
  },
  activeTab: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },
  activeTabText: {
    color: COLORS.white,
  },
  list: {
    paddingTop: 16,
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
  actionButtons: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    paddingVertical: 12,
    gap: 8,
  },
  cancelButton: {
    backgroundColor: COLORS.danger,
  },
  finishButton: {
    backgroundColor: COLORS.success,
  },
  actionButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "600",
  },
});
