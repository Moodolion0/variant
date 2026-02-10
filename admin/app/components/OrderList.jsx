import { useEffect, useState } from "react";
import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import orderService from "../services/orderService";

export default function OrderList({ onDetail }) {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    let mounted = true;
    async function load() {
      const list = await orderService.list(filter);
      if (mounted) setOrders(list);
    }
    load();
    return () => {
      mounted = false;
    };
  }, [filter]);

  const statusBg = (status) => {
    const map = { en_cours: "#e3f2fd", livree: "#e8f5e9", expediee: "#f3e5f5" };
    return map[status] || "#f5f5f5";
  };

  return (
    <View style={styles.container}>
      <View style={styles.filterRow}>
        {["all", "en_cours", "livree", "expediee"].map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterBtn, filter === f && styles.filterActive]}
            onPress={() => setFilter(f)}
          >
            <Text
              style={[
                styles.filterText,
                filter === f && styles.filterActiveText,
              ]}
            >
              {f === "all"
                ? "Toutes"
                : f === "en_cours"
                  ? "En cours"
                  : f === "livree"
                    ? "Livrées"
                    : "Expédiées"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={orders}
        keyExtractor={(o) => o.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.orderCard}
            onPress={() => onDetail(item.id)}
          >
            <View style={styles.orderHeader}>
              <View>
                <Text style={styles.orderRef}>{item.ref}</Text>
                <Text style={styles.orderDate}>{item.date}</Text>
              </View>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: statusBg(item.status) },
                ]}
              >
                <Text style={styles.statusText}>
                  {item.status === "en_cours"
                    ? "En cours"
                    : item.status === "livree"
                      ? "Livrée"
                      : "Expédiée"}
                </Text>
              </View>
            </View>
            <View style={styles.orderFooter}>
              <View>
                <Text style={styles.customerName}>{item.customer}</Text>
                <Text style={styles.itemCount}>{item.items} articles</Text>
              </View>
              <Text style={styles.amount}>{item.amount.toFixed(2)} €</Text>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ padding: 8, paddingBottom: 100 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  filterRow: {
    flexDirection: "row",
    padding: 8,
    gap: 4,
    backgroundColor: "#fff",
  },
  filterBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
  },
  filterActive: { backgroundColor: "#19b3e6" },
  filterText: { fontSize: 12, color: "#637f88" },
  filterActiveText: { color: "#fff", fontWeight: "700" },
  orderCard: {
    backgroundColor: "#fff",
    marginHorizontal: 8,
    marginVertical: 4,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  orderRef: { fontWeight: "700", fontSize: 14 },
  orderDate: { fontSize: 12, color: "#637f88", marginTop: 2 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  statusText: { fontSize: 11, fontWeight: "600" },
  orderFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  customerName: { fontWeight: "600" },
  itemCount: { fontSize: 12, color: "#637f88", marginTop: 2 },
  amount: { fontWeight: "700", fontSize: 14 },
});
