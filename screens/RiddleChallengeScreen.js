import React, { useState } from 'react';
import { View, ImageBackground, StyleSheet } from 'react-native';
import { TextInput, Button, Text, Title } from 'react-native-paper';

export default function RiddleChallengeScreen({ navigation }) {
  const [answer, setAnswer] = useState('');
  // Example riddle
  const riddle = 'I parted the sea, but I am not water. Who am I?';

  const handleLocationSubmit = async () => {
    // TODO: Implement GPS verification logic
    // Use expo-location here
    navigation.navigate('Verification');
  };

  return (
    <ImageBackground source={require('../assets/backgrounds/nature.jpg')} style={styles.bg}>
      <View style={styles.container}>
        <Title style={styles.title}>Riddle Challenge</Title>
        <Text style={styles.riddle}>{riddle}</Text>
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