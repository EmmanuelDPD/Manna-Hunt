import React, { useState, useEffect, useRef } from 'react';
import { View, ImageBackground, StyleSheet, Alert, Keyboard, TouchableWithoutFeedback, Animated } from 'react-native';
import { TextInput, Button, Text, Title } from 'react-native-paper';
import { auth, db } from '../services/firebase';
import { doc, getDoc, updateDoc, collection, getDocs } from 'firebase/firestore';
import * as Location from 'expo-location';
import {
  requestNotificationPermissions,
  notifyIfNearRiddle,
  setupNotificationResponseHandler,
  notifyLevelUp,
  notifyPrizeUnlocked,
  notifyNewRiddle
} from '../services/notifications';

export default function RiddleChallengeScreen({ navigation, route }) {
  const [answer, setAnswer] = useState('');
  const [riddle, setRiddle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [distance, setDistance] = useState(null);
  const [canSubmit, setCanSubmit] = useState(false);
  const [allRiddles, setAllRiddles] = useState([]);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const DIFFICULTY_XP = {
    easy: 10,
    medium: 20,
    hard: 40,
    holy: 100,
  };

  // Debug logging
  useEffect(() => {
    console.log('RiddleChallengeScreen mounted, navigation:', !!navigation);
    if (!navigation) {
      console.warn('Navigation is undefined in RiddleChallengeScreen');
    }
  }, [navigation]);

  useEffect(() => {
    const fetchRiddle = async () => {
      setLoading(true);
      try {
        const userRef = doc(db, 'users', auth.currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (!userSnap.exists()) throw new Error('User not found');
        const user = userSnap.data();
        setUserData(user);
        
        // Fetch all riddles from database
        const riddlesSnap = await getDocs(collection(db, 'riddles'));
        const riddles = riddlesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAllRiddles(riddles);
        
        console.log('Fetched riddles:', riddles.length, riddles.map(r => ({ text: r.text, difficulty: r.difficulty, location: r.location })));
        
        // Get user location
        let location = null;
        try {
          let { status } = await Location.requestForegroundPermissionsAsync();
          if (status === 'granted') {
            location = await Location.getCurrentPositionAsync({});
            console.log('User location:', location.coords);
          }
        } catch (e) {
          console.log('Location permission denied or error:', e);
        }
        
        // Find the next available riddle (either nearby or not completed)
        let nextRiddle = null;
        
        // First, try to find a nearby riddle that's not completed
        if (location) {
          const nearbyRiddles = riddles.filter(r =>
            r.location && getDistanceFromLatLonInM(
              location.coords.latitude,
              location.coords.longitude,
              r.location.latitude,
              r.location.longitude
            ) <= 500
          );
          console.log('Nearby riddles:', nearbyRiddles.length);
          nextRiddle = nearbyRiddles.find(r => !user.progress.includes(r.id));
        }
        
        // If no nearby riddle, show the first uncompleted riddle (for testing)
        if (!nextRiddle) {
          nextRiddle = riddles.find(r => !user.progress.includes(r.id));
          console.log('No nearby riddles, showing first available:', nextRiddle?.text);
        }
        
        setRiddle(nextRiddle || null);
        
        // Animate riddle appearance
        if (nextRiddle) {
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }).start();
        }
        
        // If a new riddle is unlocked, notify
        if (nextRiddle && user.progress.length > 0) {
          await notifyNewRiddle(nextRiddle);
        }
      } catch (err) {
        console.error('Error fetching riddle:', err);
        Alert.alert('Error', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchRiddle();
    requestNotificationPermissions();
    
    // Only setup notification handler if navigation exists
    if (navigation) {
      setupNotificationResponseHandler(navigation);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation]);

  const checkDistance = async () => {
    if (!riddle) return;
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission denied', 'Location permission is required.');
      return;
    }
    let location = await Location.getCurrentPositionAsync({});
    const dist = getDistanceFromLatLonInM(
      location.coords.latitude,
      location.coords.longitude,
      riddle.location.latitude,
      riddle.location.longitude
    );
    setDistance(dist);
    setCanSubmit(dist <= 100);
    await notifyIfNearRiddle(riddle, location.coords);
    if (dist <= 100) {
      Alert.alert('You are at the correct location!', 'You can now submit your answer.');
    } else {
      Alert.alert('Not quite there', `You are ${Math.round(dist)} meters away. Get closer to the target location!`);
    }
  };

  const handleLocationSubmit = async () => {
    if (!riddle) return;
    if (!canSubmit) {
      Alert.alert('Location required', 'You must be within 100 meters of the riddle location to submit your answer.');
      return;
    }
    if (answer.trim().toLowerCase() !== riddle.answer.trim().toLowerCase()) {
      Alert.alert('Incorrect', 'Try again or ask for a hint!');
      return;
    }
    // Calculate new progress and level
    const newProgress = [...userData.progress, riddle.id];
    const newLevel = (userData.level || 1) + 1;
    // Award XP based on riddle difficulty
    const xpToAdd = DIFFICULTY_XP[riddle.difficulty] || 10;
    // Update user progress
    const userRef = doc(db, 'users', auth.currentUser.uid);
    await updateDoc(userRef, {
      progress: newProgress,
      xp: (userData.xp || 0) + xpToAdd,
      level: newLevel,
    });
    // Notify level up
    await notifyLevelUp(newLevel);
    // If all riddles are completed, notify prize unlocked
    if (allRiddles.length > 0 && newProgress.length === allRiddles.length) {
      await notifyPrizeUnlocked();
    }
    
    // Safe navigation with error handling
    try {
      if (navigation && navigation.navigate) {
        navigation.navigate('Verification');
      } else {
        console.warn('Navigation not available for Verification screen');
        // Fallback: just show success message
        Alert.alert('Success!', `You earned ${xpToAdd} XP!`);
      }
    } catch (error) {
      console.error('Navigation error:', error);
      Alert.alert('Success!', `You earned ${xpToAdd} XP!`);
    }
  };

  function getDistanceFromLatLonInM(lat1, lon1, lat2, lon2) {
    function deg2rad(deg) { return deg * (Math.PI / 180); }
    const R = 6371000;
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  if (loading) {
    return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text>Loading...</Text></View>;
  }
  if (!riddle) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Text style={{ fontSize: 18, textAlign: 'center', marginBottom: 10 }}>No more riddles! 🎉</Text>
        <Text style={{ fontSize: 14, textAlign: 'center', color: '#666' }}>
          Total riddles in database: {allRiddles.length}
        </Text>
        <Text style={{ fontSize: 14, textAlign: 'center', color: '#666' }}>
          Riddles completed: {userData?.progress?.length || 0}
        </Text>
      </View>
    );
  }

  // Check if current riddle is nearby
  const isNearby = riddle.location && distance !== null && distance <= 500;

  return (
    <ImageBackground source={require('../assets/backgrounds/nature.jpg')} style={styles.bg}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.container}>
          <Title style={styles.title}>Riddle Challenge</Title>
          
          {/* Riddle info */}
          <View style={styles.riddleInfo}>
            <Text style={styles.riddleCount}>
              Riddle {userData?.progress?.length + 1 || 1} of {allRiddles.length}
            </Text>
            {riddle.location && (
              <Text style={styles.locationInfo}>
                📍 {riddle.cityName || 'Location'}: {riddle.cityName 
                  ? riddle.cityName
                  : `${riddle.location.latitude.toFixed(4)}, ${riddle.location.longitude.toFixed(4)}`
                }
              </Text>
            )}
          </View>
          
          {riddle && (
            <Animated.View style={{ opacity: fadeAnim }}>
              <Text style={styles.riddle}>{riddle.text}</Text>
              <Text style={styles.difficulty}>Difficulty: {riddle.difficulty?.toUpperCase() || 'EASY'} | XP: {DIFFICULTY_XP[riddle.difficulty] || 10}</Text>
            </Animated.View>
          )}
          
          <Button mode="outlined" style={styles.button} onPress={checkDistance}>
            Check My Location
          </Button>
          
          {distance !== null && (
            <View style={styles.distanceInfo}>
              <Text style={{ color: canSubmit ? '#388E3C' : '#B71C1C', marginBottom: 8, textAlign: 'center' }}>
                {canSubmit
                  ? '✅ You are at the correct location!'
                  : `📍 You are ${Math.round(distance)} meters from the target.`}
              </Text>
              {!isNearby && riddle.location && (
                <Text style={{ color: '#FF9800', fontSize: 12, textAlign: 'center', marginBottom: 8 }}>
                  ⚠️ This riddle requires you to be within 500m of the location
                </Text>
              )}
            </View>
          )}
          
          <TextInput
            label="Your Answer"
            value={answer}
            onChangeText={setAnswer}
            style={styles.input}
            mode="outlined"
            editable={canSubmit}
            placeholder={canSubmit ? 'Enter your answer' : 'Check your location first'}
          />
          
          <Button mode="contained" style={styles.button} onPress={handleLocationSubmit} disabled={!canSubmit}>
            Submit Answer
          </Button>
          
          {/* Debug info for development */}
          <View style={styles.debugInfo}>
            <Text style={styles.debugText}>Debug: {allRiddles.length} riddles loaded</Text>
            <Text style={styles.debugText}>Completed: {userData?.progress?.length || 0}</Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, resizeMode: 'cover' },
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: 'rgba(255,255,255,0.7)' },
  title: { textAlign: 'center', marginBottom: 24, color: '#6B4F27' },
  riddle: { fontSize: 18, color: '#388E3C', marginBottom: 8, textAlign: 'center' },
  difficulty: { fontSize: 14, color: '#6B4F27', marginBottom: 16, textAlign: 'center', fontWeight: 'bold' },
  input: { marginBottom: 12, backgroundColor: 'white' },
  button: { marginTop: 12, backgroundColor: '#7CB342' },
  riddleInfo: {
    marginBottom: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#E0F2F7',
    borderRadius: 8,
    alignItems: 'center',
  },
  riddleCount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#455A64',
    marginBottom: 4,
  },
  locationInfo: {
    fontSize: 14,
    color: '#546E7A',
  },
  distanceInfo: {
    marginBottom: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#F3E5F5',
    borderRadius: 8,
    alignItems: 'center',
  },
  debugInfo: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#E0E0E0',
    borderRadius: 8,
    alignItems: 'center',
  },
  debugText: {
    fontSize: 12,
    color: '#333',
  },
}); 