import { useEffect, useState } from "react";
import { supplierService } from "../services/api";

interface Product {
  id: number;
  name_supplier: string;
  description_supplier: string;
  price_supplier: number;
  stock_quantity: number;
  properties?: Record<string, Record<string, number>> | null;
  images?: Array<{ url: string }>;
}

interface StockProps {
  token: string | null;
}

interface PropertyConfig {
  name: string;
  values: string[];
}

const AVAILABLE_PROPERTIES: PropertyConfig[] = [
  { name: "size", values: ["XS", "S", "M", "L", "XL", "XXL"] },
  { name: "color", values: ["Red", "Blue", "Green", "Black", "White", "Yellow"] },
  { name: "pointure", values: ["35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45"] },
];

export default function Stock({ token }: StockProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editStock, setEditStock] = useState<number>(0);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name_supplier: "",
    description_supplier: "",
    price_supplier: 0,
    stock_quantity: 0,
  });
  const [selectedProperties, setSelectedProperties] = useState<string[]>([]);
  const [propertyValues, setPropertyValues] = useState<Record<string, Record<string, number>>>({});

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchProducts = async () => {
      try {
        const data = await supplierService.getProducts(token);
        setProducts(data.data || data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [token]);

  const handleUpdateStock = async (productId: number) => {
    if (!token) return;

    try {
      await supplierService.updateStock(token, productId, editStock);
      setProducts(products.map(p => 
        p.id === productId ? { ...p, stock_quantity: editStock } : p
      ));
      setEditingId(null);
    } catch (error) {
      console.error("Error updating stock:", error);
      alert("Erreur lors de la mise à jour du stock");
    }
  };

  const handleCreateProduct = async () => {
    if (!token) {
      alert("Token manquant. Veuillez vous reconnecter.");
      return;
    }

    console.log("Creating product with token:", token);

    // Validation
    if (!newProduct.name_supplier || !newProduct.price_supplier || !newProduct.stock_quantity) {
      alert("Veuillez remplir tous les champs obligatoires");
      return;
    }

    // If properties are selected, validate stock distribution
    let properties = null;
    if (selectedProperties.length > 0) {
      properties = {};
      let totalDistributed = 0;

      for (const prop of selectedProperties) {
        const values = propertyValues[prop] || {};
        const propTotal = Object.values(values).reduce((a, b) => a + b, 0);
        
        if (propTotal === 0) {
          alert(`Veuillez définir au moins une quantité pour ${prop}`);
          return;
        }
        
        totalDistributed = propTotal;
        properties[prop] = values;
      }

      if (totalDistributed !== newProduct.stock_quantity) {
        alert(`La somme des quantités (${totalDistributed}) doit égaler le stock total (${newProduct.stock_quantity})`);
        return;
      }
    }

    try {
      const created = await supplierService.createProduct(token, {
        ...newProduct,
        properties,
      });
      setProducts([...products, created]);
      setShowAddForm(false);
      setNewProduct({
        name_supplier: "",
        description_supplier: "",
        price_supplier: 0,
        stock_quantity: 0,
      });
      setSelectedProperties([]);
      setPropertyValues({});
    } catch (error) {
      console.error("Error creating product:", error);
      alert("Erreur lors de la création du produit");
    }
  };

  const handleDeleteProduct = async (productId: number) => {
    if (!token) return;
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce produit?")) return;

    try {
      await supplierService.deleteProduct(token, productId);
      setProducts(products.filter(p => p.id !== productId));
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Erreur lors de la suppression du produit");
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XOF",
    }).format(price);
  };

  const toggleProperty = (propName: string) => {
    if (selectedProperties.includes(propName)) {
      setSelectedProperties(selectedProperties.filter(p => p !== propName));
      const newValues = { ...propertyValues };
      delete newValues[propName];
      setPropertyValues(newValues);
    } else {
      setSelectedProperties([...selectedProperties, propName]);
      const config = AVAILABLE_PROPERTIES.find(p => p.name === propName);
      if (config) {
        setPropertyValues({
          ...propertyValues,
          [propName]: config.values.reduce((acc, val) => ({ ...acc, [val]: 0 }), {}),
        });
      }
    }
  };

  const updatePropertyValue = (propName: string, value: string, quantity: number) => {
    setPropertyValues({
      ...propertyValues,
      [propName]: {
        ...propertyValues[propName],
        [value]: quantity,
      },
    });
  };

  const getTotalPropertyQuantity = (propName: string) => {
    return Object.values(propertyValues[propName] || {}).reduce((a, b) => a + b, 0);
  };

  const getStockBadge = (quantity: number) => {
    if (quantity === 0) {
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Rupture</span>;
    }
    if (quantity < 10) {
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Faible</span>;
    }
    return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">En stock</span>;
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
        <h1 className="text-lg font-semibold text-gray-800">Gestion du Stock</h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
        >
          + Ajouter un produit
        </button>
      </header>

      {/* Content */}
      <div className="p-8 max-w-7xl mx-auto w-full">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {products.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 uppercase text-[11px] font-bold tracking-wider">
                    <th className="px-6 py-3">Produit</th>
                    <th className="px-6 py-3">Prix</th>
                    <th className="px-6 py-3">Stock</th>
                    <th className="px-6 py-3">Statut</th>
                    <th className="px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{product.name_supplier}</p>
                          <p className="text-gray-500 text-xs">{product.description_supplier}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-900">
                        {formatPrice(product.price_supplier)}
                      </td>
                      <td className="px-6 py-4">
                        {editingId === product.id ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              min="0"
                              value={editStock}
                              onChange={(e) => setEditStock(parseInt(e.target.value) || 0)}
                              className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                            />
                            <button
                              onClick={() => handleUpdateStock(product.id)}
                              className="text-green-600 hover:text-green-800"
                            >
                              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                              </svg>
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        ) : (
                          <span className="text-gray-900">{product.stock_quantity}</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {getStockBadge(product.stock_quantity)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setEditingId(product.id);
                              setEditStock(product.stock_quantity);
                            }}
                            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                          >
                            Modifier
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="text-red-600 hover:text-red-800 text-sm font-medium"
                          >
                            Supprimer
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              Aucun produit. Ajoutez votre premier produit!
            </div>
          )}
        </div>
      </div>

      {/* Add Product Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[95vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
              <h2 className="text-lg font-semibold text-gray-900">Ajouter un produit</h2>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setSelectedProperties([]);
                  setPropertyValues({});
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="px-6 py-4 space-y-4">
              {/* Informations de base */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom du produit *</label>
                <input
                  type="text"
                  value={newProduct.name_supplier}
                  onChange={(e) => setNewProduct({ ...newProduct, name_supplier: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newProduct.description_supplier}
                  onChange={(e) => setNewProduct({ ...newProduct, description_supplier: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prix (XOF) *</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={newProduct.price_supplier}
                    onChange={(e) => setNewProduct({ ...newProduct, price_supplier: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock total *</label>
                  <input
                    type="number"
                    min="0"
                    value={newProduct.stock_quantity}
                    onChange={(e) => setNewProduct({ ...newProduct, stock_quantity: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Propriétés */}
              {newProduct.stock_quantity > 0 && (
                <div className="border-t pt-4">
                  <p className="text-sm font-medium text-gray-700 mb-3">Propriétés optionnelles</p>
                  <div className="space-y-3">
                    {AVAILABLE_PROPERTIES.map((prop) => (
                      <label key={prop.name} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedProperties.includes(prop.name)}
                          onChange={() => toggleProperty(prop.name)}
                          className="w-4 h-4 rounded border-gray-300 text-indigo-600"
                        />
                        <span className="text-sm text-gray-700 capitalize">{prop.name}</span>
                      </label>
                    ))}
                  </div>

                  {/* Affichage des valeurs de propriétés */}
                  {selectedProperties.length > 0 && (
                    <div className="mt-4 space-y-3 border-t pt-4">
                      {selectedProperties.map((propName) => {
                        const config = AVAILABLE_PROPERTIES.find(p => p.name === propName);
                        return (
                          <div key={propName}>
                            <div className="flex items-center justify-between mb-2">
                              <label className="text-sm font-medium text-gray-700 capitalize">{propName}</label>
                              <span className="text-xs text-gray-500">
                                {getTotalPropertyQuantity(propName)} / {newProduct.stock_quantity}
                              </span>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              {config?.values.map((value) => (
                                <div key={`${propName}-${value}`} className="flex items-center gap-1">
                                  <label className="text-xs text-gray-600 capitalize w-16">{value}:</label>
                                  <input
                                    type="number"
                                    min="0"
                                    value={propertyValues[propName]?.[value] || 0}
                                    onChange={(e) =>
                                      updatePropertyValue(propName, value, parseInt(e.target.value) || 0)
                                    }
                                    className="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              <button
                onClick={handleCreateProduct}
                className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
              >
                Créer le produit
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
