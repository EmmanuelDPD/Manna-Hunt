import React, { useState } from 'react';
import { View, ImageBackground, StyleSheet, Alert, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { TextInput, Button, Text, Title } from 'react-native-paper';
import { auth, db } from '../services/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [churchCode, setChurchCode] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    setLoading(true);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        // navigation.replace('MainTabs'); // Let auth state handle navigation
      } else {
        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, 'users', userCred.user.uid), {
          email,
          churchId: churchCode,
          level: 1,
          xp: 0,
          progress: [],
          createdAt: new Date(),
        });
        // navigation.replace('MainTabs'); // Let auth state handle navigation
      }
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground source={require('../assets/backgrounds/nature.jpg')} style={styles.bg}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.container}>
          <Title style={styles.title}>Manna Hunt</Title>
          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            mode="outlined"
            autoCapitalize="none"
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
          <Button mode="contained" style={styles.button} onPress={handleAuth} loading={loading} disabled={loading}>
            {isLogin ? 'Login' : 'Sign Up'}
          </Button>
          <Button onPress={() => setIsLogin(!isLogin)}>
            {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Login'}
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
  input: { marginBottom: 12, backgroundColor: 'white' },
  button: { marginTop: 12, backgroundColor: '#7CB342' },
}); 