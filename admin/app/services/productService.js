// Simple in-memory product service to keep admin UI modular and testable.
let products = [
  {
    id: "p1",
    name: "iPhone 15 Pro Max",
    price: 1299.0,
    stock: 15,
    ref: "IP15-PM",
    image: null,
    supplier: "Fournisseur A",
    supplierId: "s1",
  },
  {
    id: "p2",
    name: "MacBook Pro M3",
    price: 2499.0,
    stock: 3,
    ref: "MB-M3-14",
    image: null,
    supplier: "Fournisseur B",
    supplierId: "s2",
  },
  {
    id: "p3",
    name: "AirPods Max",
    price: 549.0,
    stock: 0,
    ref: "AP-MAX-S",
    image: null,
    supplier: "Fournisseur C",
    supplierId: "s3",
  },
];

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export async function list() {
  return new Promise((resolve) =>
    setTimeout(() => resolve([...products]), 200),
  );
}

export async function getDetail(id) {
  return new Promise((resolve) =>
    setTimeout(() => {
      const product = products.find((p) => p.id === id);
      if (!product) {
        resolve(null);
        return;
      }
      // Enrich with detail data
      const enriched = {
        ...product,
        description:
          "Produit de haute qualité avec spécifications complètes et garantie fabricant. Livraison rapide et support client dédié.",
        images: [],
        restockDays: 5,
        supplierDetails: {
          name:
            product.supplierId === "s1"
              ? "Jean Dupont"
              : product.supplierId === "s2"
                ? "Marie Martin"
                : "Pierre Moreau",
          email:
            product.supplierId === "s1"
              ? "jean@techdistri.fr"
              : product.supplierId === "s2"
                ? "marie@globalparts.com"
                : "pierre@euroelec.eu",
          phone:
            product.supplierId === "s1"
              ? "+33 1 23 45 67 89"
              : product.supplierId === "s2"
                ? "+33 6 12 34 56 78"
                : "+33 4 56 78 90 12",
        },
        stats: {
          orders: Math.floor(Math.random() * 100) + 20,
          revenue: Math.floor(Math.random() * 50000) + 10000,
          growth: Math.floor(Math.random() * 40) + 5,
        },
      };
      resolve(enriched);
    }, 250),
  );
}

export async function create(data) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const item = { id: uid(), ...data };
      products = [item, ...products];
      resolve(item);
    }, 300);
  });
}

export async function update(id, patch) {
  return new Promise((resolve) => {
    setTimeout(() => {
      products = products.map((p) => (p.id === id ? { ...p, ...patch } : p));
      resolve(products.find((p) => p.id === id));
    }, 200);
  });
}

export async function remove(id) {
  return new Promise((resolve) =>
    setTimeout(() => {
      products = products.filter((p) => p.id !== id);
      resolve(true);
    }, 200),
  );
}

export default { list, create, getDetail, update, remove };
