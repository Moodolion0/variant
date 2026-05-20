import { View, Text } from 'react-native';
import { default as ProductCard } from './ProductCard';
import { default as CategoryChips } from './CategoryChips';

export { ProductCard, CategoryChips };

export default function ListsScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Lists Screen</Text>
    </View>
  );
}
