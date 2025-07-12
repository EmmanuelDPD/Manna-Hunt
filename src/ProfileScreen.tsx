import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const achievements: string[] = [
  'First Cache Found',
  'Explorer Badge',
  'Wisdom Seeker',
];

const ProfileScreen: React.FC = () => {
  // Placeholder for Firebase user data integration
  return (
    <View style={styles.container}>
      <Image source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }} style={styles.avatar} />
      <Text style={styles.name}>John Doe</Text>
      <Text style={styles.sectionTitle}>Achievements</Text>
      {achievements.map((ach, i) => (
        <View key={i} style={styles.achievement}>
          <Text style={styles.achievementText}>• {ach}</Text>
        </View>
      ))}
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0fdf4',
    alignItems: 'center',
    paddingTop: 60,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#334155',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#22c55e',
    marginBottom: 12,
  },
  achievement: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    width: 220,
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  achievementText: {
    color: '#64748b',
    fontSize: 15,
  },
}); 