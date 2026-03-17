import { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Orders from "./pages/Orders";
import Sales from "./pages/Sales";
import Stock from "./pages/Stock";

interface User {
  id: number;
  full_name: string;
  email: string;
  role: string;
}

function AppContent() {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for stored auth data
    const storedToken = localStorage.getItem("supplier_token");
    const storedUser = localStorage.getItem("supplier_user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const handleLogin = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    // Explicitly store in localStorage to ensure persistence
    localStorage.setItem("supplier_token", newToken);
    localStorage.setItem("supplier_user", JSON.stringify(newUser));
  };

  const handleLogout = async () => {
    if (token) {
      try {
        await fetch("http://localhost:8000/api/logout", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
      } catch (error) {
        console.error("Logout error:", error);
      }
    }

    localStorage.removeItem("supplier_token");
    localStorage.removeItem("supplier_user");
    setToken(null);
    setUser(null);
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={
          token ? (
            <Navigate to="/" replace />
          ) : (
            <Login onLogin={handleLogin} />
          )
        }
      />
      <Route
        element={
          token ? (
            <Layout user={user} onLogout={handleLogout} />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      >
        <Route path="/" element={<Dashboard token={token} />} />
        <Route path="/orders" element={<Orders token={token} />} />
        <Route path="/stock" element={<Stock token={token} />} />
        <Route path="/sales" element={<Sales token={token} />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
