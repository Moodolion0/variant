import { MaterialCommunityIcons } from "@expo/vector-icons";

import { useEffect, useState } from "react";

import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import orderService from "../services/orderService";
import dashboardService from "../services/dashboardService";

export default function Dashboard({ onNavigate, token }) {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const [timeFilter, setTimeFilter] = useState("today");

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      try {
        const [ordersList, statsData] = await Promise.all([
          orderService.list("all"),
          token ? dashboardService.getStats(token) : Promise.resolve(null),
        ]);

        if (mounted) {
          setOrders(ordersList.slice(0, 4));
          setStats(statsData);
        }
      } catch (error) {
        console.error("Error loading dashboard:", error);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, [token]);

  const displayStats = stats ? [
    { label: "Ventes", value: `${stats.total_sales || 0} XOF`, icon: "credit-card" },
    { label: "Commandes", value: String(stats.total_orders || 0), icon: "shopping-outline" },
    { label: "Clients", value: String(stats.total_clients || 0), icon: "account-group-outline" },
    { label: "Produits", value: String(stats.total_products || 0), icon: "cube-outline" },
  ] : [
    { label: "Ventes", value: "0 XOF", icon: "credit-card" },
    { label: "Commandes", value: "0", icon: "shopping-outline" },
    { label: "Clients", value: "0", icon: "account-group-outline" },
    { label: "Produits", value: "0", icon: "cube-outline" },
  ];

  const actions = [
    { key: "create", label: "Ajouter\nProduit", icon: "plus-box" },

    { key: "users", label: "Nouvel\nAdmin", icon: "account-plus" },

    { key: "suppliers", label: "Gérer\nStock", icon: "cube" },

    { key: "orders", label: "Suivi\nLivraison", icon: "truck" },
  ];

  const statusColor = (status) => {
    const map = { en_cours: "#fbbf24", livree: "#22c55e", expediee: "#3b82f6" };

    return map[status] || "#6b7280";
  };

  return (
    <ScrollView style={styles.container}>
      {/* Time Filters */}

      <View style={styles.filterRow}>
        {["today", "7days", "30days"].map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterBtn, timeFilter === f && styles.filterActive]}
            onPress={() => setTimeFilter(f)}
          >
            <Text
              style={[
                styles.filterText,

                timeFilter === f && styles.filterActiveText,
              ]}
            >
              {f === "today"
                ? "Aujourd'hui"
                : f === "7days"
                ? "7 jours"
                : "30 jours"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Stats Grid */}

      <View style={styles.statsGrid}>
        {displayStats.map((stat, index) => (
          <View key={index} style={styles.statCard}>
            <View style={styles.statIcon}>
              <MaterialCommunityIcons
                name={stat.icon}
                size={24}
                color="#19b3e6"
              />
            </View>
            <Text style={styles.statLabel}>{stat.label}</Text>
            <Text style={styles.statValue}>{stat.value}</Text>
          </View>
        ))}
      </View>

      {/* Quick Actions */}

      <View style={styles.actionsRow}>
        {actions.map((action) => (
          <TouchableOpacity
            key={action.key}
            style={styles.actionBtn}
            onPress={() => {
              if (action.key === "create") onNavigate("create-product");
              if (action.key === "users") onNavigate("users");
              if (action.key === "suppliers") onNavigate("products");
              if (action.key === "orders") onNavigate("orders");
            }}
          >
            <View style={styles.actionIcon}>
              <MaterialCommunityIcons
                name={action.icon}
                size={24}
                color="#fff"
              />
            </View>
            <Text style={styles.actionLabel}>{action.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Recent Orders */}

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Commandes récentes</Text>

          <TouchableOpacity onPress={() => onNavigate("orders")}>
            <Text style={styles.seeAll}>Voir tout</Text>
          </TouchableOpacity>
        </View>

        {orders.length === 0 ? (
          <Text style={styles.emptyText}>Aucune commande</Text>
        ) : (
          orders.map((order) => (
            <TouchableOpacity
              key={order.id}
              style={styles.orderCard}
              onPress={() => onNavigate(`order-detail-${order.id}`)}
            >
              <View style={styles.orderHeader}>
                <Text style={styles.orderId}>#{order.id}</Text>

                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: statusColor(order.status) },
                  ]}
                >
                  <Text style={styles.statusText}>{order.status}</Text>
                </View>
              </View>

              <View style={styles.orderInfo}>
                <Text style={styles.orderClient}>
                  {order.client_name || "Client"}
                </Text>

                <Text style={styles.orderTotal}>{order.total_price} XOF</Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
  },

  filterRow: {
    flexDirection: "row",
    padding: 16,
    gap: 8,
  },

  filterBtn: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#fff",
    alignItems: "center",
  },

  filterActive: {
    backgroundColor: "#19b3e6",
  },

  filterText: {
    color: "#6b7280",
    fontWeight: "500",
  },

  filterActiveText: {
    color: "#fff",
  },

  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 8,
    justifyContent: "space-between",
  },

  statCard: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: "1%",
    marginBottom: 8,
  },

  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#e0f2fe",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },

  statLabel: {
    color: "#6b7280",
    fontSize: 14,
  },

  statValue: {
    color: "#111827",
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 4,
  },

  actionsRow: {
    flexDirection: "row",
    paddingHorizontal: 8,
    gap: 8,
    marginVertical: 16,
  },

  actionBtn: {
    flex: 1,
    alignItems: "center",
  },

  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: "#19b3e6",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },

  actionLabel: {
    color: "#374151",
    fontSize: 12,
    textAlign: "center",
  },

  section: {
    padding: 16,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },

  seeAll: {
    color: "#19b3e6",
    fontWeight: "500",
  },

  emptyText: {
    textAlign: "center",
    color: "#6b7280",
    padding: 20,
  },

  orderCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },

  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },

  orderId: {
    fontWeight: "600",
    color: "#111827",
  },

  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },

  statusText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
  },

  orderInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  orderClient: {
    color: "#6b7280",
  },

  orderTotal: {
    fontWeight: "600",
    color: "#111827",
  },
});
