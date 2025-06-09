import React from "react";

import { AuthProvider, useAuth } from "../../Context/AuthContext";
import GuestStack from "../../Navigation/GuestStack";
import AppStack from "../../Navigation/AppStack";


const AppContent = () => {
  const { loggedInUser } = useAuth();
  if (loggedInUser){
    return <AppStack />
  }
  return <GuestStack />
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}