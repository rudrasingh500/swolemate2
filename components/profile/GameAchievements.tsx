/*
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Animated,
  Easing,
} from 'react-native';
import { useAchievements, GameAchievement } from '@/hooks/useAchievements';
import AchievementGrid from './AchievementGrid';
import AchievementDetails from './AchievementDetails';
import { Button } from '@rneui/themed'; // For the reset button

// Sample achievement data with locked/mysterious state
const SAMPLE_ACHIEVEMENTS: GameAchievement[] = [
  {
    id: '1',
    icon: '🔥',
    title: 'First Steps',
    description: 'Complete your first workout session.',
    isEarned: false,
    isRevealed: false,
    progress: 0,
    target: 1,
    earnedDate: null,
    criteria: { type: 'workout_completed', count: 1 },
  },
  {
    id: '2',
    icon: '🚀',
    title: 'Dedication',
    description: 'Complete 5 workout sessions.',
    isEarned: false,
    isRevealed: false,
    progress: 0,
    target: 5,
    earnedDate: null,
    criteria: { type: 'workout_completed', count: 5 },
  },
  {
    id: '3',
    icon: '⭐',
    title: 'Streak Master',
    description: 'Maintain a 7-day workout streak.',
    isEarned: false,
    isRevealed: false,
    progress: 0,
    target: 7,
    earnedDate: null,
    criteria: { type: 'workout_streak', days: 7 },
  },
  {
    id: '4',
    icon: '🎯',
    title: 'Form Master',
    description: 'Achieve a good form score 3 times.',
    isEarned: false,
    isRevealed: false,
    progress: 0,
    target: 3,
    earnedDate: null,
    criteria: { type: 'form_score_achieved', minScore: 80, count: 3 },
  },
  {
    id: '5',
    icon: '🏋️',
    title: 'Heavy Lifter',
    description: 'Lift a total of 1000kg.',
    isEarned: false,
    isRevealed: false,
    progress: 0,
    target: 1000,
    earnedDate: null,
    criteria: { type: 'total_weight_lifted', amount: 1000 },
  },
  {
    id: '6',
    icon: '🏆',
    title: 'Champion',
    description: 'Unlock all other achievements.',
    isEarned: false,
    isRevealed: false,
    progress: 0,
    target: 4, // Assuming 4 other base achievements
    earnedDate: null,
    criteria: { type: 'all_achievements_unlocked', excludeIds: ['6'] },
  },
  {
    id: '7',
    icon: '💡',
    title: 'Explorer',
    description: 'Try 5 different types of exercises.',
    isEarned: false,
    isRevealed: false,
    progress: 0,
    target: 5,
    earnedDate: null,
    criteria: { type: 'exercise_variety', count: 5 },
  },
  {
    id: '8',
    icon: '⏳',
    title: 'Time Lord',
    description: 'Log 10 hours of workout time.',
    isEarned: false,
    isRevealed: false,
    progress: 0,
    target: 600, // in minutes
    earnedDate: null,
    criteria: { type: 'total_workout_time', minutes: 600 },
  },
];

interface GameAchievementsProps {
  // Optional initial achievements to override the sample data
  initialAchievements?: GameAchievement[];
  // Callback when an achievement is unlocked
  onAchievementUnlocked?: (achievement: GameAchievement) => void;
  // Show reset button (for demo/testing)
  showReset?: boolean;
}

const GameAchievements: React.FC<GameAchievementsProps> = ({
  initialAchievements,
  onAchievementUnlocked,
  showReset = false,
}) => {
  const {
    achievements,
    unlockAchievement,
    recentlyUnlocked,
    clearRecentlyUnlocked,
    resetAllAchievements,
  } = useAchievements(initialAchievements || SAMPLE_ACHIEVEMENTS);

  const [selectedAchievement, setSelectedAchievement] =
    useState<GameAchievement | null>(null);
  const [notificationVisible, setNotificationVisible] = useState(false);
  const [notifiedAchievement, setNotifiedAchievement] =
    useState<GameAchievement | null>(null);

  const notificationAnim = useRef(new Animated.Value(0)).current;

  // Handle achievement selection
  const handleAchievementPress = (achievement: GameAchievement) => {
    setSelectedAchievement(achievement);
    // For demo: if a locked achievement is pressed, unlock it
    if (!achievement.isEarned && onAchievementUnlocked) {
      unlockAchievement(achievement.id);
    }
  };

  // Close achievement details modal
  const handleCloseDetails = () => {
    setSelectedAchievement(null);
  };

  // Show notification when an achievement is unlocked
  useEffect(() => {
    if (recentlyUnlocked && recentlyUnlocked.id !== notifiedAchievement?.id) {
      setNotifiedAchievement(recentlyUnlocked);
      setNotificationVisible(true);
      Animated.sequence([
        Animated.timing(notificationAnim, {
          toValue: 1,
          duration: 500,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.delay(2000),
        Animated.timing(notificationAnim, {
          toValue: 0,
          duration: 500,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
      ]).start(() => {
        setNotificationVisible(false);
        clearRecentlyUnlocked(); // Clear after animation
        if (onAchievementUnlocked) {
          onAchievementUnlocked(recentlyUnlocked);
        }
      });
    }
  }, [recentlyUnlocked, onAchievementUnlocked, clearRecentlyUnlocked, notifiedAchievement, notificationAnim]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Workout Achievements</Text>
      {showReset && (
        <Button
          title="Reset Achievements (Demo)"
          onPress={resetAllAchievements}
          type="outline"
          buttonStyle={styles.resetButton}
          titleStyle={styles.resetButtonText}
        />
      )}
      <AchievementGrid
        initialAchievements={achievements} // Pass the hook's achievements
        onAchievementUnlocked={onAchievementUnlocked} // Pass down the callback
        onAchievementPress={handleAchievementPress} // Pass down the press handler
      />
      <AchievementDetails
        achievement={selectedAchievement}
        onClose={handleCloseDetails}
      />

      {/* Achievement unlock notification */}
      {notificationVisible && notifiedAchievement && (
        <Animated.View
          style={[
            styles.notificationContainer,
            {
              transform: [
                {
                  translateY: notificationAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-100, 20], // Animate from top
                  }),
                },
              ],
              opacity: notificationAnim,
            },
          ]}
        >
          <Text style={styles.notificationTitle}>Achievement Unlocked!</Text>
          <View style={styles.notificationContent}>
            <Text style={styles.notificationIcon}>{notifiedAchievement.icon}</Text>
            <Text style={styles.notificationText}>{notifiedAchievement.title}</Text>
          </View>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 15,
  },
  resetButton: {
    borderColor: '#e74c3c',
    borderWidth: 1,
    marginBottom: 15,
    alignSelf: 'center',
  },
  resetButtonText: {
    color: '#e74c3c',
  },
  notificationContainer: {
    position: 'absolute',
    top: 0, // Adjust as needed, e.g., below a status bar
    left: 20,
    right: 20,
    backgroundColor: 'rgba(46, 204, 113, 0.9)', // Greenish success color
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    zIndex: 1000, // Ensure it's on top
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
    textAlign: 'center',
  },
  notificationContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  notificationText: {
    fontSize: 14,
    color: 'white',
  },
});

export default GameAchievements;
*/
