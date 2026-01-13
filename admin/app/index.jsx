import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function AdminApp(){
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Bonjour, Admin</Text>
        <Text style={styles.date}>12 Octobre, 2023</Text>
      </View>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={styles.title}>Quick stats and charts will appear here.</Text>
        <View style={{ height: 16 }} />
        <Text>Use this minimal project to develop the admin UI separately.</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f6f7f8' },
  header: { padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#eee' },
  greeting: { fontSize: 20, fontWeight: '700' },
  date: { color: '#637f88', marginTop: 4 },
  title: { fontSize: 16, fontWeight: '700' }
});
