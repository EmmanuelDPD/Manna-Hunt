import React, { useState } from 'react';
import { View, ImageBackground, StyleSheet, Alert } from 'react-native';
import { Button, Text, Title, Card } from 'react-native-paper';
import { 
  seedSampleRiddles, 
  checkExistingRiddles, 
  addRiddlesAtCurrentLocation,
  getCurrentLocationWithCity 
} from '../services/firebase';

export default function AdminScreen({ navigation, route }) {
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);
  const [addingLocal, setAddingLocal] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [riddleCount, setRiddleCount] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);

  // Debug logging
  React.useEffect(() => {
    console.log('AdminScreen mounted, navigation:', !!navigation);
    if (!navigation) {
      console.warn('Navigation is undefined in AdminScreen');
    }
  }, [navigation]);

  const handleSeedRiddles = async () => {
    setLoading(true);
    try {
      await seedSampleRiddles();
      Alert.alert('Success', 'Sample riddles have been seeded!');
      // Update riddle count after seeding
      const riddles = await checkExistingRiddles();
      setRiddleCount(riddles.length);
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckRiddles = async () => {
    setChecking(true);
    try {
      const riddles = await checkExistingRiddles();
      setRiddleCount(riddles.length);
      Alert.alert('Riddle Check', `Found ${riddles.length} riddles in database. Check console for details.`);
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setChecking(false);
    }
  };

  const handleGetCurrentLocation = async () => {
    setGettingLocation(true);
    try {
      const locationData = await getCurrentLocationWithCity();
      setCurrentLocation(locationData);
      Alert.alert(
        'Current Location', 
        `City: ${locationData.cityName}\nCoordinates: ${locationData.latitude.toFixed(4)}, ${locationData.longitude.toFixed(4)}\nAddress: ${locationData.fullAddress}`
      );
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setGettingLocation(false);
    }
  };

  const handleAddLocalRiddles = async () => {
    setAddingLocal(true);
    try {
      const result = await addRiddlesAtCurrentLocation();
      Alert.alert(
        'Success', 
        `Added ${result.riddlesAdded} riddles in ${result.cityName}!`
      );
      // Update riddle count after adding
      const riddles = await checkExistingRiddles();
      setRiddleCount(riddles.length);
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setAddingLocal(false);
    }
  };

  const handleGoBack = () => {
    try {
      if (navigation && navigation.goBack) {
        navigation.goBack();
      } else {
        console.warn('Navigation not available for goBack');
        Alert.alert('Navigation', 'Back navigation not available');
      }
    } catch (error) {
      console.error('Navigation error:', error);
      Alert.alert('Navigation', 'Back navigation not available');
    }
  };

  return (
    <ImageBackground source={require('../assets/backgrounds/nature.jpg')} style={styles.bg}>
      <View style={styles.container}>
        <Title style={styles.title}>Admin Panel</Title>
        <Text style={styles.subtitle}>Development & Testing Tools</Text>
        
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.cardTitle}>Database Status</Text>
            <Text style={styles.cardText}>
              {riddleCount !== null 
                ? `Currently ${riddleCount} riddles in database`
                : 'Check database status to see existing riddles'
              }
            </Text>
            <Button 
              mode="outlined" 
              style={styles.button} 
              onPress={handleCheckRiddles}
              loading={checking}
              disabled={checking}
            >
              Check Existing Riddles
            </Button>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.cardTitle}>Current Location</Text>
            <Text style={styles.cardText}>
              {currentLocation 
                ? `📍 ${currentLocation.cityName} (${currentLocation.latitude.toFixed(4)}, ${currentLocation.longitude.toFixed(4)})`
                : 'Get your current location to add local riddles'
              }
            </Text>
            <Button 
              mode="outlined" 
              style={styles.button} 
              onPress={handleGetCurrentLocation}
              loading={gettingLocation}
              disabled={gettingLocation}
            >
              Get Current Location
            </Button>
            {currentLocation && (
              <Button 
                mode="contained" 
                style={[styles.button, { marginTop: 8 }]} 
                onPress={handleAddLocalRiddles}
                loading={addingLocal}
                disabled={addingLocal}
              >
                Add Riddles at Current Location
              </Button>
            )}
          </Card.Content>
        </Card>
        
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.cardTitle}>Sample Riddles</Text>
            <Text style={styles.cardText}>
              Seed the database with sample riddles of varying difficulty levels and geocached locations.
            </Text>
            <Button 
              mode="contained" 
              style={styles.button} 
              onPress={handleSeedRiddles}
              loading={loading}
              disabled={loading}
            >
              Seed Sample Riddles
            </Button>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.cardTitle}>Test Locations</Text>
            <Text style={styles.cardText}>
              Set your device location to one of these coordinates to test riddles:
            </Text>
            <Text style={styles.locationText}>• NYC: 40.7128, -74.0060 (Easy)</Text>
            <Text style={styles.locationText}>• LA: 34.0522, -118.2437 (Medium)</Text>
            <Text style={styles.locationText}>• Chicago: 41.8781, -87.6298 (Hard)</Text>
            <Text style={styles.locationText}>• London: 51.5074, -0.1278 (Holy)</Text>
          </Card.Content>
        </Card>

        <Button 
          mode="outlined" 
          style={styles.backButton} 
          onPress={handleGoBack}
        >
          Back to App
        </Button>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, resizeMode: 'cover' },
  container: { flex: 1, padding: 24, backgroundColor: 'rgba(255,255,255,0.7)' },
  title: { color: '#6B4F27', fontSize: 28, marginBottom: 8, textAlign: 'center' },
  subtitle: { color: '#388E3C', fontSize: 16, marginBottom: 24, textAlign: 'center' },
  card: { marginBottom: 16, backgroundColor: '#fff', borderRadius: 16 },
  cardTitle: { color: '#6B4F27', fontWeight: 'bold', fontSize: 18, marginBottom: 8 },
  cardText: { color: '#388E3C', marginBottom: 12 },
  locationText: { color: '#6B4F27', fontSize: 14, marginBottom: 4 },
  button: { backgroundColor: '#7CB342', marginTop: 8 },
  backButton: { marginTop: 24, borderColor: '#7CB342' },
}); 