import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import { saveUserLocation } from '../firebase/geo';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { useAuth } from "../Context/AuthContext"; // <--- Importa tu contexto

export default function HomeScreen() {
  const [location, setLocation] = useState(null);
  const [usersNearby, setUsersNearby] = useState([]);
  const { loggedInUser } = useAuth(); // <--- Obtén el usuario autenticado

  useEffect(() => {
    let interval;

    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permiso de ubicación denegado');
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation.coords);

      // Guarda la ubicación si el usuario está autenticado
      if (loggedInUser) {
        try {
          await saveUserLocation(loggedInUser.email, currentLocation.coords);
          console.log('Ubicación inicial guardada para', loggedInUser.email);
        } catch (e) {
          console.error('Error guardando ubicación inicial:', e);
        }
      }

      interval = setInterval(async () => {
        try {
          const newLocation = await Location.getCurrentPositionAsync({});
          setLocation(newLocation.coords);

          if (loggedInUser) {
            await saveUserLocation(loggedInUser.email, newLocation.coords);
            console.log('Ubicación actualizada para', loggedInUser.email);
          }

          const snapshot = await getDocs(collection(db, 'locations'));
          const users = snapshot.docs.map(doc => doc.data());
          setUsersNearby(users);
        } catch (e) {
          console.error('Error en el intervalo de ubicación:', e);
        }
      }, 60000);
    })();

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [loggedInUser]);

  return (
    <View style={styles.container}>
      {location ? (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05
          }}
          showsUserLocation={true}
        >
          {usersNearby.map((user, index) => (
            <Marker
              key={index}
              coordinate={{
                latitude: user.latitude,
                longitude: user.longitude
              }}
              title={`Usuario ${index + 1}`}
            />
          ))}
        </MapView>
      ) : (
        <Text style={styles.loadingText}>Cargando ubicación...</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  map: {
    flex: 1
  },
  loadingText: {
    marginTop: 50,
    textAlign: 'center'
  }
});
