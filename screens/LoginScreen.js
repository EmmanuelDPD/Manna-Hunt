import React, { useState } from 'react';
import { View, ImageBackground, StyleSheet } from 'react-native';
import { TextInput, Button, Text, Title } from 'react-native-paper';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [churchCode, setChurchCode] = useState('');
  const [isLogin, setIsLogin] = useState(true);

  return (
    <ImageBackground source={require('../assets/backgrounds/nature.jpg')} style={styles.bg}>
      <View style={styles.container}>
        <Title style={styles.title}>Manna Hunt</Title>
        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          mode="outlined"
        />
        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
          mode="outlined"
        />
        <TextInput
          label="Church Code"
          value={churchCode}
          onChangeText={setChurchCode}
          style={styles.input}
          mode="outlined"
        />
        <Button mode="contained" style={styles.button} onPress={() => {}}>
          {isLogin ? 'Login' : 'Sign Up'}
        </Button>
        <Button onPress={() => setIsLogin(!isLogin)}>
          {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Login'}
        </Button>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, resizeMode: 'cover' },
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: 'rgba(255,255,255,0.7)' },
  title: { textAlign: 'center', marginBottom: 24, color: '#6B4F27' },
  input: { marginBottom: 12, backgroundColor: 'white' },
  button: { marginTop: 12, backgroundColor: '#7CB342' },
}); 