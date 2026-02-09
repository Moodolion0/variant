import { MaterialIcons } from '@expo/vector-icons';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Couleurs
const colors = {
  primary: '#19b3e6',
  backgroundLight: '#f6f7f8',
  textPrimary: '#111618',
  textSecondary: '#637f88',
  surface: '#ffffff',
};

// Données
const categories = ['All', 'Electronics', 'Fashion', 'Home', 'Beauty'];
const featured = [
  { id: 1, name: 'New Arrivals', image: 'https://picsum.photos/seed/newarrivals/100/150' },
  { id: 2, name: 'Best Sellers', image: 'https://picsum.photos/seed/bestsellers/100/150' },
  { id: 3, name: 'Top Rated', image: 'https://picsum.photos/seed/toprated/100/150' },
  { id: 4, name: 'Accessories', image: 'https://picsum.photos/seed/accessories/100/150' },
];

const products = [
  { id: 1, title: 'Premium Wireless Headphones', price: '$120.00', image: 'https://picsum.photos/seed/headphones/200/200' },
  { id: 2, title: 'Series 7 Smart Watch', price: '$250.00', image: 'https://picsum.photos/seed/watch/200/200' },
  { id: 3, title: 'Pro Running Shoes', price: '$85.00', image: 'https://picsum.photos/seed/shoes/200/200' },
  { id: 4, title: 'Urban Leather Backpack', price: '$45.00', image: 'https://picsum.photos/seed/backpack/200/200' },
];

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeText}>Welcome back</Text>
            <Text style={styles.userName}>Hello, Client 👋</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.iconButton}>
              <MaterialIcons name="notifications" size={20} color="#637f88" />
              <View style={styles.notificationDot} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <MaterialIcons name="shopping-cart" size={20} color="#637f88" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchSection}>
          <View style={styles.searchBar}>
            <MaterialIcons name="search" size={20} color="#637f88" style={styles.searchIcon} />
            <Text style={styles.searchPlaceholder}>Search for products...</Text>
          </View>
          <TouchableOpacity style={styles.filterButton}>
            <MaterialIcons name="tune" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Categories */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
          <View style={styles.categoriesList}>
            {categories.map((category, index) => (
              <TouchableOpacity 
                key={index} 
                style={[
                  styles.categoryChip, 
                  index === 0 && styles.activeCategory
                ]}
              >
                <Text style={[
                  styles.categoryText,
                  index === 0 && styles.activeCategoryText
                ]}>
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Banner */}
        <View style={styles.banner}>
          <View style={styles.bannerContent}>
            <Text style={styles.bannerTag}>Summer Sale</Text>
            <Text style={styles.bannerTitle}>Get 50% Off{'\n'}On All Shoes</Text>
            <TouchableOpacity style={styles.bannerButton}>
              <Text style={styles.bannerButtonText}>Shop Now</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Featured */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.featuredList}>
              {featured.map((item) => (
                <TouchableOpacity key={item.id} style={styles.featuredItem}>
                  <Image source={{ uri: item.image }} style={styles.featuredImage} />
                  <Text style={styles.featuredName}>{item.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Products */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Popular Products</Text>
          <View style={styles.productsGrid}>
            {products.map((product) => (
              <TouchableOpacity key={product.id} style={styles.productCard}>
                <TouchableOpacity style={styles.favoriteButton}>
                  <MaterialIcons name="favorite-border" size={16} color="#637f88" />
                </TouchableOpacity>
                <Image source={{ uri: product.image }} style={styles.productImage} />
                <View style={styles.productInfo}>
                  <Text style={styles.productTitle} numberOfLines={2}>{product.title}</Text>
                  <View style={styles.productFooter}>
                    <Text style={styles.productPrice}>{product.price}</Text>
                    <TouchableOpacity style={styles.addButton}>
                      <MaterialIcons name="add" size={16} color="#fff" />
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100, // Space for bottom nav
  },
  
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.surface,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  welcomeSection: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ef4444',
    borderWidth: 2,
    borderColor: colors.surface,
  },

  // Search
  searchSection: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchPlaceholder: {
    flex: 1,
    color: colors.textSecondary,
    fontSize: 16,
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },

  // Categories
  categoriesContainer: {
    marginHorizontal: -16,
  },
  categoriesList: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
  },
  categoryChip: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  activeCategory: {
    backgroundColor: colors.textPrimary,
    borderWidth: 0,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  activeCategoryText: {
    color: colors.surface,
  },

  // Banner
  banner: {
    marginHorizontal: 16,
    marginVertical: 16,
    borderRadius: 16,
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
    overflow: 'hidden',
  },
  bannerContent: {
    padding: 24,
  },
  bannerTag: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'rgba(255, 255, 255, 0.9)',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  bannerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  bannerButton: {
    alignSelf: 'flex-start',
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  bannerButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.primary,
  },

  // Sections
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.primary,
  },

  // Featured
  featuredList: {
    flexDirection: 'row',
    gap: 16,
  },
  featuredItem: {
    alignItems: 'center',
    gap: 8,
  },
  featuredImage: {
    width: 96,
    height: 128,
    borderRadius: 12,
    backgroundColor: '#e5e7eb',
  },
  featuredName: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textPrimary,
    textAlign: 'center',
  },

  // Products
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  productCard: {
    width: '48%',
    backgroundColor: colors.surface,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f3f4f6',
    overflow: 'hidden',
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  productImage: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#f3f4f6',
  },
  productInfo: {
    padding: 12,
  },
  productTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textPrimary,
    marginBottom: 8,
    minHeight: 32,
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
});
