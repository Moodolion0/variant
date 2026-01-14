import React from 'react';
import { View, ScrollView, Text } from 'react-native';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';

export default function AdminHome(){
  return (
    <View style={{ flex: 1, backgroundColor: '#f6f7f8' }}>
      <TopBar title="Bonjour, Admin" subtitle="12 Octobre, 2023" />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 120 }}>
        <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 12 }}>Quick stats and charts will go here.</Text>
        <View style={{ height: 12 }} />
        <Text>Placeholder for cards and lists (see maquette)</Text>
      </ScrollView>
      <BottomNav />
    </View>
  );
}
