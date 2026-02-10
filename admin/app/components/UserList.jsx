import { useEffect, useState } from "react";
import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import userService from "../services/userService";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [type, setType] = useState("buyer");

  useEffect(() => {
    let mounted = true;
    async function load() {
      const list = await userService.list(type);
      if (mounted) setUsers(list);
    }
    load();
    return () => {
      mounted = false;
    };
  }, [type]);

  return (
    <View style={styles.container}>
      <View style={styles.typeToggle}>
        <TouchableOpacity
          style={[styles.typeBtn, type === "buyer" && styles.typeBtnActive]}
          onPress={() => setType("buyer")}
        >
          <Text
            style={[
              styles.typeBtnText,
              type === "buyer" && styles.typeBtnActiveText,
            ]}
          >
            Acheteurs
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.typeBtn, type === "delivery" && styles.typeBtnActive]}
          onPress={() => setType("delivery")}
        >
          <Text
            style={[
              styles.typeBtnText,
              type === "delivery" && styles.typeBtnActiveText,
            ]}
          >
            Livreurs
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={users}
        keyExtractor={(u) => u.id}
        renderItem={({ item }) => (
          <View style={styles.userCard}>
            <View style={styles.userRow}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{item.avatar}</Text>
              </View>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{item.name}</Text>
                <Text style={styles.userEmail}>{item.email}</Text>
              </View>
              <View
                style={[
                  styles.statusIndicator,
                  {
                    backgroundColor:
                      item.status === "active" ? "#4caf50" : "#f44336",
                  },
                ]}
              />
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
  typeToggle: {
    flexDirection: "row",
    padding: 12,
    gap: 8,
    backgroundColor: "#fff",
  },
  typeBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
  },
  typeBtnActive: { backgroundColor: "#19b3e6" },
  typeBtnText: { fontSize: 13, color: "#637f88", fontWeight: "600" },
  typeBtnActiveText: { color: "#fff" },
  userCard: {
    backgroundColor: "#fff",
    marginHorizontal: 8,
    marginVertical: 4,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  userRow: { flexDirection: "row", alignItems: "center" },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#19b3e6",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  avatarText: { color: "#fff", fontWeight: "700" },
  userInfo: { flex: 1 },
  userName: { fontWeight: "600", fontSize: 14 },
  userEmail: { fontSize: 12, color: "#637f88", marginTop: 2 },
  statusIndicator: { width: 12, height: 12, borderRadius: 6 },
});
