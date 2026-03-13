import { Stack } from "expo-router";
import { StyleSheet, View } from "react-native";
import BottomNav from "../components/livreur/BottomNav";

export default function LivreurLayout() {
  return (
    <View style={styles.container}>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
