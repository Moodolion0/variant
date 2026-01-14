import { FlatList, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import Banner from '../components/Banner';
import BottomNav from '../components/BottomNav';
import CategoryChips from '../components/CategoryChips';
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';
import TopBar from '../components/TopBar';

import products from '../constants/products';
import useInfiniteFetchQuery from '../hooks/useInfiniteFetchQuery';

const PAGE_SIZE = 12; // page size for infinite loading

export default function ClientHome() {
  // local fetcher that simulates paging
  const fetcher = async ({ pageParam = 0, pageSize = PAGE_SIZE }) => {
    const start = pageParam * pageSize;
    const items = products.slice(start, start + pageSize);
    const nextPageParam = start + pageSize >= products.length ? null : pageParam + 1;
    // simulate network delay
    await new Promise((res) => setTimeout(res, 250));
    return { items, nextPageParam };
  };

  const { data, fetchNextPage, isFetchingNextPage, hasNextPage } = useInfiniteFetchQuery(fetcher, { initialPageParam: 0, pageSize: PAGE_SIZE });
  const items = (data?.pages || []).flat();

  const renderHeader = () => (
    <View>
      <SearchBar placeholder="Search for products..." />
      <CategoryChips />
      <Banner />

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Featured</Text>
        <Text style={styles.link}>See All</Text>
      </View>
      <FlatList
        data={[1,2,3,4]}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(i)=>String(i)}
        renderItem={({item}) => (
          <View style={styles.featureItem}><Text style={styles.featureText}>{['New Arrivals','Best Sellers','Top Rated','Accessories'][item-1]}</Text></View>
        )}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
      />

      <View style={styles.productsHeader}>
        <Text style={styles.sectionTitle}>Popular Products</Text>
      </View>
    </View>
  );

  const onEndReached = () => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  };

  return (
    <View style={styles.container}>
      <TopBar title="Hello, Client 👋" subtitle="Welcome back" />

      <FlatList
        data={items}
        keyExtractor={(i) => i.id}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between', paddingHorizontal: 16 }}
        renderItem={({ item }) => (
          <View style={{ width: '48%' }}>
            <ProductCard product={item} />
          </View>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        ListHeaderComponent={renderHeader}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.6}
        ListFooterComponent={() => (
          isFetchingNextPage ? <View style={{ padding: 12 }}><ActivityIndicator /></View> : <View style={{ height: 80 }} />
        )}
        contentContainerStyle={{ paddingTop: 12, paddingBottom: 0 }}
        showsVerticalScrollIndicator={false}
      />

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
