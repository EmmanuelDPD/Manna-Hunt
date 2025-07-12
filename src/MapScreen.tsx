import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import * as Location from 'expo-location';

const MapScreen: React.FC = () => {
  const [region, setRegion] = useState<Region | null>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;
      let location = await Location.getCurrentPositionAsync({});
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    })();
  }, []);

  if (!region) return <View style={{ flex: 1, backgroundColor: '#e5e7eb' }} />;

  return (
    <MapView style={StyleSheet.absoluteFill} region={region} showsUserLocation>
      {/* Example cache marker */}
      <Marker coordinate={{ latitude: region.latitude + 0.001, longitude: region.longitude + 0.001 }} title="Cache" description="Find the hidden cache!" />
    </MapView>
  );
};

export default MapScreen; 