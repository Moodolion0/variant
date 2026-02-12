import { MaterialIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import supplierService from "../services/supplierService";

export default function SupplierDetail({ supplierId, onBack }) {
  const [supplier, setSupplier] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      const detail = await supplierService.getDetail(supplierId);
      if (mounted) {
        setSupplier(detail);
        setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [supplierId]);

  if (loading || !supplier) {
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

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <MaterialIcons name="arrow_back_ios" size={20} color="#19b3e6" />
        </TouchableOpacity>
        <Text style={styles.title}>Détails Fournisseur</Text>
        <View style={styles.notificationIcon}>
          <MaterialIcons name="notifications" size={20} color="#999" />
          <View style={styles.notificationDot} />
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Supplier Header Section */}
        <View style={styles.headerSection}>
          <View style={styles.supplierIconLarge}>
            <MaterialIcons name="business" size={32} color="#19b3e6" />
          </View>
          <View style={styles.supplierHeaderInfo}>
            <Text style={styles.supplierName}>{supplier.name}</Text>
            <Text style={styles.supplierId}>
              ID Fournisseur: #{supplier.id}
            </Text>
          </View>
        </View>

        {/* Contact Information */}
        <View style={styles.contactSection}>
          <View style={styles.contactItem}>
            <MaterialIcons name="person" size={20} color="#94a3b8" />
            <View style={styles.contactContent}>
              <Text style={styles.contactLabel}>Contact principal</Text>
              <Text style={styles.contactValue}>{supplier.contact}</Text>
            </View>
          </View>

          <View style={styles.contactItem}>
            <MaterialIcons name="email" size={20} color="#94a3b8" />
            <View style={styles.contactContent}>
              <Text style={styles.contactLabel}>Email</Text>
              <Text style={styles.contactValue}>{supplier.email}</Text>
            </View>
          </View>

          <View style={styles.contactItem}>
            <MaterialIcons name="phone" size={20} color="#94a3b8" />
            <View style={styles.contactContent}>
              <Text style={styles.contactLabel}>Téléphone</Text>
              <Text style={styles.contactValue}>{supplier.phone}</Text>
            </View>
          </View>
        </View>

        {/* Location Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="location_on" size={18} color="#94a3b8" />
            <Text style={styles.sectionTitle}>Localisation</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.address}>
              {supplier.location || "Adresse non disponible"}
            </Text>
            <View style={styles.mapPlaceholder}>
              <MaterialIcons name="place" size={32} color="#ef4444" />
            </View>
            <TouchableOpacity style={styles.gpsBtn}>
              <Text style={styles.gpsBtnText}>OUVRIR GPS</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="bar_chart" size={18} color="#94a3b8" />
            <Text style={styles.sectionTitle}>Statistiques Fournisseur</Text>
          </View>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Produits fournis</Text>
              <View style={styles.statValue}>
                <Text style={styles.statNumber}>
                  {supplier.stat?.products || 0}
                </Text>
                <MaterialIcons name="inventory" size={16} color="#19b3e6" />
              </View>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Commandes totales</Text>
              <View style={styles.statValue}>
                <Text style={styles.statNumber}>
                  {(supplier.stat?.orders || 0).toLocaleString("fr-FR")}
                </Text>
                <MaterialIcons name="shopping_cart" size={16} color="#22c55e" />
              </View>
            </View>
          </View>
        </View>

        {/* Associated Products */}
        <View style={styles.section}>
          <View style={styles.productsHeader}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="list" size={18} color="#94a3b8" />
              <Text style={styles.sectionTitle}>Produits associés</Text>
            </View>
            <TouchableOpacity>
              <Text style={styles.viewAllBtn}>VOIR TOUT</Text>
            </TouchableOpacity>
          </View>
          {(supplier.associatedProducts || []).map((product, idx) => (
            <View key={idx} style={styles.productCard}>
              <View style={styles.productImage}>
                <MaterialIcons name="image" size={20} color="#cbd5e1" />
              </View>
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.productRef}>Réf: {product.ref}</Text>
              </View>
              <Text style={styles.productPrice}>
                {(product.price || 0).toFixed(2)} XOF
              </Text>
            </View>
          ))}
        </View>

        {/* Spacer */}
        <View style={{ height: 150 }} />
      </ScrollView>

      {/* Float Actions */}
      <View style={styles.floatActions}>
        <TouchableOpacity style={styles.primaryBtn}>
          <MaterialIcons name="edit" size={18} color="#fff" />
          <Text style={styles.primaryBtnText}>Modifier le fournisseur</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteBtn}>
          <MaterialIcons name="delete_outline" size={18} color="#ef4444" />
        </TouchableOpacity>
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
  headerSection: {
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    flexDirection: "row",
    gap: 12,
  },
  supplierIconLarge: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: "rgba(25, 179, 230, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  supplierHeaderInfo: {
    flex: 1,
    justifyContent: "center",
  },
  supplierName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1e293b",
  },
  supplierId: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 2,
  },
  contactSection: {
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  contactItem: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
    alignItems: "center",
  },
  contactContent: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: "#94a3b8",
    textTransform: "uppercase",
  },
  contactValue: {
    fontSize: 13,
    fontWeight: "500",
    color: "#1e293b",
    marginTop: 2,
  },
  section: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    overflow: "hidden",
  },
  address: {
    fontSize: 13,
    fontWeight: "500",
    color: "#475569",
    padding: 12,
  },
  mapPlaceholder: {
    height: 120,
    backgroundColor: "#cbd5e1",
    alignItems: "center",
    justifyContent: "center",
  },
  gpsBtn: {
    padding: 8,
    alignItems: "center",
  },
  gpsBtnText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#1e293b",
  },
  statsGrid: {
    flexDirection: "row",
    gap: 12,
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
    fontSize: 11,
    fontWeight: "500",
    color: "#64748b",
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
  productsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  viewAllBtn: {
    fontSize: 10,
    fontWeight: "700",
    color: "#19b3e6",
  },
  productCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    padding: 10,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  productImage: {
    width: 48,
    height: 48,
    borderRadius: 6,
    backgroundColor: "#e2e8f0",
    alignItems: "center",
    justifyContent: "center",
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1e293b",
  },
  productRef: {
    fontSize: 11,
    color: "#64748b",
    marginTop: 2,
  },
  productPrice: {
    fontSize: 13,
    fontWeight: "700",
    color: "#19b3e6",
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
