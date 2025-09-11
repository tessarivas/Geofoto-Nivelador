export const GEOFENCE_RADIUS_M = 50;
export const HEADING_TOLERANCE_DEG = 15;
export const TILT_THRESHOLD_DEG = 3;
export const TILT_HOLD_MS = 2000;
export const LOCATION_INTERVAL_MS = 1000;
export const SENSOR_INTERVAL_MS = 150;

export const TARGET_LOCATION = {
  latitude: 40.7128,  
  longitude: -74.0060 
};

export const haversine = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371000; 
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
            
  return 2 * R * Math.asin(Math.sqrt(a));
};

export const calculateHeading = (x: number, y: number): number => {
  let heading = Math.atan2(y, x) * (180 / Math.PI);
  heading = (heading + 360) % 360;
  return heading;
};

export const isFacingNorth = (heading: number): boolean => {
  return (heading <= HEADING_TOLERANCE_DEG || heading >= 360 - HEADING_TOLERANCE_DEG);
};

export const calculateTilt = (x: number, y: number, z: number): number => {
  return Math.abs(Math.atan2(Math.sqrt(x * x + y * y), z) * (180 / Math.PI) - 90);
};