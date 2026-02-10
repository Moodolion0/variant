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
  return new Promise((resolve) =>
    setTimeout(() => resolve([...suppliers]), 200),
  );
}

export async function getDetail(id) {
  return new Promise((resolve) =>
    setTimeout(() => {
      const supplier = suppliers.find((s) => s.id === id);
      if (!supplier) {
        resolve(null);
        return;
      }
      // Enrich with detail data
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
          lng: 2.3522, // Paris by default; would vary by location
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

export async function create(data) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const item = { id: "s" + Date.now(), ...data };
      suppliers = [item, ...suppliers];
      resolve(item);
    }, 300);
  });
}

export default { list, create, getDetail };
