// screens/HomeScreen.js
import * as Location from 'expo-location';
import { collection, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { db } from '../../firebase/firebaseConfig';
import { saveUserLocation } from '../firebase/geo';

export default function HomeScreen() {
  const [location, setLocation] = useState(null);
  const [usersNearby, setUsersNearby] = useState([]);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permiso de ubicación denegado');
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation.coords);
      console.log('guardando ubicacion')
      saveUserLocation('user_123', currentLocation.coords);

      const interval = setInterval(async () => {
        const newLocation = await Location.getCurrentPositionAsync({});
        setLocation(newLocation.coords);
        console.log('Actualizando ubicación:', newLocation.coords);
        await saveUserLocation('user_456', newLocation.coords);

        const snapshot = await getDocs(collection(db, 'locations'));
        const users = snapshot.docs.map(doc => doc.data());
        setUsersNearby(users);
        console.log('Usuarios cercanos cargados:', users.length);
        }, 60000);

      return () => clearInterval(interval);
    })();
  }, []);

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
