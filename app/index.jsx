import React from 'react';
import { Redirect } from 'expo-router';

export default function Index() {
  // Redirect to the client home by default
  return <Redirect href="/client" />;
}