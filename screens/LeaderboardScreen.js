import React, { useEffect, useState } from 'react';
import { View, ImageBackground, StyleSheet, FlatList, ScrollView, SafeAreaView } from 'react-native';
import { Text, Title, Avatar, Card, ActivityIndicator, Chip } from 'react-native-paper';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../services/firebase';
import { SafeAreaView as SafeAreaViewRN } from 'react-native-safe-area-context';

const podiumColors = ['#FFD700', '#C0C0C0', '#CD7F32']; // Gold, Silver, Bronze

export default function LeaderboardScreen() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, 'users'), orderBy('level', 'desc'), orderBy('xp', 'desc'));
        const snap = await getDocs(q);
        setUsers(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  if (loading) {
    return (
      <SafeAreaViewRN style={{ flex: 1, backgroundColor: 'transparent' }}>
        <ActivityIndicator style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} size="large" color="#388E3C" />
      </SafeAreaViewRN>
    );
  }

  if (users.length === 0) {
    return (
      <SafeAreaViewRN style={{ flex: 1, backgroundColor: 'transparent', justifyContent: 'center', alignItems: 'center' }}>
        <Title style={styles.title}>Leaderboard</Title>
        <Text style={{ color: '#6B4F27', marginTop: 24 }}>No leaderboard data yet!</Text>
      </SafeAreaViewRN>
    );
  }

  const podium = users.slice(0, 3);
  const others = users.slice(3);

  return (
    <ImageBackground source={require('../assets/backgrounds/nature.jpg')} style={styles.bg}>
      <SafeAreaViewRN style={{ flex: 1 }}>
        <FlatList
          data={others}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.scrollContainer}
          ListHeaderComponent={
            <>
              <Title style={styles.title}>Leaderboard</Title>
              {/* Podium for Top 3 */}
              <View style={styles.podiumRow}>
                {podium.map((user, idx) => (
                  <View key={user.id} style={[styles.podium, { backgroundColor: podiumColors[idx] }]}>
                    <Avatar.Icon icon="account" size={48} style={styles.avatar} />
                    <Text style={styles.podiumName} numberOfLines={1}>{user.firstName || user.email}</Text>
                    <Chip style={styles.levelChip}>Lvl {user.level || 1}</Chip>
                    <Text style={styles.xp}>{user.xp || 0} XP</Text>
                    <Text style={styles.podiumPlace}>{idx + 1}</Text>
                  </View>
                ))}
              </View>
            </>
          }
          renderItem={({ item, index }) => (
            <Card style={styles.card}>
              <Card.Content style={styles.row}>
                <Avatar.Icon icon="account" size={36} style={styles.avatar} />
                <View style={styles.info}>
                  <Text style={styles.name}>{index + 4}. {item.firstName || item.email}</Text>
                  <Text style={styles.church}>{item.churchId || 'No Church'}</Text>
                </View>
                <Chip style={styles.levelChip}>Lvl {item.level || 1}</Chip>
                <Text style={styles.xp}>{item.xp || 0} XP</Text>
              </Card.Content>
            </Card>
          )}
        />
      </SafeAreaViewRN>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, resizeMode: 'cover' },
  scrollContainer: { padding: 16, paddingBottom: 32 },
  title: { color: '#6B4F27', fontSize: 28, marginBottom: 16, textAlign: 'center', fontWeight: 'bold', marginTop: 16 },
  podiumRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 24 },
  podium: { alignItems: 'center', borderRadius: 16, padding: 12, width: 100, elevation: 4, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 8 },
  podiumName: { color: '#6B4F27', fontWeight: 'bold', fontSize: 14, marginTop: 4, marginBottom: 2, textAlign: 'center' },
  podiumPlace: { fontWeight: 'bold', fontSize: 18, color: '#fff', backgroundColor: '#388E3C', borderRadius: 12, paddingHorizontal: 8, marginTop: 4 },
  avatar: { backgroundColor: '#7CB342', marginBottom: 4 },
  xp: { color: '#388E3C', fontWeight: 'bold', fontSize: 13, marginTop: 2 },
  levelChip: { backgroundColor: '#e0e0e0', marginHorizontal: 4, marginTop: 2 },
  card: { marginBottom: 12, backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: 16, elevation: 2 },
  row: { flexDirection: 'row', alignItems: 'center' },
  info: { flex: 1 },
  name: { color: '#388E3C', fontWeight: 'bold' },
  church: { color: '#6B4F27' },
}); 