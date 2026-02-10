import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Header() {
  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.date}>12 Octobre, 2023</Text>
        <Text style={styles.greeting}>Bonjour, Admin</Text>
      </View>
      <TouchableOpacity style={styles.notifBtn}>
        <MaterialIcons name="notifications" size={24} color="#111618" />
        <View style={styles.notifDot} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 16,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderColor: "#eee",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  date: { color: "#637f88", fontSize: 12 },
  greeting: { fontSize: 20, fontWeight: "700" },
  notifBtn: {
    position: "relative",
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
    justifyContent: "center",
  },
  notifDot: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#19b3e6",
  },
});
