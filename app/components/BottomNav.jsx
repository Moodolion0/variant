import { MaterialCommunityIcons } from '@expo/vector-icons';
import { usePathname, useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import colors from '../constants/colors';
import useCart from '../hooks/useCart';

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();
  const { count } = useCart();

  const tabs = [
    { label: 'Accueil', icon: 'home', route: '/client' },
    { label: 'Catégories', icon: 'category', route: '/categories' },
    { label: 'Panier', icon: 'shopping_cart', route: '/cart', badge: count > 0 ? count : null },
    { label: 'Commandes', icon: 'receipt_long', route: '/orders' },
    { label: 'Profil', icon: 'person', route: '/profile' },
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = pathname === tab.route || pathname.startsWith(tab.route);
        return (
          <TouchableOpacity
            key={tab.route}
            style={styles.item}
            onPress={() => router.push(tab.route)}
          >
            <View style={{ position: 'relative' }}>
              <MaterialCommunityIcons
                name={tab.icon}
                size={24}
                color={isActive ? colors.primary : colors.textSecondary}
              />
              {tab.badge ? (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{tab.badge}</Text>
                </View>
              ) : null}
            </View>
            <Text style={[styles.label, isActive && styles.labelActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 80,
    borderTopWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 8,
  },
  item: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 4 },
  label: { fontSize: 10, color: colors.textSecondary, fontWeight: '500' },
  labelActive: { color: colors.primary, fontWeight: '700' },
  badge: { position: 'absolute', top: -6, right: -8, backgroundColor: colors.primary, borderRadius: 8, paddingHorizontal: 4, paddingVertical: 2, minWidth: 16, alignItems: 'center' },
  badgeText: { color: '#fff', fontSize: 8, fontWeight: '700' },
});
