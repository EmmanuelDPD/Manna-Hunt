import React from 'react';
import { View, Text, ScrollView, Image, StyleSheet } from 'react-native';

type Step = {
  title: string;
  desc: string;
  color: string;
};

const steps: Step[] = [
  { title: 'The Beginning of Wisdom', desc: 'Start your journey of discovery.', color: '#4ade80' },
  { title: 'Ask and Receive', desc: 'Unlock the next clue by asking.', color: '#fb923c' },
  { title: 'The Good Shepherd', desc: 'Follow the path to guidance.', color: '#fb923c' },
  { title: 'Living Water', desc: 'Find refreshment for your soul.', color: '#f87171' },
  { title: 'The Narrow Path', desc: 'Complete the final challenge.', color: '#f87171' },
];

const ExploreScreen: React.FC = () => {
  // Placeholder for Firebase progress integration
  const completed = 1;
  return (
    <View style={{ flex: 1, backgroundColor: '#f0fdf4' }}>
      <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/616/616408.png' }} style={styles.mascot} />
      <View style={{ paddingHorizontal: 24, paddingTop: 24 }}>
        <Text style={{ fontSize: 12, color: '#64748b', marginBottom: 8 }}>Progress</Text>
        <View style={{ width: '100%', backgroundColor: '#e5e7eb', borderRadius: 9999, height: 8, marginBottom: 16 }}>
          <View style={{ backgroundColor: '#4ade80', height: 8, borderRadius: 9999, width: `${(completed/steps.length)*100}%` }} />
        </View>
        <Text style={{ fontSize: 14, fontWeight: '600', marginBottom: 16 }}>{completed} of {steps.length} levels completed</Text>
      </View>
      <ScrollView style={{ paddingHorizontal: 24 }} contentContainerStyle={{ paddingBottom: 80 }}>
        {steps.map((step, i) => (
          <View key={i} style={styles.stepCard}>
            <View style={[styles.badge, { backgroundColor: step.color }]}> 
              <Text style={{ color: 'white', fontWeight: 'bold' }}>{i+1}</Text>
            </View>
            <View>
              <Text style={{ fontWeight: '600', fontSize: 18 }}>{step.title}</Text>
              <Text style={{ color: '#64748b', fontSize: 14 }}>{step.desc}</Text>
            </View>
          </View>
        ))}
        <Text style={styles.quote}>
          “For everyone who asks receives, and the one who seeks finds…”{"\n"}
          <Text style={{ fontSize: 12 }}>(Matthew 7:8)</Text>
        </Text>
      </ScrollView>
    </View>
  );
};

export default ExploreScreen;

const styles = StyleSheet.create({
  mascot: {
    position: 'absolute',
    right: 0,
    bottom: 120,
    width: 100,
    height: 100,
    opacity: 0.18,
    zIndex: 0,
  },
  stepCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 18,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
    padding: 16,
    marginBottom: 16,
  },
  badge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  quote: {
    textAlign: 'center',
    fontStyle: 'italic',
    color: '#15803d',
    fontSize: 15,
    marginTop: 16,
    marginBottom: 32,
  },
}); 