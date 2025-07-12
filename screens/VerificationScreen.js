import React from 'react';
import { View, ImageBackground, StyleSheet, Animated, Alert } from 'react-native';
import { Button, Text, Title } from 'react-native-paper';
import { useEffect, useState, useRef } from 'react';
import { auth, db } from '../services/firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function VerificationScreen({ navigation, route }) {
  const [userData, setUserData] = useState({ xp: 0, level: 1 });
  const [loading, setLoading] = useState(true);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const XP_PER_LEVEL = 100; // You can adjust this or make it dynamic

  // Debug logging
  useEffect(() => {
    console.log('VerificationScreen mounted, navigation:', !!navigation);
    if (!navigation) {
      console.warn('Navigation is undefined in VerificationScreen');
    }
  }, [navigation]);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const userRef = doc(db, 'users', auth.currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUserData(userSnap.data());
          const xpThisLevel = userSnap.data().xp % XP_PER_LEVEL;
          const progressValue = xpThisLevel / XP_PER_LEVEL;
          Animated.timing(progressAnim, {
            toValue: progressValue,
            duration: 1000,
            useNativeDriver: false,
          }).start();
        }
      } catch (err) {
        setUserData({ xp: 0, level: 1 });
        Animated.timing(progressAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: false,
        }).start();
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleNextRiddle = () => {
    try {
      if (navigation && navigation.navigate) {
        navigation.navigate('RiddleChallenge');
      } else {
        console.warn('Navigation not available for RiddleChallenge screen');
        Alert.alert('Success!', 'Ready for the next challenge!');
      }
    } catch (error) {
      console.error('Navigation error:', error);
      Alert.alert('Success!', 'Ready for the next challenge!');
    }
  };

  if (loading) {
    return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text>Loading...</Text></View>;
  }

  const xpThisLevel = userData.xp % XP_PER_LEVEL;
  const xpToNext = XP_PER_LEVEL - xpThisLevel;

  return (
    <ImageBackground source={require('../assets/backgrounds/nature.jpg')} style={styles.bg}>
      <View style={styles.container}>
        <Title style={styles.title}>Correct!</Title>
        <Text style={styles.message}>Great job! Ready for the next riddle?</Text>
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBarBg}>
            <Animated.View 
              style={[
                styles.progressBarFill, 
                { width: progressAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%'],
                })}
              ]} 
            />
          </View>
          <Text style={styles.xpText}>{xpThisLevel} / {XP_PER_LEVEL} XP to next level</Text>
        </View>
        <Text style={styles.step}>{`Level ${userData.level}`}</Text>
        <Button mode="contained" style={styles.button} onPress={handleNextRiddle}>
          Next Riddle
        </Button>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, resizeMode: 'cover' },
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: 'rgba(255,255,255,0.7)' },
  title: { color: '#6B4F27', fontSize: 28, marginBottom: 16 },
  message: { color: '#388E3C', fontSize: 18, marginBottom: 24, textAlign: 'center' },
  progressBarContainer: { width: '80%', alignItems: 'center', marginBottom: 12 },
  progressBarBg: { width: '100%', height: 16, backgroundColor: '#e0e0e0', borderRadius: 8, overflow: 'hidden' },
  progressBarFill: { height: 16, backgroundColor: '#7CB342', borderRadius: 8 },
  xpText: { color: '#388E3C', fontWeight: 'bold', marginTop: 4, marginBottom: 4 },
  step: { color: '#6B4F27', marginBottom: 24 },
  button: { backgroundColor: '#7CB342', borderRadius: 24, paddingHorizontal: 32 },
}); 