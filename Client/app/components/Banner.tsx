import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Banner() {
  return (
    <View style={styles.banner}>
      <View style={styles.content}>
        <Text style={styles.tag}>Summer Sale</Text>
        <Text style={styles.title}>Get 50% Off{"\n"}On All Shoes</Text>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Shop Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    marginHorizontal: 16,
    marginVertical: 16,
    borderRadius: 16,
    backgroundColor: "#19b3e6",
    shadowColor: "#19b3e6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
    overflow: "hidden",
  },
  content: {
    padding: 24,
  },
  tag: {
    fontSize: 12,
    fontWeight: "bold",
    color: "rgba(255, 255, 255, 0.9)",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 12,
  },
  button: {
    alignSelf: "flex-start",
    backgroundColor: "#ffffff",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#19b3e6",
  },
});
