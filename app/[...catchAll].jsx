import ClientHome from './(client)/index';

export default function CatchAll() {
  // Fallback to client home for any unmatched route (dev convenience)
  return <ClientHome />;
}
