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

export default function OrderDetail({ orderId, onBack }) {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      const detail = await orderService.getDetail(orderId);
      if (mounted) {
        setOrder(detail);
        setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [orderId]);

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack}>
            <MaterialIcons name="arrow_back_ios" size={20} color="#111618" />
          </TouchableOpacity>
          <Text style={styles.title}>Chargement...</Text>
          <View style={{ width: 20 }} />
        </View>
      </View>
    );
  }

  if (!order) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack}>
            <MaterialIcons name="arrow_back_ios" size={20} color="#111618" />
          </TouchableOpacity>
          <Text style={styles.title}>Commande non trouvée</Text>
          <View style={{ width: 20 }} />
        </View>
      </View>
    );
  }

  const statusBgColor =
    {
      en_cours: "#fef3c7",
      livree: "#dcfce7",
      expediee: "#dbeafe",
    }[order.status] || "#f3f4f6";

  const statusTextColor =
    {
      en_cours: "#b45309",
      livree: "#16a34a",
      expediee: "#0369a1",
    }[order.status] || "#637f88";

  const statusLabel =
    {
      en_cours: "En cours",
      livree: "Livrée",
      expediee: "Expédiée",
    }[order.status] || order.status;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <MaterialIcons name="arrow_back_ios" size={20} color="#111618" />
        </TouchableOpacity>
        <Text style={styles.title}>Détails {order.ref}</Text>
        <View style={[styles.statusBadge, { backgroundColor: statusBgColor }]}>
          <Text style={[styles.statusLabel, { color: statusTextColor }]}>
            {statusLabel}
          </Text>
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Client Information Card */}
        <View style={[styles.card, styles.marginSection]}>
          <Text style={styles.sectionTitle}>Client</Text>
          <View style={styles.clientInfo}>
            <View
              style={[
                styles.avatar,
                { backgroundColor: "#19b3e6", opacity: 0.1 },
              ]}
            >
              <MaterialIcons name="person" size={24} color="#19b3e6" />
            </View>
            <View style={styles.clientDetails}>
              <Text style={styles.clientName}>{order.customer.name}</Text>
              <Text style={styles.clientAddress}>{order.customer.address}</Text>
              <View style={styles.clientPhone}>
                <MaterialIcons name="call" size={14} color="#19b3e6" />
                <Text style={styles.clientPhoneText}>
                  {order.customer.phone}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Products Section */}
        <View style={[styles.card, styles.marginSection]}>
          <Text style={styles.sectionTitle}>Produits commandés</Text>
          {order.items.map((item, idx) => (
            <View
              key={idx}
              style={[
                styles.productItem,
                idx < order.items.length - 1 && styles.productItemBorder,
              ]}
            >
              <View style={styles.productImage}>
                <MaterialIcons name="image" size={20} color="#e5e7eb" />
              </View>
              <View style={styles.productContent}>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productSupplier}>
                  Fournisseur: {item.supplier}
                </Text>
                <Text style={styles.productQty}>
                  Qté: {item.quantity} x {item.price}XOF
                </Text>
              </View>
              <Text style={styles.productTotal}>{item.total}XOF</Text>
            </View>
          ))}

          {/* Financial Summary */}
          <View style={styles.summary}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Sous-total</Text>
              <Text style={styles.summaryValue}>{order.subtotal}XOF</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Frais de livraison</Text>
              <Text style={styles.summaryValue}>{order.shippingFee}XOF</Text>
            </View>
            <View style={[styles.summaryRow, styles.summaryTotal]}>
              <Text style={styles.totalLabel}>Total Final</Text>
              <Text style={styles.totalValue}>{order.total}XOF</Text>
            </View>
          </View>
        </View>

        {/* Logistics Section */}
        <View style={[styles.card, styles.marginSection]}>
          <Text style={styles.sectionTitle}>Logistique</Text>
          <View style={styles.logisticsContent}>
            <View style={styles.logisticsIcon}>
              <MaterialIcons name="directions_bike" size={20} color="#19b3e6" />
            </View>
            <View style={styles.logisticsInfo}>
              <Text style={styles.livreurName}>
                Livreur: {order.delivery.name}
              </Text>
              <Text style={styles.livreurDistance}>
                Distance estimée: {order.delivery.distance} km
              </Text>
            </View>
            <TouchableOpacity style={styles.followBtn}>
              <Text style={styles.followBtnText}>Suivre</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Spacer for footer */}
        <View style={{ height: 200 }} />
      </ScrollView>

      {/* Fixed Footer Actions */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.primaryBtn}>
          <Text style={styles.primaryBtnText}>Modifier le statut</Text>
        </TouchableOpacity>
        <View style={styles.secondaryBtns}>
          <TouchableOpacity style={styles.secondaryBtn}>
            <MaterialIcons name="message" size={18} color="#19b3e6" />
            <Text style={styles.secondaryBtnText}>Client</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryBtn}>
            <MaterialIcons name="electric_moped" size={18} color="#19b3e6" />
            <Text style={styles.secondaryBtnText}>Livreur</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f6f7f8" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111618",
    flex: 1,
    textAlign: "center",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusLabel: {
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  scrollView: { flex: 1 },
  marginSection: {
    marginHorizontal: 12,
    marginVertical: 12,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "700",
    color: "#999999",
    textTransform: "uppercase",
    marginBottom: 12,
    paddingHorizontal: 12,
    paddingTop: 12,
    letterSpacing: 1.2,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    overflow: "hidden",
  },
  clientInfo: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 12,
    paddingBottom: 12,
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 0,
  },
  clientDetails: {
    flex: 1,
  },
  clientName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111618",
  },
  clientAddress: {
    fontSize: 12,
    color: "#637f88",
    marginTop: 2,
  },
  clientPhone: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 6,
  },
  clientPhoneText: {
    fontSize: 12,
    color: "#19b3e6",
    fontWeight: "500",
  },
  productItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 12,
  },
  productItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  productImage: {
    width: 56,
    height: 56,
    borderRadius: 6,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
    justifyContent: "center",
  },
  productContent: {
    flex: 1,
  },
  productName: {
    fontSize: 13,
    fontWeight: "600",
    color: "#111618",
  },
  productSupplier: {
    fontSize: 11,
    color: "#637f88",
    marginTop: 2,
  },
  productQty: {
    fontSize: 11,
    color: "#637f88",
  },
  productTotal: {
    fontSize: 13,
    fontWeight: "700",
    color: "#111618",
  },
  summary: {
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    backgroundColor: "#f9f9f9",
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  summaryLabel: {
    fontSize: 12,
    color: "#637f88",
  },
  summaryValue: {
    fontSize: 12,
    color: "#637f88",
  },
  summaryTotal: {
    marginBottom: 0,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    paddingTop: 8,
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#111618",
  },
  totalValue: {
    fontSize: 13,
    fontWeight: "700",
    color: "#19b3e6",
  },
  logisticsContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 12,
  },
  logisticsIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(25, 179, 230, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  logisticsInfo: {
    flex: 1,
  },
  livreurName: {
    fontSize: 13,
    fontWeight: "600",
    color: "#111618",
  },
  livreurDistance: {
    fontSize: 11,
    color: "#637f88",
    marginTop: 2,
  },
  followBtn: {
    backgroundColor: "rgba(25, 179, 230, 0.1)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  followBtnText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#19b3e6",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  primaryBtn: {
    backgroundColor: "#19b3e6",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 12,
  },
  primaryBtnText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
  secondaryBtns: {
    flexDirection: "row",
    gap: 12,
  },
  secondaryBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 6,
  },
  secondaryBtnText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#111618",
  },
});
