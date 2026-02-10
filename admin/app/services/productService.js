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
  },
  {
    id: "p2",
    name: "MacBook Pro M3",
    price: 2499.0,
    stock: 3,
    ref: "MB-M3-14",
    image: null,
    supplier: "Fournisseur B",
  },
  {
    id: "p3",
    name: "AirPods Max",
    price: 549.0,
    stock: 0,
    ref: "AP-MAX-S",
    image: null,
    supplier: "Fournisseur C",
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

export default { list, create, update, remove };
