Notes pour le projet Client

- Pour lancer le client (web):
  1. cd Client
  2. npm install
  3. npm run web

- Si `expo start --web` échoue avec des erreurs `spawn`, essaie:
  - `npx expo start --web --no-open`
  - ou `set EXPO_NO_OPEN=true` puis `npm run web` (Windows)

- Projet admin minimal: `Client/admin` (cd dedans, `npm install`, `npm run web`).