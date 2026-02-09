import React from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import colors from '../../shared/constants/colors';

const categories = ['All', 'Electronics', 'Fashion', 'Home', 'Beauty'];

export default function CategoryChips() {
  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}> 
        {categories.map((c) => (
          <TouchableOpacity key={c} style={[styles.chip, c === 'All' && styles.chipActive]}>
            <Text style={[styles.text, c === 'All' && styles.textActive]}>{c}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingVertical: 8 },
  scroll: { paddingHorizontal: 16, gap: 8 },
  chip: {
    height: 36,
    paddingHorizontal: 16,
    borderRadius: 18,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chipActive: { backgroundColor: colors.textPrimary },
  text: { color: colors.textPrimary },
  textActive: { color: '#fff', fontWeight: '600' },
});
