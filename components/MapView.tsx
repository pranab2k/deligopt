import React from 'react';
import MapView, { Marker, Region } from 'react-native-maps';

type MyMapViewProps = {
  region: Region;
  onRegionChange: (region: Region) => void;
};

const MyMapView: React.FC<MyMapViewProps> = ({ region, onRegionChange }) => {
  return (
    <MapView
      style={{ flex: 1 }}
      region={region}
      showsUserLocation={true}
      onRegionChangeComplete={onRegionChange} // Better: fires when user stops dragging
    >
      <Marker coordinate={region} />
    </MapView>
  );
};

export default MyMapView;
