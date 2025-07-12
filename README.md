# Manna Hunt - Church Scavenger Hunt App

A React Native app for church-connected scavenger hunts with GPS verification, XP-based progression, and animated UI.

## Features

- **XP by Difficulty**: Riddles award XP based on difficulty (Easy: 10, Medium: 20, Hard: 40, Holy: 100)
- **Geocaching**: Riddles are location-based and only appear when you're within 500m
- **Animated Progress Bar**: Dynamic XP progress visualization
- **Firebase Backend**: Authentication and Firestore for data persistence
- **Notifications**: Location-based and achievement notifications

## Setup & Testing

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the App
```bash
npx expo start --port 8082
```

### 3. Populate Riddles in Database
1. **Open the app** and log in with any email/password
2. **Go to Profile** → **Admin Panel (Dev)**
3. **Check Database Status** - tap "Check Existing Riddles" to see current count
4. **Seed Sample Riddles** - tap "Seed Sample Riddles" to populate the database
5. **Verify** - tap "Check Existing Riddles" again to confirm 4 riddles are added

### 4. View Riddles in Discover Tab
1. **Go to Discover tab** - you should now see riddles!
2. **Check the debug info** at the bottom showing "X riddles loaded"
3. **See riddle details** including difficulty, XP reward, and location coordinates

### 5. Test Geocaching
Set your device/emulator location to one of these coordinates:

| Location | Coordinates | Difficulty | XP Reward |
|----------|-------------|------------|-----------|
| NYC | 40.7128, -74.0060 | Easy | 10 XP |
| LA | 34.0522, -118.2437 | Medium | 20 XP |
| Chicago | 41.8781, -87.6298 | Hard | 40 XP |
| London | 51.5074, -0.1278 | Holy | 100 XP |

### 6. Mock Location Setup

#### Android Emulator:
1. Open Extended Controls (⋮)
2. Location → Set latitude/longitude
3. Enter coordinates (e.g., 40.7128, -74.0060)

#### iOS Simulator:
1. Features → Location → Custom Location
2. Enter coordinates

#### Real Device:
- Use a mock location app (e.g., "Fake GPS" on Android)

## How It Works

1. **Database Population**: Admin panel seeds Firestore with sample riddles
2. **Riddle Display**: Discover tab shows all riddles with location info
3. **Location Check**: App checks if you're within 500m of any riddle
4. **Answer Submission**: Must be within 100m to submit
5. **XP Award**: XP awarded based on riddle difficulty
6. **Progress Animation**: Animated progress bar shows XP to next level

## Troubleshooting

### No Riddles Showing in Discover Tab
1. **Check Database**: Go to Admin Panel → "Check Existing Riddles"
2. **Seed Riddles**: If count is 0, tap "Seed Sample Riddles"
3. **Check Console**: Look for "Fetched riddles: X" in console logs
4. **Verify Firebase**: Ensure Firebase connection is working

### Location Not Working
- Ensure location permissions are granted
- Check if mock location is set correctly
- Verify coordinates are within 500m of riddle locations

### Navigation Errors
- All navigation calls now have error handling
- Check console for debug logs about navigation status
- App will show fallback messages if navigation fails

## File Structure

```
screens/
├── LoginScreen.js          # Authentication
├── HomeScreen.js           # Main dashboard
├── RiddleChallengeScreen.js # Riddle solving with geocaching
├── VerificationScreen.js   # Animated XP progress
├── LeaderboardScreen.js    # User rankings
├── PrizeScreen.js          # Prize claiming
├── ProfileScreen.js        # User profile + admin access
└── AdminScreen.js          # Development tools

services/
├── firebase.js             # Firebase config + riddle seeding
└── notifications.js        # Push notifications

components/                 # Reusable UI components
assets/                     # Images and backgrounds
```

## Development Notes

- Uses React Native's built-in Animated API for Expo Go compatibility
- Firebase Firestore for data persistence
- Expo Location for GPS functionality
- React Native Paper for UI components
- Comprehensive error handling for navigation and database operations

## Next Steps

- Add more riddles and locations
- Implement admin interface for riddle creation
- Add sound effects and more animations
- Implement team-based features 