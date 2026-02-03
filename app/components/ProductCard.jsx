import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import colors from '../constants/colors';
import useCart from '../hooks/useCart';

export default function ProductCard({ product }) {
  const router = useRouter();
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const goToDetail = () => {
    if (product && product.id) router.push(`/product/${product.id}`);
  };

  const onAdd = (e) => {
    // add single item
    addItem(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 800);
    if (e && e.stopPropagation) e.stopPropagation();
  };

  return (
    <View style={styles.card}>
      <TouchableOpacity onPress={goToDetail} activeOpacity={0.9} style={{ flex: 1 }}>
        <Image source={{ uri: product?.image }} style={styles.image} />
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={2}>{product?.title}</Text>
          <View style={styles.row}>
            <Text style={styles.price}>{product?.price}</Text>
            <TouchableOpacity style={styles.addBtn} onPress={onAdd} accessibilityLabel="Ajouter au panier">
              <Text style={{ color: '#fff', fontWeight: '700' }}>{added ? '✓' : '+'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </View>
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
