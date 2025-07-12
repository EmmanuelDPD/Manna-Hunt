import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80' }}
        style={styles.background}
        blurRadius={1}
      />
      <View style={styles.overlay} />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Begin your journey</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
    opacity: 0.95,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(240,253,244,0.3)',
  },
  buttonContainer: {
    marginBottom: 60,
    alignItems: 'center',
    zIndex: 2,
  },
  button: {
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 9999,
    paddingVertical: 16,
    paddingHorizontal: 32,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  buttonText: {
    color: '#22c55e',
    fontWeight: 'bold',
    fontSize: 18,
  },
}); 