// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// Importamos getAuth para obtener la instancia de autenticación
import { getReactNativePersistence, initializeAuth, getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; 
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBIjXavdxSTSjX9gKGNUiYKL6IaR0yKvnk",
  authDomain: "pocubicacion-5752e.firebaseapp.com",
  projectId: "pocubicacion-5752e",
  storageBucket: "pocubicacion-5752e.firebasestorage.app",
  messagingSenderId: "806413473076",
  appId: "1:806413473076:web:3b6c3b2875c7a017598161",
  measurementId: "G-BE84X41SZZ"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
// Obtenemos la instancia de autenticación y la exportamos usando initializeAuth con persistencia
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

const analytics = getAnalytics(app);