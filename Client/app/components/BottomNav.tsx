import { MaterialCommunityIcons } from "@expo/vector-icons";
import { usePathname, useRouter } from "expo-router";
import { StyleSheet, TouchableOpacity, View } from "react-native";

const navItems = [
  { name: "home", icon: "home", route: "/client/(tabs)/home" },
  { name: "search", icon: "magnify", route: "/client/(tabs)/products" },
  { name: "orders", icon: "file-document", route: "/client/(tabs)/orders" },
  { name: "profile", icon: "account", route: "/client/(tabs)/profile" },
];

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (route: string) => {
    return pathname.includes(route.split("/").pop() || "");
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
});
