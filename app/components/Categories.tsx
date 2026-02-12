import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const categories = ["All", "Electronics", "Fashion", "Home", "Beauty"];

interface CategoriesProps {
  activeCategory?: number;
  onSelectCategory?: (index: number) => void;
}

export default function Categories({
  activeCategory = 0,
  onSelectCategory,
}: CategoriesProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.container}
    >
      <View style={styles.list}>
        {categories.map((category, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.chip, activeCategory === index && styles.activeChip]}
            onPress={() => onSelectCategory?.(index)}
          >
            <Text
              style={[
                styles.text,
                activeCategory === index && styles.activeText,
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: -16,
  },
  list: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 12,
    paddingVertical: 8,
  },
  chip: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  activeChip: {
    backgroundColor: "#111618",
    borderWidth: 0,
  },
  text: {
    fontSize: 14,
    fontWeight: "500",
    color: "#111618",
  },
  activeText: {
    color: "#ffffff",
  },
});
