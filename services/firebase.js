import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';

const firebaseConfig = {
  apiKey: 'AIzaSyBXVfFlZ4vF5hykPTnolNpRV3s_ojelBWc',
  authDomain: 'manna-hunt.firebaseapp.com',
  projectId: 'manna-hunt',
  storageBucket: 'manna-hunt.firebasestorage.app',
  messagingSenderId: '398445152358',
  appId: '1:398445152358:web:394f114b618d182f2e45a7',
};

const app = initializeApp(firebaseConfig);

// Use AsyncStorage for React Native persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
const db = getFirestore(app);

export { app, auth, db };

// Function to get current location and city name
export async function getCurrentLocationWithCity() {
  try {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      throw new Error('Location permission denied');
    }

    let location = await Location.getCurrentPositionAsync({});
    
    // Reverse geocode to get city name
    const reverseGeocode = await Location.reverseGeocodeAsync({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });

    const address = reverseGeocode[0];
    const cityName = address?.city || address?.region || 'Unknown Location';
    
    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      cityName: cityName,
      fullAddress: `${address?.street || ''} ${address?.city || ''} ${address?.region || ''} ${address?.country || ''}`.trim(),
    };
  } catch (error) {
    console.error('Error getting location:', error);
    throw error;
  }
}

// Function to add riddles at current location
export async function addRiddlesAtCurrentLocation() {
  try {
    const locationData = await getCurrentLocationWithCity();
    
    const localRiddles = [
      {
        text: 'What did Jesus feed to 5000 people with just 5 loaves and 2 fish?',
        answer: 'Bread',
        difficulty: 'easy',
        location: { latitude: locationData.latitude, longitude: locationData.longitude },
        cityName: locationData.cityName,
      },
      {
        text: 'Who denied Jesus three times before the rooster crowed?',
        answer: 'Peter',
        difficulty: 'medium',
        location: { latitude: locationData.latitude + 0.001, longitude: locationData.longitude + 0.001 },
        cityName: locationData.cityName,
      },
      {
        text: 'What did Jesus turn water into at the wedding in Cana?',
        answer: 'Wine',
        difficulty: 'hard',
        location: { latitude: locationData.latitude - 0.001, longitude: locationData.longitude - 0.001 },
        cityName: locationData.cityName,
      },
      {
        text: 'Who was the first person to see Jesus after his resurrection?',
        answer: 'Mary Magdalene',
        difficulty: 'holy',
        location: { latitude: locationData.latitude + 0.002, longitude: locationData.longitude - 0.002 },
        cityName: locationData.cityName,
      },
    ];

    console.log(`Adding riddles in ${locationData.cityName}...`);
    for (const riddle of localRiddles) {
      try {
        await addDoc(collection(db, 'riddles'), riddle);
        console.log(`Added riddle in ${locationData.cityName}:`, riddle.text);
      } catch (error) {
        console.error('Error adding riddle:', error);
      }
    }
    
    return {
      success: true,
      cityName: locationData.cityName,
      riddlesAdded: localRiddles.length,
      location: locationData,
    };
  } catch (error) {
    console.error('Error adding riddles at current location:', error);
    throw error;
  }
}

// Function to check existing riddles in database
export async function checkExistingRiddles() {
  try {
    const riddlesSnap = await getDocs(collection(db, 'riddles'));
    const riddles = riddlesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    console.log('=== EXISTING RIDDLES IN DATABASE ===');
    console.log('Total riddles:', riddles.length);
    riddles.forEach((riddle, index) => {
      console.log(`${index + 1}. ${riddle.text}`);
      console.log(`   Answer: ${riddle.answer}`);
      console.log(`   Difficulty: ${riddle.difficulty}`);
      console.log(`   Location: ${riddle.location?.latitude}, ${riddle.location?.longitude}`);
      console.log(`   City: ${riddle.cityName || 'Unknown'}`);
      console.log('---');
    });
    return riddles;
  } catch (error) {
    console.error('Error checking riddles:', error);
    return [];
  }
}

// ADMIN/DEV: Function to seed riddles with geocaching and difficulty
export async function seedSampleRiddles() {
  const riddles = [
    {
      text: 'What did Moses part to lead the Israelites to safety?',
      answer: 'Red Sea',
      difficulty: 'easy',
      location: { latitude: 40.7128, longitude: -74.0060 },
      cityName: 'New York City',
    },
    {
      text: 'Who was swallowed by a great fish for three days?',
      answer: 'Jonah',
      difficulty: 'medium',
      location: { latitude: 34.0522, longitude: -118.2437 },
      cityName: 'Los Angeles',
    },
    {
      text: 'What city\'s walls fell after Joshua\'s army marched around them?',
      answer: 'Jericho',
      difficulty: 'hard',
      location: { latitude: 41.8781, longitude: -87.6298 },
      cityName: 'Chicago',
    },
    {
      text: 'Who was taken up to heaven in a whirlwind?',
      answer: 'Elijah',
      difficulty: 'holy',
      location: { latitude: 51.5074, longitude: -0.1278 },
      cityName: 'London',
    },
  ];
  
  console.log('Seeding riddles...');
  for (const riddle of riddles) {
    try {
      await addDoc(collection(db, 'riddles'), riddle);
      console.log('Added riddle:', riddle.text);
    } catch (error) {
      console.error('Error adding riddle:', error);
    }
  }
  console.log('Riddle seeding complete!');
  return 'Sample riddles seeded!';
} 