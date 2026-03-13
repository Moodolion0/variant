import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
  ActivityIndicator,
  Switch,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuth } from "../hooks/useAuth";
import { livreurService } from "../services/livreurService";

const COLORS = {
  primary: "#19b3e6",
  background: "#f6f7f8",
  white: "#ffffff",
  textPrimary: "#111618",
  textSecondary: "#637f88",
  success: "#22c55e",
  warning: "#f59e0b",
  danger: "#ef4444",
};

const MenuItem = ({ icon, title, subtitle, onPress, showArrow = true }: {
  icon: string;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  showArrow?: boolean;
}) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress} disabled={!onPress}>
    <View style={styles.menuIcon}>
      <MaterialCommunityIcons name={icon as any} size={22} color={COLORS.primary} />
    </View>
    <View style={styles.menuContent}>
      <Text style={styles.menuTitle}>{title}</Text>
      {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
    </View>
    {showArrow && onPress && (
      <MaterialCommunityIcons name="chevron-right" size={24} color={COLORS.textSecondary} />
    )}
  </TouchableOpacity>
);

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [profileStatus, setProfileStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  const fetchProfileStatus = useCallback(async () => {
    try {
      const data = await livreurService.getProfileStatus();
      setProfileStatus(data);
    } catch (error) {
      console.error("Error fetching profile status:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchProfileStatus();
  }, [fetchProfileStatus]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchProfileStatus();
  };

  const handleLogout = () => {
    Alert.alert(
      "Déconnexion",
      "Êtes-vous sûr de vouloir vous déconnecter ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Déconnexion",
          style: "destructive",
          onPress: async () => {
            try {
              await logout();
            } catch (error) {
              console.error("Logout error:", error);
            }
          },
        },
      ]
    );
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "valide":
        return { label: "Validé", color: COLORS.success };
      case "en_attente":
        return { label: "En attente", color: COLORS.warning };
      case "bloque":
        return { label: "Bloqué", color: COLORS.danger };
      default:
        return { label: status || "Inconnu", color: COLORS.textSecondary };
    }
  };

  const statusConfig = profileStatus?.status ? getStatusLabel(profileStatus.status) : getStatusLabel("valide");

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[COLORS.primary]}
          tintColor={COLORS.primary}
        />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Mon Profil</Text>
      </View>

      {/* Profile Card */}
      <View style={styles.profileCard}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <MaterialCommunityIcons name="account" size={40} color={COLORS.white} />
          </View>
          <View style={[styles.statusDot, { backgroundColor: isOnline ? COLORS.success : COLORS.textSecondary }]} />
        </View>
        <Text style={styles.userName}>{user?.full_name || "Livreur"}</Text>
        <Text style={styles.userEmail}>{user?.email}</Text>
        {user?.phone_number && (
          <Text style={styles.userPhone}>{user.phone_number}</Text>
        )}
        
        <View style={[styles.statusBadge, { backgroundColor: statusConfig.color + "20" }]}>
          <Text style={[styles.statusText, { color: statusConfig.color }]}>
            {statusConfig.label}
          </Text>
        </View>
      </View>

      {/* Online Status Toggle */}
      <View style={styles.statusToggle}>
        <View style={styles.statusToggleContent}>
          <MaterialCommunityIcons 
            name={isOnline ? "access-point" : "access-point-off"} 
            size={24} 
            color={isOnline ? COLORS.success : COLORS.textSecondary} 
          />
          <View style={styles.statusToggleText}>
            <Text style={styles.statusToggleTitle}>
              {isOnline ? "En ligne" : "Hors ligne"}
            </Text>
            <Text style={styles.statusToggleSubtitle}>
              {isOnline ? "Vous recevez des commandes" : "Vous ne recevez pas de commandes"}
            </Text>
          </View>
        </View>
        <Switch
          value={isOnline}
          onValueChange={setIsOnline}
          trackColor={{ false: COLORS.textSecondary, true: COLORS.success + "80" }}
          thumbColor={isOnline ? COLORS.success : COLORS.white}
        />
      </View>

      {/* Menu Sections */}
      <View style={styles.menuSection}>
        <Text style={styles.sectionTitle}>Mon compte</Text>
        
        <MenuItem
          icon="account-edit"
          title="Modifier le profil"
          subtitle="Nom, téléphone, email"
          onPress={() => Alert.alert("Bientôt disponible", "Fonctionnalité en cours de développement")}
        />
        
        <MenuItem
          icon="truck-delivery"
          title="Mes Véhicules"
          subtitle="Gérer vos véhicules"
          onPress={() => Alert.alert("Bientôt disponible", "Fonctionnalité en cours de développement")}
        />
        
        <MenuItem
          icon="file-document"
          title="Mes Documents"
          subtitle="Permis, assurance, pièces"
          onPress={() => Alert.alert("Bientôt disponible", "Fonctionnalité en cours de développement")}
        />
        
        <MenuItem
          icon="bell"
          title="Notifications"
          subtitle="Gérer les notifications"
          onPress={() => Alert.alert("Bientôt disponible", "Fonctionnalité en cours de développement")}
        />
      </View>

      <View style={styles.menuSection}>
        <Text style={styles.sectionTitle}>Support</Text>
        
        <MenuItem
          icon="help-circle"
          title="Aide & FAQ"
          onPress={() => Alert.alert("Bientôt disponible", "Fonctionnalité en cours de développement")}
        />
        
        <MenuItem
          icon="shield-check"
          title="Conditions générales"
          onPress={() => Alert.alert("Bientôt disponible", "Fonctionnalité en cours de développement")}
        />
        
        <MenuItem
          icon="phone"
          title="Contacter le support"
          onPress={() => Alert.alert("Contacter le support", "Email: support@variant.bj")}
        />
      </View>

      <View style={styles.menuSection}>
        <Text style={styles.sectionTitle}>Autre</Text>
        
        <MenuItem
          icon="cog"
          title="Paramètres"
          onPress={() => Alert.alert("Bientôt disponible", "Fonctionnalité en cours de développement")}
        />
        
        <MenuItem
          icon="logout"
          title="Déconnexion"
          onPress={handleLogout}
          showArrow={false}
        />
      </View>

      {/* Version */}
      <View style={styles.footer}>
        <Text style={styles.versionText}>Variant Livreur v1.0.0</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: COLORS.white,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.textPrimary,
  },
  profileCard: {
    alignItems: "center",
    paddingVertical: 24,
    backgroundColor: COLORS.white,
    marginBottom: 12,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  statusDot: {
    position: "absolute",
    bottom: 4,
    right: 4,
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  userName: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.textPrimary,
  },
  userEmail: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  userPhone: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  statusBadge: {
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 14,
    fontWeight: "600",
  },
  statusToggle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.white,
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 16,
    borderRadius: 12,
  },
  statusToggleContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  statusToggleText: {
    gap: 2,
  },
  statusToggleTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  statusToggleSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  menuSection: {
    backgroundColor: COLORS.white,
    marginBottom: 12,
    paddingTop: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textSecondary,
    paddingHorizontal: 20,
    paddingBottom: 8,
    textTransform: "uppercase",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: COLORS.background,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
  },
  menuContent: {
    flex: 1,
    marginLeft: 12,
  },
  menuTitle: {
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  menuSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  footer: {
    alignItems: "center",
    paddingVertical: 30,
  },
  versionText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
});
