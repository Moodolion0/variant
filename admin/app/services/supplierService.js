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

export async function list() {
  return new Promise((resolve) =>
    setTimeout(() => resolve([...suppliers]), 200),
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

export async function getDetail(id) {
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve(suppliers.find((s) => s.id === id));
    }, 200),
  );
}

export default { list, create, getDetail };
