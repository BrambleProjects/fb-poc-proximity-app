import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { app } from '../../firebase/firebaseConfig';

import HomeScreen from '../../screens/HomeScreen'; // Import your HomeScreen
import LoginScreen from '../../screens/LoginScreen'; // Import your LoginScreen

const auth = getAuth(app);

export default function Index() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  console.log('Index component rendering. Loading:', loading, 'User:', user ? 'Authenticated' : 'Not Authenticated'); // Log al renderizar

  useEffect(() => {
    console.log('useEffect in Index component running'); // Log al entrar en useEffect

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('onAuthStateChanged listener triggered. User:', user ? 'Authenticated' : 'Not Authenticated'); // Log cuando el listener se activa
      setUser(user);
      setLoading(false);
      console.log('Loading state set to false'); // Log después de setLoading(false)
    });

    console.log('onAuthStateChanged listener set up'); // Log después de configurar el listener

    return () => {
      console.log('Cleaning up onAuthStateChanged listener'); // Log al limpiar el listener
      unsubscribe();
    };
  }, []);

  if (loading) {
    console.log('Rendering Loading...'); // Log al renderizar el estado de carga
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  console.log('Rendering main content (Login or Home)'); // Log al renderizar Login/Home
  return (
    <View style={styles.container}>
      {user ? <HomeScreen /> : <LoginScreen />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});