import React, { useEffect, useState } from 'react';
import { View, ImageBackground, StyleSheet, Alert } from 'react-native';
import { Text, Title, Button, ActivityIndicator } from 'react-native-paper';
import { auth, db } from '../services/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';

export default function ProfileScreen({ navigation, route }) {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Debug logging
  useEffect(() => {
    console.log('ProfileScreen mounted, navigation:', !!navigation);
    if (!navigation) {
      console.warn('Navigation is undefined in ProfileScreen');
    }
  }, [navigation]);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const userRef = doc(db, 'users', auth.currentUser.uid);
        const userSnap = await getDoc(userRef);
        setUserData(userSnap.data());
      } catch (err) {
        setUserData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  const handleAdminAccess = () => {
    try {
      if (navigation && navigation.navigate) {
        navigation.navigate('Admin');
      } else {
        console.warn('Navigation not available for Admin screen');
        Alert.alert('Admin Panel', 'Admin panel not available in this context');
      }
    } catch (error) {
      console.error('Navigation error:', error);
      Alert.alert('Admin Panel', 'Admin panel not available in this context');
    }
  };

  if (loading) {
    return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><ActivityIndicator size="large" color="#388E3C" /></View>;
  }

  if (!userData) {
    return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text>Unable to load profile.</Text></View>;
  }

  return (
    <ImageBackground source={require('../assets/backgrounds/nature.jpg')} style={styles.bg}>
      <View style={styles.container}>
        <Title style={styles.title}>Profile</Title>
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{auth.currentUser.email}</Text>
        <Text style={styles.label}>Church:</Text>
        <Text style={styles.value}>{userData.churchId || 'N/A'}</Text>
        <Text style={styles.label}>Level:</Text>
        <Text style={styles.value}>{userData.level || 1}</Text>
        <Text style={styles.label}>XP:</Text>
        <Text style={styles.value}>{userData.xp || 0}</Text>
        <Button mode="contained" style={styles.button} onPress={handleLogout}>Logout</Button>
        <Button mode="outlined" style={styles.adminButton} onPress={handleAdminAccess}>
          Admin Panel (Dev)
        </Button>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, resizeMode: 'cover' },
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: 'rgba(255,255,255,0.7)' },
  title: { color: '#6B4F27', fontSize: 28, marginBottom: 24 },
  label: { color: '#388E3C', fontWeight: 'bold', marginTop: 8 },
  value: { color: '#6B4F27', marginBottom: 4 },
  button: { backgroundColor: '#7CB342', borderRadius: 24, paddingHorizontal: 32, marginTop: 32 },
  adminButton: { borderColor: '#7CB342', borderRadius: 24, paddingHorizontal: 32, marginTop: 16 },
}); 