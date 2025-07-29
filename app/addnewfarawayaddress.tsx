import {
  GooglePlacesAutocomplete,
  PlaceDetails,
  PlacesError,
} from "expo-google-places-autocomplete";
import * as Location from "expo-location";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { Alert, Dimensions, StyleSheet, Text, View } from "react-native";
import MapView, { Callout, Marker, Region } from "react-native-maps";

const API_KEY = "AIzaSyCZ1jixNYbSRM21Uq82a6KXNO_FSpLUwaQ"; // Replace with your API key

export default function App() {
  const [place, setPlace] = useState<PlaceDetails | null>(null);
  const [region, setRegion] = useState<Region | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission denied", "Allow location access to show map.");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    })();
  }, []);

  const onSearchError = React.useCallback((error: PlacesError) => {
    console.log("Search error:", error);
  }, []);

  const onPlaceSelected = React.useCallback((place: PlaceDetails) => {
    setPlace(place);
    const location = place?.coordinate;
    if (location) {
      setRegion({
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  }, []);

  const onMarkerDragEnd = (e: any) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setRegion((prev) =>
      prev ? { ...prev, latitude, longitude } : null
    );
  };

  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />
      <Text style={styles.title}>Google Places Autocomplete</Text>

      <GooglePlacesAutocomplete
        apiKey={API_KEY}
        requestConfig={{ countries: ["IN", "PT"] }}
        containerStyle={styles.containerStyle}
        onPlaceSelected={onPlaceSelected}
        onSearchError={onSearchError}
      />

      {region && (
        <MapView style={styles.map} region={region}>
          <Marker
            coordinate={{
              latitude: region.latitude,
              longitude: region.longitude,
            }}
            draggable
            onDragEnd={onMarkerDragEnd}
            pinColor="blue"
          >
            <Callout>
              <View style={{ width: 200 }}>
                <Text style={{ fontWeight: "bold" }}>
                  {place?.name || "Current Location"}
                </Text>
                <Text>
                  {place?.formattedAddress ||
                    "Drag marker to reposition location"}
                </Text>
              </View>
            </Callout>
          </Marker>
        </MapView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "rgba(211, 211, 211, 0.3)",
    paddingTop: 50,
  },
  title: {
    textAlign: "center",
    fontSize: 18,
    marginBottom: 10,
  },
  containerStyle: {
    marginHorizontal: 10,
    borderRadius: 5,
    zIndex: 1,
  },
  map: {
    flex: 1,
    width: Dimensions.get("window").width,
    height: 400,
    marginTop: 10,
  },
});
