import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import productService from "../services/productService";

export default function ProductDetail({ productId, onBack }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      const detail = await productService.getDetail(productId);
      if (mounted) {
        setProduct(detail);
        setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [productId]);

  if (loading || !product) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack}>
            <MaterialIcons name="arrow_back_ios" size={20} color="#19b3e6" />
          </TouchableOpacity>
          <Text style={styles.title}>Chargement...</Text>
          <MaterialIcons name="notifications" size={20} color="#999" />
        </View>
      </View>
    );
  }

  const stockPercent = (product.stock / 100) * 100; // Assume 100 as max

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <MaterialIcons name="arrow_back_ios" size={20} color="#19b3e6" />
        </TouchableOpacity>
        <Text style={styles.title}>Détails Produit</Text>
        <View style={styles.notificationIcon}>
          <MaterialIcons name="notifications" size={20} color="#999" />
          <View style={styles.notificationDot} />
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Product Image Section */}
        <View style={styles.imageContainer}>
          <View style={styles.imagePlaceholder}>
            <MaterialIcons name="image" size={40} color="#e5e7eb" />
          </View>
          <TouchableOpacity style={styles.addPhotoBtn}>
            <MaterialIcons name="add_a_photo" size={20} color="#fff" />
          </TouchableOpacity>
          <View style={styles.imageIndicator}>
            <View style={styles.dot} />
            <View style={[styles.dot, { opacity: 0.5 }]} />
          </View>
        </View>

        {/* Product Info */}
        <View style={styles.section}>
          <View style={styles.titleRow}>
            <Text style={styles.productTitle}>{product.name}</Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>ACTIF</Text>
            </View>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.price}>{product.price.toFixed(2)} XOF</Text>
            {product.originalPrice && (
              <Text style={styles.originalPrice}>
                {product.originalPrice.toFixed(2)} XOF
              </Text>
            )}
          </View>
        </View>

        {/* Stock Section */}
        <View style={styles.card}>
          <View style={styles.stockHeader}>
            <Text style={styles.stockLabel}>Stock actuel</Text>
            <Text style={styles.stockValue}>{product.stock} unités</Text>
          </View>
          <View style={styles.stockBar}>
            <View
              style={[
                styles.stockBarFill,
                { width: `${Math.min(stockPercent, 100)}%` },
              ]}
            />
          </View>
          <View style={styles.restockInfo}>
            <MaterialIcons
              name="history_toggle_off"
              size={14}
              color="#f59e0b"
            />
            <Text style={styles.restockText}>
              Réapprovisionnement suggéré dans {product.restockDays || 5} jours
            </Text>
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{product.description}</Text>
        </View>

        {/* Supplier Section */}
        <View style={styles.card}>
          <View style={styles.supplierHeader}>
            <MaterialIcons name="factory" size={16} color="#999" />
            <Text style={styles.sectionTitle}>Fournisseur</Text>
          </View>
          <View style={styles.supplierContent}>
            <View style={styles.supplierIcon}>
              <MaterialIcons name="business" size={20} color="#19b3e6" />
            </View>
            <View style={styles.supplierInfo}>
              <Text style={styles.supplierName}>
                {product.supplierDetails?.name || "N/A"}
              </Text>
              <Text style={styles.supplierContact}>
                Contact: {product.supplierDetails?.phone || "N/A"}
              </Text>
            </View>
            <View style={styles.supplierActions}>
              <TouchableOpacity style={styles.actionBtn}>
                <MaterialIcons
                  name="chat_bubble_outline"
                  size={18}
                  color="#19b3e6"
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn}>
                <MaterialIcons name="phone_in_talk" size={18} color="#19b3e6" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Commandes totales</Text>
            <View style={styles.statValue}>
              <Text style={styles.statNumber}>
                {(product.stats?.orders || 0).toLocaleString("fr-FR")}
              </Text>
              <Text style={styles.statBadge}>
                +{product.stats?.growth || 0}%
              </Text>
            </View>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Revenus générés</Text>
            <View style={styles.statValue}>
              <Text style={styles.statNumber}>
                {(product.stats?.revenue || 0).toLocaleString("fr-FR")}XOF
              </Text>
              <MaterialCommunityIcons name="trending-up" size={16} color="#19b3e6" />
            </View>
          </View>
        </View>

        {/* Spacer */}
        <View style={{ height: 150 }} />
      </ScrollView>

      {/* Float Actions */}
      <View style={styles.floatActions}>
        <TouchableOpacity style={styles.primaryBtn}>
          <MaterialIcons name="edit" size={18} color="#fff" />
          <Text style={styles.primaryBtnText}>Modifier le produit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteBtn}>
          <MaterialIcons name="delete_outline" size={18} color="#ef4444" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
  },
  notificationIcon: {
    position: "relative",
  },
  notificationDot: {
    position: "absolute",
    top: 4,
    right: 4,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#ef4444",
    borderWidth: 1,
    borderColor: "#fff",
  },
  scrollView: { flex: 1 },
  imageContainer: {
    position: "relative",
    width: "100%",
    aspectRatio: 4 / 3,
    backgroundColor: "#e2e8f0",
  },
  imagePlaceholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#e2e8f0",
  },
  addPhotoBtn: {
    position: "absolute",
    bottom: 12,
    right: 12,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#19b3e6",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 5,
  },
  imageIndicator: {
    position: "absolute",
    bottom: 12,
    left: "50%",
    marginLeft: -12,
    flexDirection: "row",
    gap: 6,
    backgroundColor: "rgba(0,0,0,0.1)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#fff",
  },
  section: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  productTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1e293b",
    flex: 1,
  },
  statusBadge: {
    backgroundColor: "rgba(25, 179, 230, 0.1)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(25, 179, 230, 0.2)",
  },
  statusText: {
    fontSize: 9,
    fontWeight: "700",
    color: "#19b3e6",
    textTransform: "uppercase",
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 8,
  },
  price: {
    fontSize: 28,
    fontWeight: "700",
    color: "#19b3e6",
  },
  originalPrice: {
    fontSize: 12,
    color: "#94a3b8",
    textDecorationLine: "line-through",
  },
  card: {
    marginHorizontal: 12,
    marginVertical: 8,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  stockHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  stockLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748b",
  },
  stockValue: {
    fontSize: 12,
    fontWeight: "700",
    color: "#1e293b",
  },
  stockBar: {
    height: 8,
    backgroundColor: "#e2e8f0",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 10,
  },
  stockBarFill: {
    height: "100%",
    backgroundColor: "#19b3e6",
    borderRadius: 4,
  },
  restockInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  restockText: {
    fontSize: 9,
    fontWeight: "700",
    color: "#64748b",
    textTransform: "uppercase",
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "700",
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  description: {
    fontSize: 13,
    color: "#475569",
    lineHeight: 20,
  },
  supplierHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 12,
  },
  supplierContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  supplierIcon: {
    width: 40,
    height: 40,
    borderRadius: 6,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    alignItems: "center",
    justifyContent: "center",
  },
  supplierInfo: {
    flex: 1,
  },
  supplierName: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1e293b",
  },
  supplierContact: {
    fontSize: 11,
    color: "#64748b",
    marginTop: 2,
  },
  supplierActions: {
    flexDirection: "row",
    gap: 8,
  },
  actionBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    alignItems: "center",
    justifyContent: "center",
  },
  statsGrid: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  statLabel: {
    fontSize: 9,
    fontWeight: "700",
    color: "#94a3b8",
    textTransform: "uppercase",
    marginBottom: 8,
  },
  statValue: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 6,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1e293b",
  },
  statBadge: {
    fontSize: 10,
    fontWeight: "700",
    color: "#16a34a",
    backgroundColor: "#dcfce7",
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },
  floatActions: {
    position: "absolute",
    bottom: 80,
    left: 12,
    right: 12,
    flexDirection: "row",
    gap: 12,
  },
  primaryBtn: {
    flex: 1,
    backgroundColor: "#19b3e6",
    paddingVertical: 12,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowColor: "#19b3e6",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  primaryBtnText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
  deleteBtn: {
    width: 50,
    backgroundColor: "#fee2e2",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#fecaca",
    alignItems: "center",
    justifyContent: "center",
  },
});
