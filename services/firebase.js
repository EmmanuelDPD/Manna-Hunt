import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

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