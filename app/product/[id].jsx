import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import colors from '../shared/constants/colors';
import products from '../shared/constants/products';
import useCart from '../shared/hooks/useCart';

export default function ProductDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { addItem } = useCart();
  const product = products.find(p => p.id === id) || products[0];
  const [qty, setQty] = useState(1);

  const inc = () => setQty(q => Math.min(99, q + 1));
  const dec = () => setQty(q => Math.max(1, q - 1));
  const addToCart = () => {
    addItem(product, qty);
    router.back();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={colors.textSecondary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{product.title}</Text>
        <TouchableOpacity>
          <MaterialCommunityIcons name="share-variant" size={24} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <Image source={{ uri: product.image }} style={styles.image} />

      <View style={styles.body}>
        <View style={styles.rowTop}>
          <Text style={styles.title}>{product.title}</Text>
          {product.new ? <Text style={styles.badge}>Nouveau</Text> : null}
        </View>

        <Text style={styles.price}>{product.price}</Text>
        <Text style={styles.category}>{product.category} • ⭐ {product.rating}</Text>

        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>{product.description}</Text>

        <View style={styles.quantityRow}>
          <Text style={styles.sectionTitle}>Quantité</Text>
          <View style={styles.qtyControls}>
            <TouchableOpacity onPress={dec} style={styles.qtyBtn}><Text style={styles.qtyBtnText}>−</Text></TouchableOpacity>
            <Text style={styles.qty}>{qty}</Text>
            <TouchableOpacity onPress={inc} style={styles.qtyBtn}><Text style={styles.qtyBtnText}>+</Text></TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.addToCartBtn} onPress={addToCart}>
          <Text style={styles.addToCartText}>Ajouter au panier • {product.price}</Text>
        </TouchableOpacity>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.backgroundLight },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderColor: '#e5e7eb', backgroundColor: '#fff' },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: 16, fontWeight: '600', color: colors.textPrimary, marginHorizontal: 12, numberOfLines: 1 },
  image: { width: '100%', height: 360, backgroundColor: '#eee' },
  body: { padding: 16, backgroundColor: colors.backgroundLight },
  rowTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 20, fontWeight: '700', color: colors.textPrimary, flex: 1, marginRight: 8 },
  badge: { backgroundColor: colors.primary, color: '#fff', paddingVertical: 4, paddingHorizontal: 8, borderRadius: 8, overflow: 'hidden' },
  price: { fontSize: 22, fontWeight: '800', color: colors.primary, marginTop: 8 },
  category: { color: colors.textSecondary, marginTop: 6 },
  sectionTitle: { marginTop: 16, fontWeight: '700', color: colors.textPrimary },
  description: { color: colors.textSecondary, marginTop: 8 },
  quantityRow: { marginTop: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  qtyControls: { flexDirection: 'row', alignItems: 'center' },
  qtyBtn: { width: 36, height: 36, borderRadius: 8, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#e6e7ea' },
  qtyBtnText: { fontSize: 20, color: colors.textPrimary },
  qty: { marginHorizontal: 12, fontSize: 16 },
  addToCartBtn: { marginTop: 20, backgroundColor: colors.primary, paddingVertical: 14, alignItems: 'center', borderRadius: 12 },
  addToCartText: { color: '#fff', fontWeight: '700' },
});