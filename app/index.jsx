import { Redirect } from 'expo-router';

export default function Index() {
  // The client UI is inside a grouped folder; point the root to '/'
  return <Redirect href="/" />;
}