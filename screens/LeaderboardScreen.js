import React from 'react';
import { View, ImageBackground, StyleSheet, FlatList } from 'react-native';
import { Text, Title, Avatar, Card } from 'react-native-paper';

const mockLeaderboard = [
  { id: '1', name: 'John Doe', church: 'Calvary', xp: 999, level: 5 },
  { id: '2', name: 'Jane Smith', church: 'Elevation', xp: 888, level: 5 },
  { id: '3', name: 'Alice Johnson', church: 'Hope', xp: 777, level: 4 },
  { id: '4', name: 'Sam Johnson', church: 'Grace', xp: 678, level: 4 },
  { id: '5', name: 'Samuel Steel', church: 'Faith', xp: 411, level: 3 },
];

export default function LeaderboardScreen() {
  return (
    <ImageBackground source={require('../assets/backgrounds/nature.jpg')} style={styles.bg}>
      <View style={styles.container}>
        <Title style={styles.title}>Leaderboard</Title>
        <FlatList
          data={mockLeaderboard}
          keyExtractor={item => item.id}
          renderItem={({ item, index }) => (
            <Card style={styles.card}>
              <Card.Content style={styles.row}>
                <Avatar.Icon icon="account" size={36} style={styles.avatar} />
                <View style={styles.info}>
                  <Text style={styles.name}>{index + 1}. {item.name}</Text>
                  <Text style={styles.church}>{item.church} Church</Text>
                </View>
                <Text style={styles.xp}>{item.xp} XP</Text>
              </Card.Content>
            </Card>
          )}
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, resizeMode: 'cover' },
  container: { flex: 1, padding: 16, backgroundColor: 'rgba(255,255,255,0.7)' },
  title: { color: '#6B4F27', fontSize: 28, marginBottom: 16, textAlign: 'center' },
  card: { marginBottom: 12, backgroundColor: '#fff', borderRadius: 16 },
  row: { flexDirection: 'row', alignItems: 'center' },
  avatar: { backgroundColor: '#7CB342', marginRight: 12 },
  info: { flex: 1 },
  name: { color: '#388E3C', fontWeight: 'bold' },
  church: { color: '#6B4F27' },
  xp: { color: '#6B4F27', fontWeight: 'bold' },
}); 