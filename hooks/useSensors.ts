// hooks/useSensors.ts
import { Accelerometer, Magnetometer } from 'expo-sensors';
import { useEffect, useState } from 'react';
import { calculateHeading, calculateTilt, isFacingNorth, SENSOR_INTERVAL_MS } from '../constants';

export const useSensors = () => {
  const [heading, setHeading] = useState<number>(0);
  const [isNorth, setIsNorth] = useState<boolean>(false);
  const [tilt, setTilt] = useState<number>(0);
  const [isLevel, setIsLevel] = useState<boolean>(false);
  const [levelStartTime, setLevelStartTime] = useState<number | null>(null);

  useEffect(() => {
    let magnetometerSubscription: any = null;
    let accelerometerSubscription: any = null;

    const setupSensors = async () => {
      Magnetometer.setUpdateInterval(SENSOR_INTERVAL_MS);
      magnetometerSubscription = Magnetometer.addListener((data) => {
        const newHeading = calculateHeading(data.x, data.y);
        setHeading(newHeading);
        setIsNorth(isFacingNorth(newHeading));
      });

      Accelerometer.setUpdateInterval(SENSOR_INTERVAL_MS);
      accelerometerSubscription = Accelerometer.addListener((data) => {
        const newTilt = calculateTilt(data.x, data.y, data.z);
        setTilt(newTilt);
        
        if (newTilt < 3) {
          const now = Date.now();
          if (levelStartTime === null) {
            setLevelStartTime(now);
          } else if (now - levelStartTime >= 2000) {
            setIsLevel(true);
          }
        } else {
          setLevelStartTime(null);
          setIsLevel(false);
        }
      });
    };

    setupSensors();

    return () => {
      magnetometerSubscription?.remove();
      accelerometerSubscription?.remove();
    };
  }, [levelStartTime]);

  return { heading, isNorth, tilt, isLevel };
};