import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './src/HomeScreen';
import ExploreScreen from './src/ExploreScreen';
import MapScreen from './src/MapScreen';
import LeaderboardScreen from './src/LeaderboardScreen';
import ProfileScreen from './src/ProfileScreen';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: '#22c55e',
          tabBarInactiveTintColor: '#64748b',
          tabBarStyle: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, height: 70 },
          tabBarIcon: ({ color, size }) => {
            if (route.name === 'Home') return <Ionicons name="home" size={size} color={color} />;
            if (route.name === 'Explore') return <MaterialCommunityIcons name="compass-outline" size={size} color={color} />;
            if (route.name === 'Map') return <Ionicons name="map" size={size} color={color} />;
            if (route.name === 'Leaderboard') return <Ionicons name="trophy-outline" size={size} color={color} />;
            if (route.name === 'Profile') return <Ionicons name="person-circle-outline" size={size} color={color} />;
          }
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Explore" component={ExploreScreen} />
        <Tab.Screen name="Map" component={MapScreen} />
        <Tab.Screen name="Leaderboard" component={LeaderboardScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
} 