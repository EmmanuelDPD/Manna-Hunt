import React, { useState } from 'react';
import { View, ImageBackground, StyleSheet, Alert } from 'react-native';
import { Button, Text, Title, Card } from 'react-native-paper';
import { auth, db } from '../services/firebase';
import { collection, addDoc } from 'firebase/firestore';

export default function PrizeScreen() {
  const [selected, setSelected] = useState(null);
  const [claimed, setClaimed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClaim = async () => {
    if (!selected) return;
    setLoading(true);
    try {
      await addDoc(collection(db, 'prizes'), {
        userId: auth.currentUser.uid,
        prizeType: selected,
        claimedAt: new Date(),
      });
      setClaimed(true);
      Alert.alert('Success', 'Your prize claim has been submitted!');
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground source={require('../assets/backgrounds/nature.jpg')} style={styles.bg}>
      <View style={styles.container}>
        <Title style={styles.title}>Congratulations!</Title>
        <Text style={styles.subtitle}>Choose your prize:</Text>
        <Card style={[styles.card, selected === 'personal' && styles.selected]} onPress={() => setSelected('personal')}>
          <Card.Content>
            <Text style={styles.prize}>$1,000 for Personal Use</Text>
          </Card.Content>
        </Card>
        <Card style={[styles.card, selected === 'ministry' && styles.selected]} onPress={() => setSelected('ministry')}>
          <Card.Content>
            <Text style={styles.prize}>$10,000 for Ministry</Text>
            <Text style={styles.note}>(Church-held, triggered on action)</Text>
          </Card.Content>
        </Card>
        <Button
          mode="contained"
          style={styles.button}
          disabled={!selected || claimed || loading}
          loading={loading}
          onPress={handleClaim}
        >
          {claimed ? 'Prize Claimed' : 'Claim Prize'}
        </Button>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, resizeMode: 'cover' },
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: 'rgba(255,255,255,0.7)' },
  title: { color: '#6B4F27', fontSize: 28, marginBottom: 8 },
  subtitle: { color: '#388E3C', fontSize: 18, marginBottom: 24 },
  card: { width: '100%', marginBottom: 16, backgroundColor: '#fff', borderRadius: 16 },
  selected: { borderWidth: 2, borderColor: '#7CB342' },
  prize: { color: '#6B4F27', fontWeight: 'bold', fontSize: 18 },
  note: { color: '#388E3C', fontSize: 12 },
  button: { backgroundColor: '#7CB342', borderRadius: 24, paddingHorizontal: 32, marginTop: 24 },
}); 