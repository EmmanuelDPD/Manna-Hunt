import React from 'react';
import { View, ImageBackground, StyleSheet } from 'react-native';
import { Button, Text, ProgressBar, Title } from 'react-native-paper';

export default function VerificationScreen({ navigation, route }) {
  // Example: Assume correct for now
  const isCorrect = true;
  const currentStep = 1;
  const totalSteps = 5;
  return (
    <ImageBackground source={require('../assets/backgrounds/nature.jpg')} style={styles.bg}>
      <View style={styles.container}>
        <Title style={styles.title}>{isCorrect ? 'Correct!' : 'Try Again'}</Title>
        <Text style={styles.message}>
          {isCorrect ? 'Great job! Ready for the next riddle?' : 'Here’s a hint: Think about miracles.'}
        </Text>
        <ProgressBar progress={currentStep / totalSteps} color="#7CB342" style={styles.progress} />
        <Text style={styles.step}>{`Step ${currentStep} of ${totalSteps}`}</Text>
        <Button mode="contained" style={styles.button} onPress={() => navigation.navigate('RiddleChallenge')}>
          {isCorrect ? 'Next Riddle' : 'Try Again'}
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
  progress: { width: '80%', height: 12, borderRadius: 8, marginBottom: 12 },
  step: { color: '#6B4F27', marginBottom: 24 },
  button: { backgroundColor: '#7CB342', borderRadius: 24, paddingHorizontal: 32 },
}); 