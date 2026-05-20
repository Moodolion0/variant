// Configuration pour le frontend Supplier
// Utilise les variables d'environnement de Vite avec le préfixe VITE_

export const config = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
};

export default config;
