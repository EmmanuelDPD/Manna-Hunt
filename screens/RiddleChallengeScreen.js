import React, { useState, useEffect } from 'react';
import { View, ImageBackground, StyleSheet, Alert, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { TextInput, Button, Text, Title } from 'react-native-paper';
import { auth, db } from '../services/firebase';
import { doc, getDoc, updateDoc, collection, getDocs } from 'firebase/firestore';
import * as Location from 'expo-location';

export default function RiddleChallengeScreen({ navigation }) {
  const [answer, setAnswer] = useState('');
  const [riddle, setRiddle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchRiddle = async () => {
      setLoading(true);
      try {
        const userRef = doc(db, 'users', auth.currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (!userSnap.exists()) throw new Error('User not found');
        const user = userSnap.data();
        setUserData(user);
        const riddlesSnap = await getDocs(collection(db, 'riddles'));
        const riddles = riddlesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const nextRiddle = riddles.find(r => !user.progress.includes(r.id));
        setRiddle(nextRiddle || null);
      } catch (err) {
        Alert.alert('Error', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchRiddle();
  }, []);

  const handleLocationSubmit = async () => {
    if (!riddle) return;
    if (answer.trim().toLowerCase() !== riddle.answer.trim().toLowerCase()) {
      Alert.alert('Incorrect', 'Try again or ask for a hint!');
      return;
    }
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
    if (dist > 100) {
      Alert.alert('Not at the right location', 'Move closer to the riddle location!');
      return;
    }
    const userRef = doc(db, 'users', auth.currentUser.uid);
    await updateDoc(userRef, {
      progress: [...userData.progress, riddle.id],
      xp: (userData.xp || 0) + 100,
      level: (userData.level || 1) + 1,
    });
    navigation.navigate('Verification');
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
    return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text>No more riddles! 🎉</Text></View>;
  }

  return (
    <ImageBackground source={require('../assets/backgrounds/nature.jpg')} style={styles.bg}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.container}>
          <Title style={styles.title}>Riddle Challenge</Title>
          <Text style={styles.riddle}>{riddle.text}</Text>
          <TextInput
            label="Your Answer"
            value={answer}
            onChangeText={setAnswer}
            style={styles.input}
            mode="outlined"
          />
          <Button mode="contained" style={styles.button} onPress={handleLocationSubmit}>
            Submit Location
          </Button>
        </View>
      </TouchableWithoutFeedback>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, resizeMode: 'cover' },
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: 'rgba(255,255,255,0.7)' },
  title: { textAlign: 'center', marginBottom: 24, color: '#6B4F27' },
  riddle: { fontSize: 18, color: '#388E3C', marginBottom: 24, textAlign: 'center' },
  input: { marginBottom: 12, backgroundColor: 'white' },
  button: { marginTop: 12, backgroundColor: '#7CB342' },
}); 