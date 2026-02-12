import { Stack } from "expo-router";
import { StyleSheet, View } from "react-native";
import BottomNav from "../components/BottomNav";

export default function ClientLayout() {
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
