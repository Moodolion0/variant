import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import colors from '../../shared/constants/colors';

export default function Banner() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.small}>Summer Sale</Text>
        <Text style={styles.title}>Get 50% Off on All Shoes</Text>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Shop Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: colors.primary,
  },
  content: { padding: 16 },
  small: { color: '#ffffff', fontSize: 12, fontWeight: '700', marginBottom: 6 },
  title: { color: '#ffffff', fontSize: 18, fontWeight: '800', marginBottom: 12 },
  button: { alignSelf: 'flex-start', backgroundColor: '#fff', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  buttonText: { color: colors.primary, fontWeight: '700' },
});
