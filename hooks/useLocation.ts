// hooks/useLocation.ts
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { haversine, LOCATION_INTERVAL_MS, TARGET_LOCATION } from '../constants';

export const useLocation = () => {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [distance, setDistance] = useState<number>(0);
  const [isInGeofence, setIsInGeofence] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      // Solicitar permisos
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permiso de ubicación denegado');
        return;
      }

      // Obtener ubicación actual
      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
      
      // Calcular distancia inicial
      const dist = haversine(
        currentLocation.coords.latitude,
        currentLocation.coords.longitude,
        TARGET_LOCATION.latitude,
        TARGET_LOCATION.longitude
      );
      setDistance(dist);
      setIsInGeofence(dist <= 50);

      // Configurar actualizaciones de ubicación
      Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.BestForNavigation,
          timeInterval: LOCATION_INTERVAL_MS,
          distanceInterval: 1
        },
        (newLocation) => {
          setLocation(newLocation);
          const dist = haversine(
            newLocation.coords.latitude,
            newLocation.coords.longitude,
            TARGET_LOCATION.latitude,
            TARGET_LOCATION.longitude
          );
          setDistance(dist);
          setIsInGeofence(dist <= 50);
        }
      );
    })();
  }, []);

  return { location, errorMsg, distance, isInGeofence };
};