import { MaterialIcons } from "@expo/vector-icons";
import {
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";

interface SearchBarProps {
  onSearch?: (text: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  return (
    <View style={styles.searchSection}>
      <View style={styles.searchBar}>
        <MaterialIcons
          name="search"
          size={20}
          color="#637f88"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search for products..."
          placeholderTextColor="#637f88"
          onChangeText={onSearch}
        />
      </View>
      <TouchableOpacity style={styles.filterButton}>
        <MaterialIcons name="tune" size={20} color="#ffffff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  searchSection: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: "#111618",
    fontSize: 16,
    paddingVertical: 12,
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#19b3e6",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#19b3e6",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
});
