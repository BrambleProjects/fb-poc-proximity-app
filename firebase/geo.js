import { db } from './firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';

export async function saveUserLocation(userId, coords) {
  console.log('funcion geo');
  const locationRef = doc(db, 'locations', userId);  // <-- referencia directa
  try {
    await setDoc(locationRef, {
      latitude: coords.latitude,
      longitude: coords.longitude,
      timestamp: Date.now(),
    });
    console.log('Ubicación guardada correctamente');
  } catch (error) {
    console.error('Error al guardar ubicación:', error);
  }
}
