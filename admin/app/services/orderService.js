let orders = [
  {
    id: "ord1",
    ref: "#ORD-8829",
    customer: {
      name: "Jean Dupont",
      address: "123 Rue de la Paix, 75002 Paris",
      phone: "+33 6 12 34 56 78",
    },
    items: [
      {
        name: "iPhone 15 Pro",
        supplier: "Apple Store",
        quantity: 1,
        price: 1200,
        total: 1200,
      },
      {
        name: "Coque MagSafe",
        supplier: "AccesLog",
        quantity: 2,
        price: 45,
        total: 90,
      },
    ],
    subtotal: 1290,
    shippingFee: 9.9,
    total: 1299.9,
    delivery: {
      name: "Marc L.",
      distance: 4.2,
    },
    status: "en_cours",
    date: "Aujourd'hui, 14:20",
  },
  {
    id: "ord2",
    ref: "#ORD-8491",
    customer: {
      name: "Marie Klein",
      address: "456 Avenue des Champs, 75008 Paris",
      phone: "+33 7 23 45 67 89",
    },
    items: [
      {
        name: "MacBook Pro M3",
        supplier: "Apple",
        quantity: 1,
        price: 2499,
        total: 2499,
      },
    ],
    subtotal: 2499,
    shippingFee: 15,
    total: 2514,
    delivery: {
      name: "Sophie M.",
      distance: 5.8,
    },
    status: "livree",
    date: "Hier, 18:30",
  },
  {
    id: "ord3",
    ref: "#ORD-8490",
    customer: {
      name: "Paul Legrand",
      address: "789 Rue Monteau, 75017 Paris",
      phone: "+33 6 98 76 54 32",
    },
    items: [
      {
        name: "iPad Air",
        supplier: "Apple Store",
        quantity: 1,
        price: 799,
        total: 799,
      },
      {
        name: "Apple Pencil",
        supplier: "AccesLog",
        quantity: 1,
        price: 129,
        total: 129,
      },
      {
        name: "Smart Keyboard",
        supplier: "AccesLog",
        quantity: 1,
        price: 349,
        total: 349,
      },
    ],
    subtotal: 1277,
    shippingFee: 12.5,
    total: 1289.5,
    delivery: {
      name: "Thomas D.",
      distance: 3.1,
    },
    status: "expediee",
    date: "Il y a 2 jours",
  },
];

export async function list(filter = "all") {
  return new Promise((resolve) =>
    setTimeout(() => {
      const filtered =
        filter === "all" ? orders : orders.filter((o) => o.status === filter);
      // Transform for list view
      const listData = filtered.map((o) => ({
        id: o.id,
        ref: o.ref,
        customer: o.customer.name,
        amount: o.total,
        items: o.items.length,
        status: o.status,
        date: o.date,
      }));
      resolve([...listData]);
    }, 200),
  );
}

export async function getDetail(id) {
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve(orders.find((o) => o.id === id));
    }, 200),
  );
}

export default { list, getDetail };
