import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
// Importamos la instancia de auth desde nuestro archivo de configuración central
import { auth } from '../firebase/firebaseConfig';

const LoginScreen = () => { // Eliminamos la prop 'navigation'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      Alert.alert('Registro exitoso', 'Usuario registrado correctamente');
      // Aquí podrías navegar a la pantalla principal
    } catch (error) {
      Alert.alert('Error de registro', error.message);
      console.error('Error de registro:', error);
    }
  };

  const handleSignIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert('Inicio de sesión exitoso', 'Usuario ha iniciado sesión');
      // Aquí podrías navegar a la pantalla principal
    } catch (error) {
      Alert.alert('Error de inicio de sesión', error.message);
      console.error('Error de inicio de sesión:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Registrarse" onPress={handleSignUp} />
      <Button title="Iniciar Sesión" onPress={handleSignIn} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
});

export default LoginScreen;
