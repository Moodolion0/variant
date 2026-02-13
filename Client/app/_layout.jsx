import { Slot } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "./hooks/useAuth";
import { useEffect } from "react";

export default function Layout() {
  useEffect(() => {
    if (typeof document !== "undefined" && !document.getElementById("material-icons-css")) {
      const link = document.createElement("link");
      link.id = "material-icons-css";
      link.rel = "stylesheet";
      link.href = "https://fonts.googleapis.com/icon?family=Material+Icons";
      document.head.appendChild(link);
    }
  }, []);

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <Slot />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
