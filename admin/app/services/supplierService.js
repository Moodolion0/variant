const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api";

let suppliers = [
  {
    id: "s1",
    name: "TechDistri Corp",
    email: "contact@techdistri.fr",
    phone: "+33 1 23 45 67 89",
    location: "Paris, France",
  },
  {
    id: "s2",
    name: "Global Parts Inc",
    email: "sales@globalparts.com",
    phone: "+33 6 12 34 56 78",
    location: "Lyon, France",
  },
  {
    id: "s3",
    name: "Euro Electronics",
    email: "info@euroelec.eu",
    phone: "+33 4 56 78 90 12",
    location: "Marseille, France",
  },
];

// Mock products for suppliers' associated products lists
const supplierProducts = {
  s1: [{ id: "p1", name: "iPhone 15 Pro Max", ref: "IP15-PM", price: 1299.0 }],
  s2: [{ id: "p2", name: "MacBook Pro M3", ref: "MB-M3-14", price: 2499.0 }],
  s3: [{ id: "p3", name: "AirPods Max", ref: "AP-MAX-S", price: 549.0 }],
};

export async function list() {
  try {
    const response = await fetch(`${API_BASE_URL}/suppliers`);
    if (!response.ok) throw new Error("Erreur API");
    return await response.json();
  } catch (error) {
    console.warn("Utilisation des données mock pour list:", error);
    return new Promise((resolve) =>
      setTimeout(() => resolve([...suppliers]), 200),
    );
  }
}

export async function getDetail(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/suppliers/${id}`);
    if (!response.ok) throw new Error("Erreur API");
    const data = await response.json();
    return {
      ...data,
      stat: {
        products: 3,
        orders: Math.floor(Math.random() * 150) + 30,
        growth: Math.floor(Math.random() * 35) + 8,
      },
      associatedProducts: supplierProducts[id] || [],
    };
  } catch (error) {
    console.warn("Utilisation des données mock pour getDetail:", error);
    return new Promise((resolve) =>
      setTimeout(() => {
        const supplier = suppliers.find((s) => s.id === id);
        if (!supplier) {
          resolve(null);
          return;
        }
        const enriched = {
          ...supplier,
          contactPerson:
            id === "s1"
              ? "Jean Dupont"
              : id === "s2"
                ? "Marie Martin"
                : "Pierre Moreau",
          coordinates: {
            lat: 48.8566,
            lng: 2.3522,
          },
          stat: {
            products: supplierProducts[id]?.length || 0,
            orders: Math.floor(Math.random() * 150) + 30,
            growth: Math.floor(Math.random() * 35) + 8,
          },
          associatedProducts: supplierProducts[id] || [],
        };
        resolve(enriched);
      }, 250),
    );
  }
}

export async function create(data) {
  try {
    const response = await fetch(`${API_BASE_URL}/suppliers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Erreur lors de la création");
    }
    return await response.json();
  } catch (error) {
    console.warn("Création en mode mock:", error);
    return new Promise((resolve) => {
      setTimeout(() => {
        const item = { id: "s" + Date.now(), ...data };
        suppliers = [item, ...suppliers];
        resolve(item);
      }, 300);
    });
  }
}

export async function update(id, data) {
  try {
    const response = await fetch(`${API_BASE_URL}/suppliers/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Erreur API");
    return await response.json();
  } catch (error) {
    console.warn("Mise à jour en mode mock:", error);
    return data;
  }
}

export async function remove(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/suppliers/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Erreur API");
    return true;
  } catch (error) {
    console.warn("Suppression en mode mock:", error);
    return true;
  }
}

export default { list, create, update, remove, getDetail };
