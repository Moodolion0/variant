import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export default function BottomNav({ current, onNavigate }) {
  const items = [
    { key: "dashboard", label: "Accueil", icon: "dashboard" },
    { key: "orders", label: "Commandes", icon: "shopping_bag" },
    { key: "products", label: "Produits", icon: "inventory_2" },
    { key: "users", label: "Utilisateurs", icon: "group" },
    { key: "settings", label: "Paramètres", icon: "settings" },
  ];

  const isActive = (key) =>
    current === key ||
    (current.includes("create") && key === "products") ||
    (current.includes("order-detail") && key === "orders");

  return (
    <View style={styles.nav}>
      {items.map((item) => (
        <TouchableOpacity
          key={item.key}
          style={styles.btn}
          onPress={() => onNavigate(item.key)}
        >
          <MaterialIcons
            name={item.icon}
            size={24}
            color={isActive(item.key) ? "#19b3e6" : "#637f88"}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  nav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#eee",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  btn: { flex: 1, alignItems: "center", justifyContent: "center" },
});
