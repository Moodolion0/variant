import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const featuredItems = [
  {
    id: 1,
    name: "New Arrivals",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=300&auto=format&fit=crop",
  },
  {
    id: 2,
    name: "Best Sellers",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=300&auto=format&fit=crop",
  },
  {
    id: 3,
    name: "Top Rated",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=300&auto=format&fit=crop",
  },
  {
    id: 4,
    name: "Accessories",
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=300&auto=format&fit=crop",
  },
];

export default function Featured() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Featured</Text>
        <TouchableOpacity>
          <Text style={styles.seeAll}>See All</Text>
        </TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.list}>
          {featuredItems.map((item) => (
            <TouchableOpacity key={item.id} style={styles.item}>
              <Image
                source={{ uri: item.image }}
                style={styles.image}
                resizeMode="cover"
              />
              <Text style={styles.name}>{item.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111618",
  },
  seeAll: {
    fontSize: 14,
    fontWeight: "500",
    color: "#19b3e6",
  },
  list: {
    flexDirection: "row",
    gap: 16,
  },
  item: {
    alignItems: "center",
    gap: 8,
  },
  image: {
    width: 96,
    height: 128,
    borderRadius: 12,
    backgroundColor: "#e5e7eb",
  },
  name: {
    fontSize: 12,
    fontWeight: "500",
    color: "#111618",
    textAlign: "center",
  },
});
