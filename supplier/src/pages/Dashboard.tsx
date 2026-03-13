import { useEffect, useState } from "react";
import { authService, supplierService, orderService } from "../services/api";

interface DashboardStats {
  totalSales: number;
  monthlySales: number;
  ordersProcessed: number;
}

interface RecentOrder {
  id: number;
  created_at: string;
  client: {
    full_name: string;
  };
  total_price: number;
  status: string;
}

interface DashboardProps {
  token: string | null;
}

export default function Dashboard({ token }: DashboardProps) {
  const [stats, setStats] = useState<DashboardStats>({
    totalSales: 0,
    monthlySales: 0,
    ordersProcessed: 0,
  });
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch supplier products and orders
        const [productsData, ordersData] = await Promise.all([
          supplierService.getProducts(token),
          orderService.getSupplierOrders(token),
        ]);

        const orders = ordersData.data || ordersData;
        const products = productsData.data || productsData;

        // Calculate stats
        const totalSales = orders.reduce(
          (sum: number, order: any) => sum + (order.total_price || 0),
          0
        );
        const monthlySales = orders
          .filter((o: any) => {
            const orderDate = new Date(o.created_at);
            const now = new Date();
            return (
              orderDate.getMonth() === now.getMonth() &&
              orderDate.getFullYear() === now.getFullYear()
            );
          })
          .reduce((sum: number, order: any) => sum + (order.total_price || 0), 0);

        setStats({
          totalSales,
          monthlySales,
          ordersProcessed: orders.length,
        });

        setRecentOrders(orders.slice(0, 5));
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { bg: string; text: string; label: string }> = {
      en_attente: { bg: "bg-yellow-100", text: "text-yellow-800", label: "En attente" },
      paye: { bg: "bg-blue-100", text: "text-blue-800", label: "Payé" },
      en_cours_livraison: { bg: "bg-indigo-100", text: "text-indigo-800", label: "En cours" },
      livre: { bg: "bg-green-100", text: "text-green-800", label: "Livré" },
      termine: { bg: "bg-green-100", text: "text-green-800", label: "Terminé" },
      annule: { bg: "bg-red-100", text: "text-red-800", label: "Annulé" },
    };

    const { bg, text, label } = statusMap[status] || {
      bg: "bg-gray-100",
      text: "text-gray-800",
      label: status,
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bg} ${text}`}>
        {label}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XOF",
    }).format(price);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <>
      {/* Top Header */}
      <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-10">
        <h1 className="text-lg font-semibold text-gray-800">Tableau de bord</h1>
        <div className="flex items-center gap-4">
          {/* Notification Bell */}
          <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <span className="absolute top-2 right-2.5 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
          </button>
          <div className="h-8 w-px bg-gray-200 mx-1"></div>
          <span className="text-sm text-gray-500 font-medium">Fournisseur</span>
        </div>
      </header>

      {/* Dashboard Content */}
      <div className="p-8 space-y-8 max-w-7xl mx-auto w-full">
        {/* KPI Cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-sm font-medium text-gray-500 mb-1">Chiffre d'affaires total</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-bold text-gray-900">{formatPrice(stats.totalSales)}</h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-sm font-medium text-gray-500 mb-1">Ventes du mois</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-bold text-gray-900">{formatPrice(stats.monthlySales)}</h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-sm font-medium text-gray-500 mb-1">Commandes traitées</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-bold text-gray-900">{stats.ordersProcessed}</h3>
            </div>
          </div>
        </section>

        {/* Recent Orders Table */}
        <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Commandes Récentes</h2>
          </div>
          <div className="overflow-x-auto">
            {recentOrders.length > 0 ? (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 uppercase text-[11px] font-bold tracking-wider">
                    <th className="px-6 py-3">ID Commande</th>
                    <th className="px-6 py-3">Date</th>
                    <th className="px-6 py-3">Client</th>
                    <th className="px-6 py-3">Montant</th>
                    <th className="px-6 py-3">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900">#{order.id}</td>
                      <td className="px-6 py-4 text-gray-600">{formatDate(order.created_at)}</td>
                      <td className="px-6 py-4 text-gray-600">{order.client?.full_name || "Client"}</td>
                      <td className="px-6 py-4 font-semibold text-gray-900">{formatPrice(order.total_price)}</td>
                      <td className="px-6 py-4">{getStatusBadge(order.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-8 text-center text-gray-500">Aucune commande pour le moment</div>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
