let users = [
  { id: 'u1', name: 'Ahmed Ali', email: 'ahmed@example.com', type: 'buyer', status: 'active', avatar: 'AA' },
  { id: 'u2', name: 'Sophie Martin', email: 'sophie@example.com', type: 'buyer', status: 'active', avatar: 'SM' },
  { id: 'u3', name: 'Karim Bouab', email: 'karim@example.com', type: 'delivery', status: 'active', avatar: 'KB' },
  { id: 'u4', name: 'Lara Durand', email: 'lara@example.com', type: 'delivery', status: 'suspended', avatar: 'LD' }
];

export async function list(type = 'buyer'){
  return new Promise(resolve => setTimeout(() => {
    const filtered = users.filter(u => u.type === type);
    resolve([...filtered]);
  }, 200));
}

export async function getDetail(id){
  return new Promise(resolve => setTimeout(() => {
    resolve(users.find(u => u.id === id));
  }, 200));
}

export default { list, getDetail };
