import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import colors from '../constants/colors';

export default function ProductCard({ title = '', price = '' }) {
  return (
    <View style={styles.card}>
      <View style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>{title}</Text>
        <View style={styles.row}>
          <Text style={styles.price}>{price}</Text>
          <TouchableOpacity style={styles.addBtn}>
            <Text style={{ color: '#fff' }}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: 12, borderRadius: 14, overflow: 'hidden', backgroundColor: '#fff', borderWidth: 1, borderColor: '#f3f4f6' },
  image: { height: 180, backgroundColor: '#e6e7ea' },
  info: { padding: 12 },
  title: { fontSize: 14, fontWeight: '600', color: colors.textPrimary, marginBottom: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  price: { fontSize: 16, fontWeight: '700', color: colors.primary },
  addBtn: { backgroundColor: colors.primary, padding: 8, borderRadius: 8 },
});
