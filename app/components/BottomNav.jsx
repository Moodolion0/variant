import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import colors from '../constants/colors';

export default function BottomNav(){
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.item}><Text style={[styles.text, styles.active]}>Home</Text></TouchableOpacity>
      <TouchableOpacity style={styles.item}><Text style={styles.text}>Explore</Text></TouchableOpacity>
      <TouchableOpacity style={styles.item}><Text style={styles.text}>Cart</Text></TouchableOpacity>
      <TouchableOpacity style={styles.item}><Text style={styles.text}>Profile</Text></TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 64,
    borderTopWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  item: { flex: 1, alignItems: 'center' },
  text: { fontSize: 12, color: colors.textSecondary },
  active: { color: colors.primary, fontWeight: '700' },
});
