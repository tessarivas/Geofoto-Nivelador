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
    backgroundColor: 'rgba(162,89,230,0.15)', // morado translúcido
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
  distanceText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#fff',
    backgroundColor: '#a259e6',
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  status: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
  },
  statusOk: {
    color: '#85ff89', // verde
  },
  statusError: {
    color: '#ff6ba6', // rosa
  },
});

export default GeofenceIndicator;