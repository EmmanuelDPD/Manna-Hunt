import React from 'react';
import { View, ImageBackground, StyleSheet, Image } from 'react-native';
import { Button, Title, Text, Avatar, Card } from 'react-native-paper';

// Placeholder images for stepping stones and signs
// const stoneImg = require('../assets/stone.png'); // Add your stone image to assets
// const signImg = require('../assets/sign.png');   // Add your sign image to assets

export default function HomeScreen({ navigation }) {
  return (
    <ImageBackground source={require('../assets/backgrounds/nature.jpg')} style={styles.bg}>
      {/* Top user card */}
      <View style={styles.topCard}>
        <Avatar.Icon icon="account" size={40} style={styles.avatar} />
        <View style={{ marginLeft: 12 }}>
          <Text style={styles.userName}>Johnny Appleseed</Text>
          <Text style={styles.userLevel}>Level 1</Text>
        </View>
      </View>
      {/* Centered welcome text */}
      <View style={styles.centerText}>
        <Title style={styles.title}>WELCOME</Title>
        <Text style={styles.subtitle}>EMBARK ON THE JOURNEY</Text>
      </View>
      {/* Stepping stones path */}
      <View style={styles.pathContainer}>
        {[1, 2, 3, 4].map((num, idx) => (
          <View key={num} style={[styles.stepRow, { top: idx * 55 }]}> {/* Adjust top for vertical spacing */}
            {/* <Image source={stoneImg} style={styles.stone} /> */}
            <View style={styles.signContainer}>
              {/* <Image source={signImg} style={styles.sign} /> */}
              <Text style={styles.signText}>{num}</Text>
            </View>
          </View>
        ))}
      </View>
      {/* Begin Journey button at the bottom (optional) */}
      {/* <Button mode="contained" style={styles.button} onPress={() => navigation.navigate('RiddleChallenge')}>Begin Journey</Button> */}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, resizeMode: 'cover', justifyContent: 'flex-start' },
  topCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    marginTop: 32,
    marginHorizontal: 16,
    padding: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  avatar: { backgroundColor: '#7CB342' },
  userName: { color: '#222', fontWeight: 'bold', fontSize: 16 },
  userLevel: { color: '#6B4F27', fontSize: 14 },
  centerText: { alignItems: 'center', marginTop: 32 },
  title: { color: '#6B4F27', fontSize: 28, fontWeight: 'bold', marginBottom: 4 },
  subtitle: { color: '#222', fontSize: 18, fontWeight: '600' },
  pathContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 180,
    alignItems: 'center',
    height: 350,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    left: 60,
  },
  stone: {
    width: 110,
    height: 50,
    resizeMode: 'contain',
    marginRight: 12,
  },
  signContainer: {
    position: 'absolute',
    left: 80,
    top: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sign: {
    width: 48,
    height: 36,
    resizeMode: 'contain',
  },
  signText: {
    position: 'absolute',
    top: 6,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: '#6B4F27',
    fontWeight: 'bold',
    fontSize: 18,
  },
  button: {
    position: 'absolute',
    bottom: 32,
    left: 32,
    right: 32,
    backgroundColor: '#7CB342',
    borderRadius: 24,
    paddingVertical: 8,
  },
}); 