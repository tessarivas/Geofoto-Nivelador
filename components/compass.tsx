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
    backgroundColor: 'rgba(162,89,230,0.15)', 
    borderRadius: 20,
    padding: 16,
    shadowColor: '#a259e6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    fontStyle: 'italic',
    marginBottom: 10,
    color: '#e2b6ff',
  },
  compassCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 5,
    borderColor: '#e2b6ff',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    overflow: 'hidden',
    marginBottom: 8,
  },
  needle: {
    position: 'absolute',
    width: 4,
    height: 60,
    backgroundColor: '#ff6ba6', 
    borderRadius: 2,
    top: 20,
    left: 48,
    marginLeft: -2,
    marginTop: -10,
  },
  headingText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: '#a259e6',
    paddingHorizontal: 8,
    borderRadius: 8,
    marginTop: 4,
  },
  status: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusOk: {
    color: '#85ff89', 
  },
  statusError: {
    color: '#ff6ba6', 
  },
});

export default Compass;