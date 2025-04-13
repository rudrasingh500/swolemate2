import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  Animated,
  StyleSheet,
} from 'react-native';
import { Button } from '@rneui/themed';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import profile_styles from '@/styles/profile_style';
import { Achievement } from '@/types/profile';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define the achievement data structure
interface AchievementData extends Achievement {
  isRevealed: boolean;
  earnedDate: string | null;
}

// Sample achievement data with locked/mysterious state
const SAMPLE_ACHIEVEMENTS: AchievementData[] = [
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

interface WorkoutAchievementsProps {
  // If we want to pass achievements from parent component
  initialAchievements?: AchievementData[];
  // Function to call when an achievement is unlocked
  onAchievementUnlocked?: (achievement: AchievementData) => void;
}

const STORAGE_KEY = 'workout_achievements';

const WorkoutAchievements: React.FC<WorkoutAchievementsProps> = ({
  initialAchievements,
  onAchievementUnlocked,
}) => {
  const [achievements, setAchievements] = useState<AchievementData[]>(
    initialAchievements || SAMPLE_ACHIEVEMENTS,
  );
  const [selectedAchievement, setSelectedAchievement] =
    useState<AchievementData | null>(null);
  const [animation] = useState(new Animated.Value(0));

  // Load achievements from storage on component mount
  useEffect(() => {
    loadAchievements();
  }, []);

  // Save achievements to AsyncStorage whenever they change
  useEffect(() => {
    saveAchievements();
  }, [achievements]);

  const loadAchievements = async () => {
    try {
      const storedAchievements = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedAchievements) {
        setAchievements(JSON.parse(storedAchievements));
      }
    } catch (error) {
      console.error('Failed to load achievements:', error);
    }
  };

  const saveAchievements = async () => {
    try {
      await AsyncStorage.getItem(STORAGE_KEY);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(achievements));
    } catch (error) {
      console.error('Failed to save achievements:', error);
    }
  };

  // Simulate unlocking an achievement (for demo purposes)
  const unlockAchievement = (id: string) => {
    setAchievements((prevAchievements) => {
      const updatedAchievements = prevAchievements.map((achievement) => {
        if (achievement.id === id && !achievement.isEarned) {
          const updated = {
            ...achievement,
            isEarned: true,
            isRevealed: true,
            progress: achievement.target,
            earnedDate: new Date().toISOString(),
          };

          // Trigger animation
          setTimeout(() => {
            animateUnlock();
            if (onAchievementUnlocked) {
              onAchievementUnlocked(updated);
            }
          }, 100);

          return updated;
        }
        return achievement;
      });
      return updatedAchievements;
    });
  };

  const animateUnlock = () => {
    Animated.sequence([
      Animated.timing(animation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(animation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeAchievementModal = () => {
    setSelectedAchievement(null);
  };

  // Reset all achievements (for testing)
  const resetAchievements = async () => {
    const resetData = SAMPLE_ACHIEVEMENTS.map((achievement) => ({
      ...achievement,
      isEarned: false,
      isRevealed: false,
      progress: 0,
      earnedDate: null,
    }));
    setAchievements(resetData);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(resetData));
  };

  return (
    <>
      <View style={styles.achievementsContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.achievementsTitle}>Workout Achievements</Text>
          {/* For demo purposes - allows testing the unlock animation */}
          <TouchableOpacity
            style={styles.resetButton}
            onPress={resetAchievements}
          >
            <Text style={styles.resetButtonText}>Reset</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.achievementsGrid}>
          {achievements.map((achievement) => (
            <TouchableOpacity
              key={achievement.id}
              style={[
                styles.achievementCard,
                achievement.isEarned ? styles.earnedAchievement : {},
              ]}
              onPress={() => {
                setSelectedAchievement(achievement);
                // For demo purposes - tapping a locked achievement will unlock it
                if (!achievement.isEarned) {
                  unlockAchievement(achievement.id);
                }
              }}
            >
              {achievement.isRevealed ? (
                <Animated.View
                  style={[
                    styles.achievementContent,
                    achievement.id === selectedAchievement?.id &&
                    achievement.isEarned
                      ? {
                          transform: [
                            {
                              scale: animation.interpolate({
                                inputRange: [0, 1],
                                outputRange: [1, 1.2],
                              }),
                            },
                          ],
                        }
                      : {},
                  ]}
                >
                  <Text style={styles.achievementIcon}>{achievement.icon}</Text>
                  <Text style={styles.achievementTitle}>
                    {achievement.title}
                  </Text>
                  <Text style={styles.achievementDesc}>
                    {achievement.description}
                  </Text>
                  <Text
                    style={{
                      color: achievement.isEarned ? '#e74c3c' : '#a0a0a0',
                      fontSize: 10,
                      marginTop: 5,
                      textAlign: 'center',
                    }}
                  >
                    {achievement.isEarned
                      ? 'Completed'
                      : `${achievement.progress}/${achievement.target}`}
                  </Text>
                </Animated.View>
              ) : (
                <View style={styles.mysteriousContainer}>
                  <BlurView intensity={80} style={styles.blurContainer}>
                    <Text style={styles.mysteriousIcon}>?</Text>
                    <Text style={styles.mysteriousText}>
                      Mysterious Achievement
                    </Text>
                  </BlurView>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <Modal
        visible={selectedAchievement !== null}
        transparent={true}
        animationType="fade"
        onRequestClose={closeAchievementModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedAchievement && (
              <>
                {selectedAchievement.isRevealed ? (
                  <>
                    <Text style={styles.modalIcon}>
                      {selectedAchievement.icon}
                    </Text>
                    <Text style={styles.modalTitle}>
                      {selectedAchievement.title}
                    </Text>
                    <Text style={styles.modalDescription}>
                      {selectedAchievement.description}
                    </Text>
                    <Text style={styles.modalDate}>
                      {selectedAchievement.isEarned
                        ? `Earned: ${new Date(selectedAchievement.earnedDate!).toLocaleDateString()}`
                        : 'Not yet earned'}
                    </Text>
                    <Text style={styles.modalProgress}>
                      Progress: {selectedAchievement.progress}/
                      {selectedAchievement.target}
                    </Text>
                  </>
                ) : (
                  <>
                    <Text style={styles.modalIcon}>?</Text>
                    <Text style={styles.modalTitle}>
                      Mysterious Achievement
                    </Text>
                    <Text style={styles.modalDescription}>
                      Keep working out to discover this achievement!
                    </Text>
                  </>
                )}
                <Button
                  title="Close"
                  onPress={closeAchievementModal}
                  buttonStyle={styles.modalCloseButton}
                  titleStyle={styles.modalCloseButtonText}
                />
              </>
            )}
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  achievementsContainer: {
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
  achievementsTitle: {
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
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  achievementCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    padding: 12,
    width: '31%',
    aspectRatio: 0.9,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  earnedAchievement: {
    backgroundColor: 'rgba(231, 76, 60, 0.2)',
  },
  achievementContent: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  achievementIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  achievementTitle: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 4,
  },
  achievementDesc: {
    color: '#e0e0e0',
    fontSize: 12,
    textAlign: 'center',
  },
  mysteriousContainer: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  blurContainer: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  mysteriousIcon: {
    fontSize: 28,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  mysteriousText: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 10,
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  modalContent: {
    backgroundColor: 'rgba(40, 40, 40, 0.95)',
    borderRadius: 15,
    padding: 25,
    width: '80%',
    alignItems: 'center',
  },
  modalIcon: {
    fontSize: 48,
    marginBottom: 15,
  },
  modalTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalDescription: {
    color: '#e0e0e0',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 15,
  },
  modalDate: {
    color: '#e74c3c',
    fontSize: 14,
    marginBottom: 5,
  },
  modalProgress: {
    color: '#e0e0e0',
    fontSize: 14,
    marginBottom: 20,
  },
  modalCloseButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  modalCloseButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default WorkoutAchievements;
