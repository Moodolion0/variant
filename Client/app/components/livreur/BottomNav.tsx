import { MaterialCommunityIcons } from "@expo/vector-icons";
import { usePathname, useRouter } from "expo-router";
import { StyleSheet, TouchableOpacity, View, Text } from "react-native";

const navItems = [
  { name: "home", icon: "home", label: "Accueil", route: "/livreur" },
  { name: "delivery", icon: "truck-delivery", label: "Livraisons", route: "/livreur/deliveries" },
  { name: "wallet", icon: "wallet", label: "Portefeuille", route: "/livreur/wallet" },
  { name: "profile", icon: "account", label: "Profil", route: "/livreur/profile" },
];

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (route: string) => {
    if (route === "/livreur") {
      return pathname === "/livreur" || pathname === "/livreur/";
    }
    return pathname.includes(route);
  };

  return (
    <View style={styles.container}>
      {navItems.map((item) => (
        <TouchableOpacity
          key={item.name}
          style={styles.navItem}
          onPress={() => router.push(item.route as any)}
        >
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons
              name={item.icon as any}
              size={26}
              color={isActive(item.route) ? "#19b3e6" : "#637f88"}
            />
          </View>
          <Text style={[
            styles.label,
            isActive(item.route) && styles.labelActive
          ]}>
            {item.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: 70,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingBottom: 8,
  },
  navItem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainer: {
    position: "relative",
  },
  label: {
    fontSize: 10,
    color: "#637f88",
    marginTop: 2,
  },
  labelActive: {
    color: "#19b3e6",
    fontWeight: "600",
  },
});
