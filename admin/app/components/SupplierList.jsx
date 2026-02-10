import { useEffect, useState } from "react";
import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import supplierService from "../services/supplierService";

export default function SupplierList({ onAdd }) {
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    let mounted = true;
    async function load() {
      const list = await supplierService.list();
      if (mounted) setSuppliers(list);
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Fournisseurs</Text>
        <TouchableOpacity onPress={onAdd} style={styles.addBtn}>
          <Text style={styles.addText}>+ Ajouter</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={suppliers}
        keyExtractor={(s) => s.id}
        renderItem={({ item }) => (
          <View style={styles.supplierCard}>
            <View style={styles.supplierIcon}>
              <Text style={styles.iconText}>🏭</Text>
            </View>
            <View style={styles.supplierInfo}>
              <Text style={styles.supplierName}>{item.name}</Text>
              <Text style={styles.supplierLocation}>📍 {item.location}</Text>
              <Text style={styles.supplierEmail}>{item.email}</Text>
            </View>
          </View>
        )}
        contentContainerStyle={{ padding: 8, paddingBottom: 100 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#fff",
  },
  title: { fontSize: 16, fontWeight: "700" },
  addBtn: {
    backgroundColor: "#19b3e6",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addText: { color: "#fff", fontSize: 12, fontWeight: "700" },
  supplierCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    marginHorizontal: 8,
    marginVertical: 4,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    alignItems: "center",
  },
  supplierIcon: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: "#19b3e6",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  iconText: { fontSize: 24 },
  supplierInfo: { flex: 1 },
  supplierName: { fontWeight: "700", fontSize: 14 },
  supplierLocation: { fontSize: 12, color: "#637f88", marginTop: 2 },
  supplierEmail: { fontSize: 11, color: "#999", marginTop: 1 },
});
