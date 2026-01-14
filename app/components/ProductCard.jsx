import { useRouter } from 'expo-router';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import colors from '../constants/colors';

export default function ProductCard({ product }) {
  const router = useRouter();
  const onPress = () => {
    if (product && product.id) router.push(`/product/${product.id}`);
  };
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      <Image source={{ uri: product?.image }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>{product?.title}</Text>
        <View style={styles.row}>
          <Text style={styles.price}>{product?.price}</Text>
          <View style={styles.addBtn}>
            <Text style={{ color: '#fff' }}>+</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: 12, borderRadius: 14, overflow: 'hidden', backgroundColor: '#fff', borderWidth: 1, borderColor: '#f3f4f6' },
  image: { height: 180, backgroundColor: '#e6e7ea', width: '100%' },
  info: { padding: 12 },
  title: { fontSize: 14, fontWeight: '600', color: colors.textPrimary, marginBottom: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  price: { fontSize: 16, fontWeight: '700', color: colors.primary },
  addBtn: { backgroundColor: colors.primary, padding: 8, borderRadius: 8 },
});
