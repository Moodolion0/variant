import { useState } from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import BottomNav from "./components/BottomNav";
import Dashboard from "./components/Dashboard";
import Header from "./components/Header";
import OrderList from "./components/OrderList";
import ProductForm from "./components/ProductForm";
import ProductList from "./components/ProductList";
import Settings from "./components/Settings";
import SupplierForm from "./components/SupplierForm";
import SupplierList from "./components/SupplierList";
import UserList from "./components/UserList";

export default function AdminApp() {
  const [route, setRoute] = useState("dashboard");

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <View style={styles.content}>
        {route === "dashboard" && <Dashboard onNavigate={setRoute} />}
        {route === "products" && (
          <ProductList onCreate={() => setRoute("create")} />
        )}
        {route === "create" && (
          <ProductForm onDone={() => setRoute("products")} />
        )}
        {route === "orders" && (
          <OrderList onDetail={(id) => setRoute(`order-detail-${id}`)} />
        )}
        {route === "users" && <UserList />}
        {route === "suppliers" && (
          <SupplierList onAdd={() => setRoute("suppliers-add")} />
        )}
        {route === "suppliers-add" && (
          <SupplierForm onDone={() => setRoute("suppliers")} />
        )}
        {route === "settings" && <Settings />}
      </View>
      <BottomNav current={route} onNavigate={setRoute} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f6f7f8" },
  content: { flex: 1 },
});
