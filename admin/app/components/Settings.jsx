import React from "react";
import {
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function Settings() {
  const [notifications, setNotifications] = React.useState(true);
  const [darkMode, setDarkMode] = React.useState(false);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        <View style={styles.settingRow}>
          <View>
            <Text style={styles.settingLabel}>Notifications en direct</Text>
            <Text style={styles.settingDesc}>
              Recevoir les nouvelles commandes
            </Text>
          </View>
          <Switch value={notifications} onValueChange={setNotifications} />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Apparence</Text>
        <View style={styles.settingRow}>
          <View>
            <Text style={styles.settingLabel}>Mode sombre</Text>
            <Text style={styles.settingDesc}>Activer le thème sombre</Text>
          </View>
          <Switch value={darkMode} onValueChange={setDarkMode} />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Compte</Text>
        <TouchableOpacity style={styles.settingButton}>
          <Text style={styles.settingButtonText}>Changer le mot de passe</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingButton}>
          <Text style={styles.settingButtonText}>Informations de profil</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.section, { marginBottom: 100 }]}>
        <TouchableOpacity style={styles.dangerButton}>
          <Text style={styles.dangerButtonText}>Se déconnecter</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f6f7f8" },
  section: { padding: 16, marginTop: 8 },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#637f88",
    marginBottom: 12,
    textTransform: "uppercase",
  },
  settingRow: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  settingLabel: { fontWeight: "600", fontSize: 14 },
  settingDesc: { fontSize: 12, color: "#637f88", marginTop: 2 },
  settingButton: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    alignItems: "center",
  },
  settingButtonText: { fontWeight: "600", color: "#19b3e6" },
  dangerButton: {
    backgroundColor: "#f44336",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  dangerButtonText: { fontWeight: "700", color: "#fff" },
});
