// hooks/useLocation.ts
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { haversine, LOCATION_INTERVAL_MS } from '../constants';

export const useLocation = () => {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [targetLocation, setTargetLocation] = useState<{latitude: number, longitude: number} | null>(null);
  const [distance, setDistance] = useState<number>(0);
  const [isInGeofence, setIsInGeofence] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permiso de ubicación denegado');
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
      setTargetLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude
      });
      setDistance(0);
      setIsInGeofence(true);

      Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.BestForNavigation,
          timeInterval: LOCATION_INTERVAL_MS,
          distanceInterval: 1
        },
        (newLocation) => {
          setLocation(newLocation);
          if (targetLocation) {
            const dist = haversine(
              newLocation.coords.latitude,
              newLocation.coords.longitude,
              targetLocation.latitude,
              targetLocation.longitude
            );
            setDistance(dist);
            setIsInGeofence(dist <= 50);
          }
        }
      );
    })();
  }, []);

  return { location, errorMsg, distance, isInGeofence, targetLocation };
};