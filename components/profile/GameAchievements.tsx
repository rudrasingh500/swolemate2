import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { useAchievements, GameAchievement } from '@/hooks/useAchievements';
import AchievementGrid from './AchievementGrid';
import AchievementDetails from './AchievementDetails';

// Sample achievement data with locked/mysterious state
const SAMPLE_ACHIEVEMENTS: GameAchievement[] = [
  {
    id: '1',
    icon: '🏃',
    title: 'First Steps',
    description: 'Complete your first workout session',
    progress: 0,
    target: 1,
    earnedDate: null,
    isEarned: false,
    isRevealed: false,
  },
  {
    id: '2',
    icon: '🔥',
    title: 'Streak Master',
    description: 'Complete workouts 7 days in a row',
    progress: 0,
    target: 7,
    earnedDate: null,
    isEarned: false,
    isRevealed: false,
  },
  {
    id: '3',
    icon: '💪',
    title: 'Heavy Lifter',
    description: 'Lift a total of 1000 lbs across all exercises',
    progress: 0,
    target: 1000,
    earnedDate: null,
    isEarned: false,
    isRevealed: false,
  },
  {
    id: '4',
    icon: '⭐',
    title: 'Form Master',
    description: 'Achieve perfect form in 5 different exercises',
    progress: 0,
    target: 5,
    earnedDate: null,
    isEarned: false,
    isRevealed: false,
  },
  {
    id: '5',
    icon: '🏆',
    title: 'Dedication',
    description: 'Complete 30 workouts',
    progress: 0,
    target: 30,
    earnedDate: null,
    isEarned: false,
    isRevealed: false,
  },
  {
    id: '6',
    icon: '🌟',
    title: 'Variety Seeker',
    description: 'Try 10 different exercises',
    progress: 0,
    target: 10,
    earnedDate: null,
    isEarned: false,
    isRevealed: false,
  },
  {
    id: '7',
    icon: '🚀',
    title: 'Overachiever',
    description: 'Exceed your target reps by 50% in a single workout',
    progress: 0,
    target: 1,
    earnedDate: null,
    isEarned: false,
    isRevealed: false,
  },
  {
    id: '8',
    icon: '🔄',
    title: 'Consistency King',
    description: 'Complete the same workout 5 times',
    progress: 0,
    target: 5,
    earnedDate: null,
    isEarned: false,
    isRevealed: false,
  },
  {
    id: '9',
    icon: '📈',
    title: 'Progress Tracker',
    description: 'Log your workouts for 14 consecutive days',
    progress: 0,
    target: 14,
    earnedDate: null,
    isEarned: false,
    isRevealed: false,
  },
];

interface GameAchievementsProps {
  // Optional initial achievements to override the sample data
  initialAchievements?: GameAchievement[];
  // Callback when an achievement is unlocked
  onAchievementUnlocked?: (achievement: GameAchievement) => void;
  // Show reset button for testing (default: false)
  showReset?: boolean;
}

const GameAchievements: React.FC<GameAchievementsProps> = ({
  initialAchievements,
  onAchievementUnlocked,
  showReset = false,
}) => {
  const { achievements, recentlyUnlocked, resetAllAchievements } =
    useAchievements(initialAchievements || SAMPLE_ACHIEVEMENTS);

  const [selectedAchievement, setSelectedAchievement] =
    useState<GameAchievement | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [unlockNotification, setUnlockNotification] =
    useState<GameAchievement | null>(null);
  const [fadeAnim] = useState(new Animated.Value(0));

  // Handle achievement selection
  const handleAchievementPress = (achievement: GameAchievement) => {
    setSelectedAchievement(achievement);
    setShowDetails(true);
  };

  // Close achievement details modal
  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedAchievement(null);
  };

  // Show notification when an achievement is unlocked
  useEffect(() => {
    if (recentlyUnlocked) {
      setUnlockNotification(recentlyUnlocked);

      // Animate notification in and out
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.delay(3000),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setUnlockNotification(null);
      });

      // Notify parent component if callback provided
      if (onAchievementUnlocked) {
        onAchievementUnlocked(recentlyUnlocked);
      }
    }
  }, [recentlyUnlocked]);

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Workout Achievements</Text>
        {showReset && (
          <TouchableOpacity
            style={styles.resetButton}
            onPress={resetAllAchievements}
          >
            <Text style={styles.resetButtonText}>Reset</Text>
          </TouchableOpacity>
        )}
      </View>

      <AchievementGrid
        initialAchievements={achievements}
        onAchievementUnlocked={onAchievementUnlocked}
      />

      <AchievementDetails
        achievement={selectedAchievement}
        visible={showDetails}
        onClose={handleCloseDetails}
      />

      {/* Achievement unlock notification */}
      {unlockNotification && (
        <Animated.View style={[styles.notification, { opacity: fadeAnim }]}>
          <Text style={styles.notificationIcon}>{unlockNotification.icon}</Text>
          <View style={styles.notificationContent}>
            <Text style={styles.notificationTitle}>Achievement Unlocked!</Text>
            <Text style={styles.notificationText}>
              {unlockNotification.title}
            </Text>
          </View>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 15,
    marginTop: 20,
    marginHorizontal: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  title: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resetButton: {
    backgroundColor: 'rgba(231, 76, 60, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  resetButtonText: {
    color: '#e74c3c',
    fontSize: 12,
  },
  notification: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(40, 40, 40, 0.95)',
    borderRadius: 10,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  notificationIcon: {
    fontSize: 30,
    marginRight: 15,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    color: '#e74c3c',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  notificationText: {
    color: 'white',
    fontSize: 14,
  },
});

export default GameAchievements;
