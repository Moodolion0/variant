import { StyleSheet, Text, View } from 'react-native';
import BottomNav from '../components/BottomNav';
import colors from '../constants/colors';

export default function CategoriesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Catégories</Text>
      <Text style={styles.placeholder}>À venir...</Text>
      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.backgroundLight, padding: 16 },
  title: { fontSize: 24, fontWeight: '700', color: colors.textPrimary },
  placeholder: { fontSize: 14, color: colors.textSecondary, marginTop: 16 },
});
