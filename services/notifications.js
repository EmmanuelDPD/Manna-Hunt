import * as Notifications from 'expo-notifications';
import * as Location from 'expo-location';

// Request notification permissions
export async function requestNotificationPermissions() {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

// Schedule a notification if user is near a riddle location
export async function notifyIfNearRiddle(riddle, userCoords) {
  if (!riddle || !riddle.location) return;
  const dist = getDistanceFromLatLonInM(
    userCoords.latitude,
    userCoords.longitude,
    riddle.location.latitude,
    riddle.location.longitude
  );
  if (dist <= 100) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'You’re at a riddle location!',
        body: 'Tap to solve the riddle now.',
        data: { screen: 'RiddleChallenge' },
      },
      trigger: null, // immediate
    });
  }
}

// Schedule a notification for a new riddle
export async function notifyNewRiddle(riddle) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'New Riddle Available!',
      body: riddle.text,
      data: { screen: 'RiddleChallenge' },
    },
    trigger: null, // immediate
  });
}

// Level up notification
export async function notifyLevelUp(level) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Level Up! 🎉',
      body: `Congratulations! You’ve reached Level ${level}.`,
      data: { screen: 'Home' },
    },
    trigger: null,
  });
}

// Prize unlocked notification
export async function notifyPrizeUnlocked() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Prize Unlocked!',
      body: 'You’ve completed all riddles. Claim your prize now!',
      data: { screen: 'Prize' },
    },
    trigger: null,
  });
}

// Leaderboard change notification
export async function notifyLeaderboardChange(type) {
  let title = '', body = '';
  if (type === 'top3') {
    title = 'You’re in the Top 3!';
    body = 'Great job! You’ve made it to the top of the leaderboard.';
  } else if (type === 'overtaken') {
    title = 'Leaderboard Update';
    body = 'You’ve been overtaken on the leaderboard. Try to reclaim your spot!';
  }
  await Notifications.scheduleNotificationAsync({
    content: { title, body, data: { screen: 'Leaderboard' } },
    trigger: null,
  });
}

// Daily/weekly reminder notification
export async function notifyDailyReminder() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Keep Going! 🌱',
      body: 'Don’t forget to continue your journey in Manna Hunt!',
      data: { screen: 'Home' },
    },
    trigger: { seconds: 60 * 60 * 24, repeats: true }, // every 24 hours
  });
}

// Listen for notification responses
export function setupNotificationResponseHandler(navigation) {
  Notifications.addNotificationResponseReceivedListener(response => {
    const screen = response.notification.request.content.data.screen;
    if (screen && navigation && navigation.navigate) {
      try {
        navigation.navigate(screen);
      } catch (error) {
        console.log('Navigation error:', error);
      }
    }
  });
}

// Haversine formula for distance in meters
function getDistanceFromLatLonInM(lat1, lon1, lat2, lon2) {
  function deg2rad(deg) { return deg * (Math.PI / 180); }
  const R = 6371000;
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
} 