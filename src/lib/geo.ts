import type { Location as AppLocation } from '@/types';

export interface GeoValidationResult {
  status: 'VALID_RADIUS' | 'OUT_OF_RADIUS' | 'GPS_DISABLED' | 'GPS_ERROR';
  location: { lat: number; lng: number } | null;
  distance: number | null;
  nearestLocation: AppLocation | null;
}

/**
 * Haversine formula to calculate distance between two GPS coordinates
 * Returns distance in meters
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371000; // Earth radius in meters
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * Validate user's GPS position against all active locations
 */
export function validateLocation(
  userLat: number,
  userLng: number,
  locations: AppLocation[]
): GeoValidationResult {
  let nearestLocation: AppLocation | null = null;
  let minDistance = Infinity;

  for (const loc of locations) {
    const dist = calculateDistance(userLat, userLng, loc.lat, loc.lng);
    if (dist < minDistance) {
      minDistance = dist;
      nearestLocation = loc;
    }
  }

  if (!nearestLocation) {
    return {
      status: 'GPS_ERROR',
      location: { lat: userLat, lng: userLng },
      distance: null,
      nearestLocation: null,
    };
  }

  const isValid = minDistance <= nearestLocation.radius_meters;

  return {
    status: isValid ? 'VALID_RADIUS' : 'OUT_OF_RADIUS',
    location: { lat: userLat, lng: userLng },
    distance: Math.round(minDistance),
    nearestLocation,
  };
}

/**
 * Request current GPS position from browser
 */
export function getCurrentPosition(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('GPS_DISABLED'));
      return;
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    });
  });
}
