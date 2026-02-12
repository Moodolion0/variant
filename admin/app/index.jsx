import { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import BottomNav from "./components/BottomNav";
import Dashboard from "./components/Dashboard";
import Header from "./components/Header";
import LoginScreen from "./components/LoginScreen";
import OrderDetail from "./components/OrderDetail";
import OrderList from "./components/OrderList";
import ProductDetail from "./components/ProductDetail";
import ProductForm from "./components/ProductForm";
import ProductList from "./components/ProductList";
import Settings from "./components/Settings";
import SupplierDetail from "./components/SupplierDetail";
import SupplierForm from "./components/SupplierForm";
import UserList from "./components/UserList";

export default function AdminApp() {
  const [route, setRoute] = useState("dashboard");
  const [auth, setAuth] = useState(null);
  const [loading, setLoading] = useState(true);

  // Vérifier si l'admin est déjà authentifié
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("admin_token");
        const user = localStorage.getItem("admin_user");
        if (token && user) {
          setAuth({
            token,
            user: JSON.parse(user),
          });
        }
      }
    } catch (error) {
      console.error("Auth load error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Si pas authentifié, afficher login
  if (!auth) {
    return (
      <SafeAreaView style={styles.container}>
        <LoginScreen
          onLoginSuccess={(authData) => {
            setAuth(authData);
          }}
        />
      </SafeAreaView>
    );
  }

  // Check if we're in a detail/form view (no BottomNav)
  const isDetailView =
    route.startsWith("order-detail-") ||
    route.startsWith("product-detail-") ||
    route.startsWith("supplier-detail-") ||
    route === "create-product" ||
    route === "create-supplier";

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("admin_token");
      localStorage.removeItem("admin_user");
    }
    setAuth(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      {route === "dashboard" && <Header onLogout={handleLogout} />}
      <View style={styles.content}>
        {route === "dashboard" && <Dashboard onNavigate={setRoute} />}
        {route === "products" && (
          <ProductList
            token={auth.token}
            onCreate={(type) => {
              if (type === "product") {
                setRoute("create-product");
              } else {
                setRoute("create-supplier");
              }
            }}
            onProductDetail={(id) => setRoute(`product-detail-${id}`)}
            onSupplierDetail={(id) => setRoute(`supplier-detail-${id}`)}
          />
        )}
        {route === "create-product" && (
          <ProductForm
            token={auth.token}
            onDone={() => setRoute("products")}
          />
        )}
        {route === "create-supplier" && (
          <SupplierForm onDone={() => setRoute("products")} />
        )}
        {route.startsWith("product-detail-") && (
          <ProductDetail
            productId={route.replace("product-detail-", "")}
            token={auth.token}
            onBack={() => setRoute("products")}
          />
        )}
        {route.startsWith("supplier-detail-") && (
          <SupplierDetail
            supplierId={route.replace("supplier-detail-", "")}
            onBack={() => setRoute("products")}
          />
        )}
        {route === "orders" && (
          <OrderList onDetail={(id) => setRoute(`order-detail-${id}`)} />
        )}
        {route.startsWith("order-detail-") && (
          <OrderDetail
            orderId={route.replace("order-detail-", "")}
            onBack={() => setRoute("orders")}
          />
        )}
        {route === "users" && <UserList />}
        {route === "settings" && <Settings onLogout={handleLogout} />}
      </View>
      {!isDetailView && <BottomNav current={route} onNavigate={setRoute} />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f6f7f8" },
  content: { flex: 1 },
});
