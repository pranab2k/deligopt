import React from 'react';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

type MapInputProps = {
  notifyChange: (location: { lat: number; lng: number }) => void;
};

const MapInput: React.FC<MapInputProps> = ({ notifyChange }) => {
  return (
    <GooglePlacesAutocomplete
      placeholder="Search"
      minLength={2}
      autoFocus={true}
      returnKeyType="search"
      listViewDisplayed="auto"
      fetchDetails={true}
      onPress={(data, details = null) => {
        if (details && details.geometry && details.geometry.location) {
          notifyChange({
            lat: details.geometry.location.lat,
            lng: details.geometry.location.lng,
          });
        }
      }}
      query={{
        key: 'AIzaSyCZ1jixNYbSRM21Uq82a6KXNO_FSpLUwaQ',
        language: 'en',
      }}
      nearbyPlacesAPI="GooglePlacesSearch"
      debounce={300}
    />
  );
};

export default MapInput;
