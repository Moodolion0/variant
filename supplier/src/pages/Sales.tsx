import { useEffect, useState } from "react";
import { orderService } from "../services/api";

interface Order {
  id: number;
  created_at: string;
  client: {
    full_name: string;
  };
  total_price: number;
  status: string;
}

interface SalesData {
  date: string;
  sales: number;
}

interface SalesProps {
  token: string | null;
}

export default function Sales({ token }: SalesProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState("30days");

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      try {
        const data = await orderService.getSupplierOrders(token);
        setOrders(data.data || data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  const getFilteredOrders = (): Order[] => {
    const now = new Date();
    const filterDate = new Date();

    switch (timeFilter) {
      case "7days":
        filterDate.setDate(now.getDate() - 7);
        break;
      case "30days":
        filterDate.setDate(now.getDate() - 30);
        break;
      case "year":
        filterDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        filterDate.setDate(now.getDate() - 30);
    }

    return orders.filter(
      (order) => new Date(order.created_at) >= filterDate
    );
  };

  const calculateSalesData = (): SalesData[] => {
    const filteredOrders = getFilteredOrders();
    const salesByDate: Record<string, number> = {};

    filteredOrders.forEach((order) => {
      const date = new Date(order.created_at).toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "short",
      });
      salesByDate[date] = (salesByDate[date] || 0) + order.total_price;
    });

    return Object.entries(salesByDate)
      .map(([date, sales]) => ({ date, sales }))
      .slice(-7);
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

  const filteredOrders = getFilteredOrders();
  const salesData = calculateSalesData();
  const totalSales = filteredOrders.reduce((sum, order) => sum + order.total_price, 0);
  const maxSale = Math.max(...salesData.map((d) => d.sales), 1);

  return (
    <>
      {/* Top Header */}
      <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-10">
        <h1 className="text-lg font-semibold text-gray-800">Ventes</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">{filteredOrders.length} commandes</span>
        </div>
      </header>

      {/* Content */}
      <div className="p-8 space-y-8 max-w-7xl mx-auto w-full">
        {/* Summary Cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-sm font-medium text-gray-500 mb-1">Ventes totales</p>
            <h3 className="text-2xl font-bold text-gray-900">{formatPrice(totalSales)}</h3>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-sm font-medium text-gray-500 mb-1">Nombre de commandes</p>
            <h3 className="text-2xl font-bold text-gray-900">{filteredOrders.length}</h3>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-sm font-medium text-gray-500 mb-1">Panier moyen</p>
            <h3 className="text-2xl font-bold text-gray-900">
              {filteredOrders.length > 0
                ? formatPrice(totalSales / filteredOrders.length)
                : formatPrice(0)}
            </h3>
          </div>
        </section>

        {/* Chart Section */}
        <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Performance Financière</h2>
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2"
            >
              <option value="7days">7 derniers jours</option>
              <option value="30days">30 derniers jours</option>
              <option value="year">Cette année</option>
            </select>
          </div>

          {/* Bar Chart */}
          <div className="h-64 w-full flex items-end justify-between gap-4 px-2">
            {salesData.map((data, index) => (
              <div
                key={index}
                className="bg-indigo-100 w-full rounded-t-sm transition-all hover:bg-indigo-600 relative group"
                style={{ height: `${(data.sales / maxSale) * 100}%` }}
              >
                <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {formatPrice(data.sales)}
                </div>
              </div>
            ))}
          </div>

          {/* X-axis labels */}
          <div className="flex justify-between mt-4 text-xs text-gray-400 font-medium">
            {salesData.map((data, index) => (
              <span key={index}>{data.date}</span>
            ))}
          </div>
        </section>

        {/* Sales Table */}
        <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Historique des ventes</h2>
          </div>
          <div className="overflow-x-auto">
            {filteredOrders.length > 0 ? (
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
                  {filteredOrders.slice(0, 10).map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900">#{order.id}</td>
                      <td className="px-6 py-4 text-gray-600">
                        {new Date(order.created_at).toLocaleDateString("fr-FR", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4 text-gray-600">{order.client?.full_name || "Client"}</td>
                      <td className="px-6 py-4 font-semibold text-gray-900">{formatPrice(order.total_price)}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            order.status === "termine" || order.status === "livre"
                              ? "bg-green-100 text-green-800"
                              : order.status === "annule"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {order.status === "termine" || order.status === "livre"
                            ? "Terminé"
                            : order.status === "annule"
                            ? "Annulé"
                            : "En cours"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-8 text-center text-gray-500">Aucune vente pour cette période</div>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
