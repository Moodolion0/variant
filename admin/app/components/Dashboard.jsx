import { MaterialIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import orderService from "../services/orderService";

export default function Dashboard({ onNavigate }) {
  const [orders, setOrders] = useState([]);
  const [timeFilter, setTimeFilter] = useState("today");

  useEffect(() => {
    let mounted = true;
    async function load() {
      const list = await orderService.list("all");
      if (mounted) setOrders(list.slice(0, 4));
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);
  const stats = [
    { label: "Ventes", value: "12 450 €", percent: "12%", icon: "payments" },
    { label: "Commandes", value: "85", percent: "5%", icon: "shopping_bag" },
    { label: "Clients", value: "24", percent: "18%", icon: "group" },
    { label: "Produits", value: "142", percent: "0%", icon: "inventory_2" },
  ];

  const actions = [
    { key: "create", label: "Ajouter\nProduit", icon: "add_box" },
    { key: "users", label: "Nouvel\nAdmin", icon: "person_add" },
    { key: "suppliers", label: "Gérer\nStock", icon: "inventory" },
    { key: "orders", label: "Suivi\nLivraison", icon: "local_shipping" },
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
        <TouchableOpacity style={styles.calendarBtn}>
          <Text>📅</Text>
        </TouchableOpacity>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        {stats.map((stat, i) => (
          <View key={i} style={styles.statCard}>
            <View style={styles.statTop}>
              <MaterialIcons name={stat.icon} size={20} color="#19b3e6" />
              <View
                style={[
                  styles.statPercent,
                  stat.percent === "0%"
                    ? styles.percentZero
                    : styles.percentPositive,
                ]}
              >
                {stat.percent !== "0%" && (
                  <MaterialIcons
                    name="trending_up"
                    size={12}
                    color={stat.percent === "0%" ? "#637f88" : "#22c55e"}
                  />
                )}
                <Text
                  style={[
                    styles.percentText,
                    stat.percent === "0%" ? styles.percentZeroText : null,
                  ]}
                >
                  {stat.percent === "0%" ? stat.percent : `+${stat.percent}`}
                </Text>
              </View>
            </View>
            <Text style={styles.statLabel}>{stat.label.toUpperCase()}</Text>
            <Text style={styles.statValue}>{stat.value}</Text>
          </View>
        ))}
      </View>

      {/* Sales Chart */}
      <View style={styles.chartCard}>
        <View style={styles.chartHeader}>
          <View>
            <Text style={styles.chartSubtitle}>Performance des Ventes</Text>
            <Text style={styles.chartValue}>12 450 €</Text>
          </View>
          <View style={styles.chartGrowth}>
            <MaterialIcons name="trending_up" size={14} color="#22c55e" />
            <Text style={styles.growthText}>+12%</Text>
          </View>
        </View>
        <View style={styles.chartPlaceholder}>
          <Text style={styles.chartPlaceholderText}>
            Graphique de performance
          </Text>
        </View>
        <View style={styles.chartDays}>
          {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((day, i) => (
            <Text key={i} style={styles.dayLabel}>
              {day}
            </Text>
          ))}
        </View>
      </View>

      {/* Actions Rapides */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Actions rapides</Text>
        <View style={styles.actionsRow}>
          {actions.map((action) => (
            <TouchableOpacity
              key={action.key}
              style={styles.actionBtn}
              onPress={() => onNavigate(action.key)}
            >
              <View style={styles.actionIconWrapper}>
                <MaterialIcons name={action.icon} size={28} color="#19b3e6" />
              </View>
              <Text style={styles.actionLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Recent Orders */}
      <View style={styles.section}>
        <View style={styles.ordersHeader}>
          <Text style={styles.sectionTitle}>Commandes Récentes</Text>
          <TouchableOpacity onPress={() => onNavigate("orders")}>
            <Text style={styles.seeAllLink}>Voir tout</Text>
          </TouchableOpacity>
        </View>
        {orders.map((order) => (
          <View key={order.id} style={styles.orderItem}>
            <View style={styles.orderTop}>
              <View style={styles.avatarBox}>
                <Text style={styles.avatarText}>
                  {order.customer
                    .split(" ")
                    .map((w) => w[0])
                    .join("")}
                </Text>
              </View>
              <View style={styles.orderInfo}>
                <View style={styles.orderNameRow}>
                  <Text style={styles.orderName}>{order.customer}</Text>
                  <Text style={styles.orderAmount}>
                    {order.amount.toFixed(2)} €
                  </Text>
                </View>
                <View style={styles.orderStatusRow}>
                  <Text style={styles.orderRef}>
                    {order.ref} • {order.date}
                  </Text>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: statusColor(order.status) },
                    ]}
                  >
                    <Text style={styles.statusLabel}>
                      {order.status === "en_cours"
                        ? "En cours"
                        : order.status === "livree"
                          ? "Livré"
                          : "Expédié"}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        ))}
      </View>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f6f7f8" },
  filterRow: {
    flexDirection: "row",
    padding: 12,
    gap: 8,
    backgroundColor: "#fff",
  },
  filterBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  filterActive: { backgroundColor: "#19b3e6", borderColor: "#19b3e6" },
  filterText: { fontSize: 12, color: "#637f88", fontWeight: "500" },
  filterActiveText: { color: "#fff", fontWeight: "700" },
  calendarBtn: {
    width: 40,
    height: 36,
    borderRadius: 8,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    alignItems: "center",
    justifyContent: "center",
  },
  statsGrid: { flexDirection: "row", flexWrap: "wrap", padding: 12, gap: 8 },
  statCard: {
    flex: 1,
    minWidth: "48%",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  statTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  statIcon: { fontSize: 20 },
  statPercent: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    gap: 2,
  },
  percentPositive: { backgroundColor: "#dcfce7" },
  percentZero: { backgroundColor: "#f3f4f6" },
  percentText: { fontSize: 10, fontWeight: "700", color: "#22c55e" },
  percentZeroText: { color: "#637f88" },
  statLabel: {
    fontSize: 11,
    color: "#637f88",
    fontWeight: "500",
    marginBottom: 4,
  },
  statValue: { fontSize: 20, fontWeight: "700" },
  chartCard: {
    backgroundColor: "#fff",
    marginHorizontal: 12,
    marginVertical: 8,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  chartHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  chartSubtitle: { fontSize: 12, color: "#637f88", fontWeight: "500" },
  chartValue: { fontSize: 24, fontWeight: "700", marginTop: 4 },
  chartGrowth: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#dcfce7",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  growthIcon: { fontSize: 14, marginRight: 4 },
  growthText: { fontSize: 11, fontWeight: "700", color: "#22c55e" },
  chartPlaceholder: {
    height: 100,
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  chartPlaceholderText: { color: "#9ca3af" },
  chartDays: { flexDirection: "row", justifyContent: "space-between" },
  dayLabel: {
    fontSize: 11,
    color: "#637f88",
    fontWeight: "500",
    textAlign: "center",
  },
  section: { padding: 12 },
  sectionTitle: { fontSize: 14, fontWeight: "700", marginBottom: 12 },
  ordersHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  seeAllLink: { color: "#19b3e6", fontSize: 12, fontWeight: "600" },
  actionsRow: { flexDirection: "row", gap: 8, justifyContent: "space-between" },
  actionBtn: { flex: 1, alignItems: "center", gap: 6 },
  actionIconWrapper: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#eff6fc",
    alignItems: "center",
    justifyContent: "center",
  },
  actionIcon: { fontSize: 24 },
  actionLabel: {
    fontSize: 10,
    textAlign: "center",
    fontWeight: "600",
    color: "#637f88",
  },
  orderItem: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  orderTop: { flexDirection: "row", gap: 12 },
  avatarBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { fontWeight: "700", fontSize: 12 },
  orderInfo: { flex: 1 },
  orderNameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  orderName: { fontSize: 13, fontWeight: "600" },
  orderAmount: { fontSize: 13, fontWeight: "700" },
  orderStatusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  orderRef: { fontSize: 11, color: "#637f88" },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12 },
  statusLabel: { fontSize: 10, fontWeight: "700", color: "#fff" },
});
