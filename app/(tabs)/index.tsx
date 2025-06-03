import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router'; // Importar router para redireccionar
// Importar la instancia de auth y el listener
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig'; // Importar la instancia de auth (ajusta la ruta si es necesario)


import LoginScreen from '../screens/LoginScreen'; // Importar la pantalla de Login (ajusta la ruta)
import HomeScreen from '../../screens/HomeScreen'; // Importar la pantalla principal (ajusta la ruta)

export default function Index() {
  // Estado para el usuario autenticado (o null si no hay)
  const [user, setUser] = useState<User | null>(null);
  // Estado para saber si la verificación inicial está en curso
  const [loading, setLoading] = useState<boolean>(true); // Inicialmente estamos cargando

  // Efecto para escuchar cambios en el estado de autenticación al montar el componente
  // Este listener también nos sirve como señal de que Firebase Auth ha terminado su inicialización asíncrona.
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user); // Actualizar estado del usuario
      setLoading(false); // La verificación inicial de autenticación ha terminado
    });

    // Limpiar el listener al desmontar el componente
    return () => unsubscribe();
  }, []); // El array vacío [] asegura que este efecto se ejecute solo una vez al montar.

  // Efecto para redirigir basado en el estado de autenticación una vez que 'loading' sea false
  useEffect(() => {
    if (!loading) { // Solo redirigir después de que la verificación inicial haya terminado
      if (!user) { // Si no hay usuario, redirigir al login
        // Usamos router.replace para ir a la ruta de login
        // **Asegúrate de que tienes un archivo app/login.tsx que sea la ruta '/login'**
        router.replace('/login');
      }
      // Si hay un usuario, no hacemos nada aquí; el Stack en _layout ya renderiza (tabs)
    }
  }, [user, loading]); // Este efecto se ejecuta cuando 'user' o 'loading' cambian

  // Mostrar un indicador de carga mientras se verifica el estado inicial de autenticación
  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Cargando estado de autenticación...</Text>
      </View>
    );
  }

  // Si no estamos cargando y hay un usuario, renderizar la HomeScreen (el contenido de esta ruta)
  // Si no hay usuario, la redirección a '/login' en el useEffect anterior se encargará.
  return <HomeScreen />;
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
