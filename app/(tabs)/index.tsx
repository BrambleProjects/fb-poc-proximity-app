import React from 'react';

import HomeScreen from '../../screens/HomeScreen'; // Import your HomeScreen

export default function Index() {
  // Simply render the HomeScreen. Authentication logic will be handled in _layout.tsx.
  return <HomeScreen />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
