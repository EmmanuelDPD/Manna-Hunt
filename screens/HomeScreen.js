import React from 'react';
import { View, ImageBackground, StyleSheet } from 'react-native';
import { Button, Title, Text } from 'react-native-paper';

export default function HomeScreen({ navigation }) {
  return (
    <ImageBackground source={require('../assets/backgrounds/nature.jpg')} style={styles.bg}>
      <View style={styles.container}>
        <Title style={styles.title}>WELCOME</Title>
        <Text style={styles.subtitle}>EMBARK ON THE JOURNEY</Text>
        <Text style={styles.quote}>
          {`"Ask and it will be given to you; seek and you will find; knock and the door will be opened to you."`}
          {'\n'}
          <Text style={styles.verse}>Matthew 7:7-8</Text>
        </Text>
        <Button mode="contained" style={styles.button} onPress={() => navigation.navigate('RiddleChallenge')}>Begin Journey</Button>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, resizeMode: 'cover' },
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: 'rgba(255,255,255,0.7)' },
  title: { color: '#6B4F27', fontSize: 32, marginBottom: 8 },
  subtitle: { color: '#6B4F27', fontSize: 20, marginBottom: 24 },
  quote: { color: '#388E3C', fontSize: 18, fontStyle: 'italic', textAlign: 'center', marginBottom: 32 },
  verse: { color: '#6B4F27', fontWeight: 'bold' },
  button: { backgroundColor: '#7CB342', borderRadius: 24, paddingHorizontal: 32 },
}); 