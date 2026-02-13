import { MaterialIcons } from "@expo/vector-icons";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Header({ onLogout }) {
  const handleLogout = () => {
    Alert.alert("Déconnexion", "Êtes-vous sûr de vouloir vous déconnecter?", [
      { text: "Annuler", onPress: () => {}, style: "cancel" },
      {
        text: "Déconnecter",
        onPress: () => onLogout && onLogout(),
        style: "destructive",
      },
    ]);
  };

  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.date}>12 Octobre, 2023</Text>
        <Text style={styles.greeting}>Bonjour, Admin</Text>
      </View>
      <View style={styles.iconGroup}>
        <TouchableOpacity style={styles.notifBtn}>
          <MaterialIcons name="notifications" size={24} color="#111618" />
          <View style={styles.notifDot} />
        </TouchableOpacity>
        {onLogout && (
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <MaterialIcons name="logout" size={24} color="#111618" />
          </TouchableOpacity>
        )}
      </View>
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
  iconGroup: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  notifBtn: {
    position: "relative",
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
    justifyContent: "center",
  },
  logoutBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fee2e2",
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
