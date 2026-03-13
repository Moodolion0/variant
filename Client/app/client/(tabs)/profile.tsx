import { MaterialIcons } from '@expo/vector-icons';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Alert,
} from 'react-native';
import { useAuth } from '../../hooks/useAuth';

const colors = {
  primary: '#19b3e6',
  backgroundLight: '#f6f7f8',
  textPrimary: '#111618',
  textSecondary: '#637f88',
};

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Déconnecter',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
            } catch (err) {
              console.error('Logout error:', err);
            }
          },
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      {/* Header (title + notif icon) */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profil</Text>
        <TouchableOpacity style={styles.headerBtn}>
          <MaterialIcons name="notifications-none" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.profileTop}>
          <View style={styles.avatarWrapper}>
            <Image
              source={{ uri: user?.photo_url || 'https://via.placeholder.com/150' }}
              style={styles.avatar}
            />
            <View style={styles.cameraBadge}>
              <MaterialIcons name="photo-camera" size={16} color="#fff" />
            </View>
          </View>
          <Text style={styles.name}>{user?.full_name || user?.name || 'Utilisateur'}</Text>
          <Text style={styles.email}>{user?.email || 'email@exemple.com'}</Text>
        </View>

        <View style={styles.card}>
          <TouchableOpacity style={styles.row}>
            <View style={styles.rowLeft}>
              <View style={styles.iconBg}>
                <MaterialIcons name="person-outline" size={22} color={colors.primary} />
              </View>
              <Text style={styles.rowText}>Mes Informations</Text>
            </View>
            <MaterialIcons name="chevron-right" size={20} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.row}>
            <View style={styles.rowLeft}>
              <View style={styles.iconBg}>
                <MaterialIcons name="map" size={22} color={colors.primary} />
              </View>
              <Text style={styles.rowText}>Mes Adresses Enregistrées</Text>
            </View>
            <MaterialIcons name="chevron-right" size={20} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.row}>
            <View style={styles.rowLeft}>
              <View style={styles.iconBg}>
                <MaterialIcons name="credit-card" size={22} color={colors.primary} />
              </View>
              <Text style={styles.rowText}>Moyens de Paiement</Text>
            </View>
            <MaterialIcons name="chevron-right" size={20} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.row}>
            <View style={styles.rowLeft}>
              <View style={styles.iconBg}>
                <MaterialIcons name="notifications-active" size={22} color={colors.primary} />
              </View>
              <Text style={styles.rowText}>Centre de Notifications</Text>
            </View>
            <View style={styles.rowRight}>
              <View style={styles.badge}><Text style={styles.badgeText}>3</Text></View>
              <MaterialIcons name="chevron-right" size={20} color={colors.textSecondary} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.row}>
            <View style={styles.rowLeft}>
              <View style={styles.iconBg}>
                <MaterialIcons name="help-outline" size={22} color={colors.primary} />
              </View>
              <Text style={styles.rowText}>Aide & Support</Text>
            </View>
            <MaterialIcons name="chevron-right" size={20} color={colors.textSecondary} />
          </TouchableOpacity>

        </View>

        <TouchableOpacity style={styles.logoutRow} onPress={handleLogout}>
          <View style={styles.logoutInner}>
            <MaterialIcons name="logout" size={22} color="#ef4444" />
            <Text style={styles.logoutText}>Déconnexion</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.backgroundLight },
  header: {
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.backgroundLight,
  },
  headerTitle: { fontSize: 20, fontWeight: '700', color: colors.textPrimary },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    elevation: 2,
  },
  content: { padding: 16, paddingBottom: 120 },
  profileTop: { alignItems: 'center', marginBottom: 20 },
  avatarWrapper: { position: 'relative' },
  avatar: { width: 96, height: 96, borderRadius: 48, borderWidth: 4, borderColor: '#fff', backgroundColor: '#ddd' },
  cameraBadge: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    backgroundColor: colors.primary,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  name: { marginTop: 12, fontSize: 18, fontWeight: '700', color: colors.textPrimary },
  email: { fontSize: 13, color: colors.textSecondary, marginTop: 4 },
  card: { backgroundColor: '#fff', borderRadius: 12, paddingVertical: 8, paddingHorizontal: 6, elevation: 2 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 14, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  rowLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconBg: { width: 40, height: 40, borderRadius: 8, alignItems: 'center', justifyContent: 'center', backgroundColor: `${colors.primary}1A` },
  rowText: { fontSize: 15, color: colors.textPrimary },
  rowRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  badge: { backgroundColor: '#ef4444', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8 },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  logoutRow: { marginTop: 20, backgroundColor: '#fff', borderRadius: 12, padding: 14, alignItems: 'center' },
  logoutInner: { flexDirection: 'row', alignItems: 'center' },
  logoutText: { color: '#ef4444', fontWeight: '700', fontSize: 16, marginLeft: 8 },
});
