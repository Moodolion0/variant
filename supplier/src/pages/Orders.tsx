import { useEffect, useState } from "react";
import { orderService } from "../services/api";

interface Order {
  id: number;
  created_at: string;
  client: {
    full_name: string;
    phone_number?: string;
  };
  total_price: number;
  delivery_fee: number;
  status: string;
  items?: Array<{
    id: number;
    product_name: string;
    quantity: number;
    price: number;
  }>;
}

interface OrdersProps {
  token: string | null;
}

export default function Orders({ token }: OrdersProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

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
      hour: "2-digit",
      minute: "2-digit",
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
        <h1 className="text-lg font-semibold text-gray-800">Commandes</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">{orders.length} commandes</span>
        </div>
      </header>

      {/* Content */}
      <div className="p-8 max-w-7xl mx-auto w-full">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {orders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 uppercase text-[11px] font-bold tracking-wider">
                    <th className="px-6 py-3">ID</th>
                    <th className="px-6 py-3">Date</th>
                    <th className="px-6 py-3">Client</th>
                    <th className="px-6 py-3">Total</th>
                    <th className="px-6 py-3">Statut</th>
                    <th className="px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900">#{order.id}</td>
                      <td className="px-6 py-4 text-gray-600">{formatDate(order.created_at)}</td>
                      <td className="px-6 py-4 text-gray-600">{order.client?.full_name || "Client"}</td>
                      <td className="px-6 py-4 font-semibold text-gray-900">{formatPrice(order.total_price)}</td>
                      <td className="px-6 py-4">{getStatusBadge(order.status)}</td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="text-indigo-600 hover:text-indigo-800 font-medium"
                        >
                          Détails
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">Aucune commande trouvée</div>
          )}
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Détails de la commande #{selectedOrder.id}</h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div>
                <p className="text-sm text-gray-500">Client</p>
                <p className="font-medium text-gray-900">{selectedOrder.client?.full_name}</p>
                {selectedOrder.client?.phone_number && (
                  <p className="text-sm text-gray-600">{selectedOrder.client.phone_number}</p>
                )}
              </div>
              <div>
                <p className="text-sm text-gray-500">Statut</p>
                {getStatusBadge(selectedOrder.status)}
              </div>
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-medium text-gray-900">{formatDate(selectedOrder.created_at)}</p>
              </div>
              <div className="border-t border-gray-200 pt-4">
                <p className="text-sm text-gray-500 mb-2">Articles</p>
                {selectedOrder.items && selectedOrder.items.length > 0 ? (
                  <div className="space-y-2">
                    {selectedOrder.items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          {item.product_name} x{item.quantity}
                        </span>
                        <span className="font-medium">{formatPrice(item.price)}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">Aucun article</p>
                )}
              </div>
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Sous-total</span>
                  <span className="font-medium">{formatPrice(selectedOrder.total_price - selectedOrder.delivery_fee)}</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-gray-600">Livraison</span>
                  <span className="font-medium">{formatPrice(selectedOrder.delivery_fee)}</span>
                </div>
                <div className="flex justify-between font-semibold text-gray-900 mt-2 pt-2 border-t border-gray-200">
                  <span>Total</span>
                  <span>{formatPrice(selectedOrder.total_price)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
