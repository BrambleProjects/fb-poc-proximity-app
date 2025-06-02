import * as Location from 'expo-location';
import { geoCollection } from '../firebase/geo';
import { GeoPoint } from 'firebase/firestore';

const INTERVAL_MS = 60 * 1000;
const USER_ID = 'user_123';

export async function startLocationUpdates() {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    alert('Permiso para acceder a la ubicación denegado');
    return;
  }

  async function updateLocation() {
    try {
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      await geoCollection.doc(USER_ID).set({
        coordinates: new GeoPoint(latitude, longitude),
        timestamp: Date.now()
      });

      console.log('Ubicación actualizada:', latitude, longitude);

    } catch (error) {
      console.error('Error actualizando ubicación:', error);
    }
  }

  updateLocation();
  setInterval(updateLocation, INTERVAL_MS);
}
