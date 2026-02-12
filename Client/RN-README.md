React Native (Expo) — notes de développement

Ce dépôt contient deux projets Expo:

- `Client/` — l'app client (déjà convertie partiellement depuis la maquette).
- `Client/admin/` — un projet minimal pour l'interface admin (scaffold).

Commandes utiles:

- Client (depuis `Client/`):
  - npm install
  - npm run web (ou `npx expo start --web --no-open` si l'ouverture du navigateur échoue)

- Admin (depuis `Client/admin`):
  - npm install
  - npm run web

Conseils:
- J'ai évité d'ajouter des dépendances natives (pas de modules à lier) pour que tu puisses tester facilement sur web.
- Si tu veux que je publie une PR automatique avec une description, dis-moi le titre et le contenu bref.