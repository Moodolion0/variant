import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import colors from '../../shared/constants/colors';

export default function SearchBar({ placeholder = 'Search...' }) {
  return (
    <View style={styles.wrapper}>
      <TextInput placeholder={placeholder} style={styles.input} placeholderTextColor="#9CA3AF" />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  input: {
    height: 48,
    borderRadius: 12,
    paddingHorizontal: 12,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
});
