import Geocoder from 'react-native-geocoding';

// Initialize once in your entry file, NOT here:
// Geocoder.init('YOUR_GOOGLE_API_KEY');

export type Coords = {
  latitude: number;
  longitude: number;
};

export const getLocation = (): Promise<Coords> => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => reject(error),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  });
};

export const geocodeLocationByName = (locationName: string): Promise<Coords> => {
  return Geocoder.from(locationName)
    .then((json) => {
      if (!json.results || json.results.length === 0) {
        throw new Error('No results found');
      }
      const location = json.results[0].geometry.location;
      return {
        latitude: location.lat,
        longitude: location.lng,
      };
    })
    .catch((error) => {
      console.error('Geocode error:', error);
      throw error;
    });
};

export const geocodeLocationByCoords = (lat: number, lng: number): Promise<string> => {
  return Geocoder.from(lat, lng)
    .then((json) => {
      if (!json.results || json.results.length === 0) {
        throw new Error('No address found');
      }
      const formattedAddress = json.results[0].formatted_address;
      return formattedAddress;
    })
    .catch((error) => {
      console.error('Reverse geocode error:', error);
      throw error;
    });
};
