// components/Compass.tsx
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface CompassProps {
  heading: number;
  isNorth: boolean;
}

const Compass: React.FC<CompassProps> = ({ heading, isNorth }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Brújula</Text>
      <View style={styles.compassCircle}>
        <View style={[styles.needle, { transform: [{ rotate: `${heading}deg` }] }]} />
        <Text style={styles.headingText}>{Math.round(heading)}°</Text>
      </View>
      <Text style={[styles.status, isNorth ? styles.statusOk : styles.statusError]}>
        {isNorth ? 'Apuntando al Norte ✓' : 'No apunta al Norte ✗'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  compassCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
  },
  needle: {
    position: 'absolute',
    width: 2,
    height: 50,
    backgroundColor: 'red',
  },
  headingText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  status: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusOk: {
    color: 'green',
  },
  statusError: {
    color: 'red',
  },
});

export default Compass;