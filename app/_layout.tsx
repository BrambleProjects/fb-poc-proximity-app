import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
// Import Firebase Auth related modules
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig'; // Adjust the path if necessary
import { View, Text } from 'react-native'; // For loading indicator
// Import React and hooks explicitly
import React, { useEffect, useState } from 'react';
// Import router
import { router } from 'expo-router';

import { useColorScheme } from '@/hooks/useColorScheme'; // Assuming this hook exists

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  // States for authentication and Firebase loading
  const [user, setUser] = useState<User | null>(null);
  // State to know if Firebase Auth asynchronous initialization has finished
  const [firebaseInitialized, setFirebaseInitialized] = useState(false);
  // State to know if the initial authentication state check is in progress
  const [loading, setLoading] = useState<boolean>(true);

  // Effect to listen for auth state changes and wait for Firebase initialization
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setFirebaseInitialized(true); // Mark Firebase Auth as initialized after the first listener trigger
      setLoading(false); // The initial authentication check has finished
    });

    // Clean up the listener on unmount
    return () => unsubscribe();
  }, []); // Run only once on mount

  // Effect to redirect once Firebase Auth is initialized and the state is known
  useEffect(() => {
    // Only redirect if Firebase is initialized AND the initial check has finished
    if (firebaseInitialized && !loading) {
      if (user) {
        // If there is a user, redirect to the main authenticated routes (e.g., the tabs)
        router.replace('/(tabs)'); // Ensure this path matches your tabs group
      } else { // If there is no user (not authenticated), redirect to the login route
        // If there is no user, redirect to the login route
        router.replace('/login'); // Ensure you have an app/login.tsx file for this route
      }
    }
  }, [user, firebaseInitialized, loading]); // Dependencies: user, firebaseInitialized, loading

  // Show loading indicator while Firebase is initializing or checking auth state, and while fonts are loading
  // Also wait for fonts to load if necessary
  if (loading || !firebaseInitialized || !loaded) {
 return (
       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
         <Text>Loading application...</Text>
       </View>
    );
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      {/* If Firebase is initialized and the state is known, and fonts loaded, render the Stack */}
      <Stack>
        {/* Define the possible routes in the Stack.
 The redirection in useEffect controls which one is initially navigated to.
 HeaderShown: false is commonly used in layouts to avoid duplicate headers if nested routes already have one.
        */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} /> {/* Declare the login route here */}
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}