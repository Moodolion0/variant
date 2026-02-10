let orders = [
  {
    id: "ord1",
    ref: "#ORD-8492",
    customer: "Jean Dupont",
    amount: 125.5,
    items: 2,
    status: "en_cours",
    date: "Aujourd'hui, 14:20",
  },
  {
    id: "ord2",
    ref: "#ORD-8491",
    customer: "Marie Klein",
    amount: 85.0,
    items: 1,
    status: "livree",
    date: "Hier, 18:30",
  },
  {
    id: "ord3",
    ref: "#ORD-8490",
    customer: "Paul Legrand",
    amount: 240.75,
    items: 3,
    status: "expediee",
    date: "Il y a 2 jours",
  },
];

export async function list(filter = "all") {
  return new Promise((resolve) =>
    setTimeout(() => {
      const filtered =
        filter === "all" ? orders : orders.filter((o) => o.status === filter);
      resolve([...filtered]);
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
