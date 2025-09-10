// components/GeofenceIndicator.tsx
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface GeofenceIndicatorProps {
  distance: number;
  isInGeofence: boolean;
}

const GeofenceIndicator: React.FC<GeofenceIndicatorProps> = ({ distance, isInGeofence }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Geocerca</Text>
      <Text style={styles.distanceText}>{distance.toFixed(1)} m</Text>
      <Text style={[styles.status, isInGeofence ? styles.statusOk : styles.statusError]}>
        {isInGeofence ? 'Dentro de la geocerca ✓' : 'Fuera de la geocerca ✗'}
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
  distanceText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  status: {
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

export default GeofenceIndicator;