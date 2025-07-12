import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

interface LeaderboardEntry {
  name: string;
  score: number;
}

const data: LeaderboardEntry[] = [
  { name: 'Alice', score: 120 },
  { name: 'Bob', score: 100 },
  { name: 'Charlie', score: 80 },
];

const LeaderboardScreen: React.FC = () => {
  // Placeholder for Firebase leaderboard integration
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Leaderboard</Text>
      <FlatList
        data={data}
        keyExtractor={item => item.name}
        renderItem={({ item, index }) => (
          <View style={styles.row}>
            <Text style={styles.rank}>{index + 1}</Text>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.score}>{item.score}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default LeaderboardScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0fdf4',
    paddingTop: 60,
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#22c55e',
    marginBottom: 24,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  rank: {
    fontWeight: 'bold',
    fontSize: 18,
    width: 32,
    color: '#22c55e',
  },
  name: {
    flex: 1,
    fontSize: 16,
    color: '#334155',
  },
  score: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#64748b',
  },
}); 