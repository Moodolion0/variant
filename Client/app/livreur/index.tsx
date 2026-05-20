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

const formatPrice = (price: any) => {
  const num = typeof price === "number" ? price : parseFloat(price) || 0;
  return `${num.toFixed(2)} XOF`;
};

// Order card component
const OrderCard = ({
  order,
  isAccepted,
  onAccept,
  onDeclareFinished,
  onCancel,
}: {
  order: any;
  isAccepted?: boolean;
  onAccept?: (id: string) => void;
  onDeclareFinished?: (id: string) => void;
  onCancel?: (id: string) => void;
}) => {
  const router = useRouter();

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
        {order.client && (
          <View style={styles.detailRow}>
            <MaterialCommunityIcons name="account" size={16} color={COLORS.textSecondary} />
            <Text style={styles.detailText}>
              {order.client.full_name || order.client.email || "Client"}
            </Text>
          </View>
        )}
        <View style={styles.detailRow}>
          <MaterialCommunityIcons name="currency-usd" size={16} color={COLORS.textSecondary} />
          <Text style={styles.detailText}>Total: {formatPrice(order.total_price)}</Text>
        </View>
        {order.delivery_fee > 0 && (
          <View style={styles.detailRow}>
            <MaterialCommunityIcons name="truck" size={16} color={COLORS.success} />
            <Text style={[styles.detailText, { color: COLORS.success }]}>
              Livraison: {formatPrice(order.delivery_fee)}
            </Text>
          </View>
        )}
      </View>

      {/* Bouton Accepter (seulement commandes libres, status=paye, pas de livreur) */}
      {order.status === "paye" && !order.livreur_id && onAccept && (
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

      {/* Boutons Terminer / Annuler (commandes en cours pour ce livreur) */}
      {order.status === "en_cours_livraison" && isAccepted && (
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.cancelButton]}
            onPress={(e) => {
              e.stopPropagation();
              onCancel?.(order.id);
            }}
          >
            <MaterialCommunityIcons name="close-circle" size={20} color={COLORS.white} />
            <Text style={styles.actionButtonText}>Annuler</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.finishButton]}
            onPress={(e) => {
              e.stopPropagation();
              onDeclareFinished?.(order.id);
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

export default function LivreurHomeScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [availableOrders, setAvailableOrders] = useState<any[]>([]);
  const [myOrders, setMyOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<"available" | "mine">("mine");

  const fetchOrders = useCallback(async () => {
    try {
      const [available, mine] = await Promise.all([
        livreurService.getAvailableOrders(),
        livreurService.getMyOrders(),
      ]);
      setAvailableOrders(available || []);
      setMyOrders(mine || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      Alert.alert("Erreur", "Impossible de charger les commandes");
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

  const handleDeclareFinished = async (orderId: string) => {
    Alert.alert(
      "Confirmer la livraison",
      "Avez-vous livré cette commande ?",
      [
        { text: "Non", style: "cancel" },
        {
          text: "Oui, livrer",
          onPress: async () => {
            try {
              await livreurService.declareFinished(orderId);
              Alert.alert("Succès", "Livraison terminée !");
              fetchOrders();
            } catch (error: any) {
              Alert.alert("Erreur", error.message || "Impossible de terminer");
            }
          },
        },
      ]
    );
  };

  const handleCancel = async (orderId: string) => {
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
              Alert.alert("Erreur", error.message || "Impossible d'annuler");
            }
          },
        },
      ]
    );
  };

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <MaterialCommunityIcons
        name={activeTab === "available" ? "package-variant" : "truck-delivery"}
        size={64}
        color={COLORS.textSecondary}
      />
      <Text style={styles.emptyTitle}>
        {activeTab === "available"
          ? "Aucune commande disponible"
          : "Aucune commande en cours"}
      </Text>
      <Text style={styles.emptySubtitle}>
        {activeTab === "available"
          ? "Revenez plus tard pour voir les nouvelles commandes"
          : "Acceptez des commandes pour les voir ici"}
      </Text>
    </View>
  );

  const currentOrders = activeTab === "available" ? availableOrders : myOrders;

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
          <Text style={styles.subtitle}>Commandes près de chez vous</Text>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <MaterialCommunityIcons name="bell-outline" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <MaterialCommunityIcons name="truck-delivery" size={24} color={COLORS.primary} />
          <Text style={styles.statValue}>{availableOrders.length}</Text>
          <Text style={styles.statLabel}>Disponibles</Text>
        </View>
        <View style={styles.statCard}>
          <MaterialCommunityIcons name="clock-outline" size={24} color={COLORS.warning} />
          <Text style={styles.statValue}>
            {myOrders.filter((o) => o.status === "en_cours_livraison").length}
          </Text>
          <Text style={styles.statLabel}>En cours</Text>
        </View>
        <View style={styles.statCard}>
          <MaterialCommunityIcons name="check-circle-outline" size={24} color={COLORS.success} />
          <Text style={styles.statValue}>
            {myOrders.filter((o) => ["livre", "termine"].includes(o.status)).length}
          </Text>
          <Text style={styles.statLabel}>Terminées</Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "mine" && styles.activeTab]}
          onPress={() => setActiveTab("mine")}
        >
          <Text style={[styles.tabText, activeTab === "mine" && styles.activeTabText]}>
            Mes commandes ({myOrders.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "available" && styles.activeTab]}
          onPress={() => setActiveTab("available")}
        >
          <Text style={[styles.tabText, activeTab === "available" && styles.activeTabText]}>
            Disponibles ({availableOrders.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Orders List */}
      <View style={styles.listContainer}>
        <FlatList
          data={currentOrders}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <OrderCard
              order={item}
              isAccepted={activeTab === "mine"}
              onAccept={handleAcceptOrder}
              onDeclareFinished={handleDeclareFinished}
              onCancel={handleCancel}
            />
          )}
          ListEmptyComponent={renderEmptyList}
          contentContainerStyle={currentOrders.length === 0 ? styles.emptyList : styles.list}
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
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.05)",
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
  tabs: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: COLORS.white,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.background,
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
  listContainer: {
    flex: 1,
    paddingHorizontal: 20,
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
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.05)",
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
