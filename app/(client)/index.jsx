import { FlatList, ScrollView, StyleSheet, Text, View } from 'react-native';
import Banner from '../components/Banner';
import BottomNav from '../components/BottomNav';
import CategoryChips from '../components/CategoryChips';
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';
import TopBar from '../components/TopBar';

const PRODUCTS = [
  { id: '1', title: 'Premium Wireless Headphones', price: '$120.00' },
  { id: '2', title: 'Series 7 Smart Watch', price: '$250.00' },
  { id: '3', title: 'Pro Running Shoes', price: '$85.00' },
  { id: '4', title: 'Urban Leather Backpack', price: '$45.00' },
  { id: '5', title: 'Noise Cancelling Earbuds', price: '$60.00' },
  { id: '6', title: 'Fitness Band', price: '$39.00' },
];

export default function ClientHome() {
  return (
    <View style={styles.container}>
      <TopBar title="Hello, Client 👋" subtitle="Welcome back" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <SearchBar placeholder="Search for products..." />
        <CategoryChips />
        <Banner />

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Featured</Text>
          <Text style={styles.link}>See All</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}>
          {/* Simple featured items as placeholder */}
          <View style={styles.featureItem}><Text style={styles.featureText}>New Arrivals</Text></View>
          <View style={styles.featureItem}><Text style={styles.featureText}>Best Sellers</Text></View>
          <View style={styles.featureItem}><Text style={styles.featureText}>Top Rated</Text></View>
          <View style={styles.featureItem}><Text style={styles.featureText}>Accessories</Text></View>
        </ScrollView>

        <View style={styles.productsHeader}>
          <Text style={styles.sectionTitle}>Popular Products</Text>
        </View>

        <FlatList
          data={PRODUCTS}
          keyExtractor={(i) => i.id}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: 'space-between', paddingHorizontal: 16 }}
          renderItem={({ item }) => (
            <View style={{ width: '48%' }}>
              <ProductCard title={item.title} price={item.price} />
            </View>
          )}
          ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        />

        <View style={{ height: 120 }} />
      </ScrollView>
      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f6f7f8' },
  content: { paddingBottom: 40 },
  sectionHeader: { paddingHorizontal: 16, marginTop: 8, marginBottom: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#111618' },
  link: { fontSize: 12, color: '#19b3e6' },
  featureItem: { width: 96, height: 128, borderRadius: 12, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', marginRight: 8, borderWidth: 1, borderColor: '#f3f4f6' },
  featureText: { fontSize: 12, fontWeight: '600' },
  productsHeader: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 6 },
});
