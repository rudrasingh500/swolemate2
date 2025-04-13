import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Achievement } from '@/types/profile';

// Extended Achievement type with revealed state
export interface GameAchievement extends Achievement {
  isRevealed: boolean;
}

// Achievement criteria types
export type AchievementCriteria = {
  type:
    | 'workout_count'
    | 'streak'
    | 'exercise_variety'
    | 'weight_total'
    | 'perfect_form'
    | 'custom';
  target: number;
  currentValue: number;
  checkFn?: (data: any) => boolean; // For custom achievement checks
};

// Achievement trigger data
export type AchievementTriggerData = {
  workoutCompleted?: boolean;
  workoutData?: any;
  exerciseData?: any;
  formScore?: number;
};

const STORAGE_KEY = 'game_achievements';

export const useAchievements = (initialAchievements?: GameAchievement[]) => {
  const [achievements, setAchievements] = useState<GameAchievement[]>(
    initialAchievements || [],
  );
  const [loading, setLoading] = useState(true);
  const [recentlyUnlocked, setRecentlyUnlocked] =
    useState<GameAchievement | null>(null);

  // Load achievements from storage on hook initialization
  useEffect(() => {
    loadAchievements();
  }, []);

  // Save achievements to storage whenever they change
  useEffect(() => {
    if (!loading && achievements.length > 0) {
      saveAchievements();
    }
  }, [achievements, loading]);

  // Load achievements from AsyncStorage
  const loadAchievements = async () => {
    try {
      const storedAchievements = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedAchievements) {
        setAchievements(JSON.parse(storedAchievements));
      }
      setLoading(false);
    } catch (error) {
      console.error('Failed to load achievements:', error);
      setLoading(false);
    }
  };

  // Save achievements to AsyncStorage
  const saveAchievements = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(achievements));
    } catch (error) {
      console.error('Failed to save achievements:', error);
    }
  };

  // Check if an achievement should be unlocked based on criteria
  const checkAchievementUnlock = (
    achievement: GameAchievement,
    criteria: AchievementCriteria,
  ): boolean => {
    if (achievement.isEarned) return false;

    // Check if the current value meets or exceeds the target
    const isUnlocked = criteria.currentValue >= criteria.target;

    // For custom criteria, use the provided check function
    if (criteria.type === 'custom' && criteria.checkFn) {
      return criteria.checkFn(criteria.currentValue);
    }

    return isUnlocked;
  };

  // Update achievement progress
  const updateAchievementProgress = (
    achievementId: string,
    newProgress: number,
  ) => {
    setAchievements((prevAchievements) => {
      return prevAchievements.map((achievement) => {
        if (achievement.id === achievementId) {
          // Only update if the new progress is greater than current progress
          if (newProgress > achievement.progress) {
            const isNowEarned = newProgress >= achievement.target;

            // If achievement is now earned and wasn't before, set it as recently unlocked
            if (isNowEarned && !achievement.isEarned) {
              setRecentlyUnlocked({
                ...achievement,
                progress: newProgress,
                isEarned: true,
                isRevealed: true,
                earnedDate: new Date().toISOString(),
              });
            }

            return {
              ...achievement,
              progress: newProgress,
              isEarned: isNowEarned,
              isRevealed: achievement.isRevealed || isNowEarned,
              earnedDate:
                isNowEarned && !achievement.isEarned
                  ? new Date().toISOString()
                  : achievement.earnedDate,
            };
          }
        }
        return achievement;
      });
    });
  };

  // Process achievement triggers based on user actions
  const processAchievementTriggers = (triggerData: AchievementTriggerData) => {
    // Process each achievement based on the trigger data
    achievements.forEach((achievement) => {
      if (achievement.isEarned) return; // Skip already earned achievements

      // Example: Check for workout completion achievement
      if (triggerData.workoutCompleted) {
        // First workout achievement
        if (achievement.title === 'First Steps') {
          updateAchievementProgress(achievement.id, achievement.progress + 1);
        }

        // Workout count achievements
        if (achievement.title === 'Dedication') {
          updateAchievementProgress(achievement.id, achievement.progress + 1);
        }
      }

      // Example: Check for streak achievements
      if (
        triggerData.workoutData?.streakDays &&
        achievement.title === 'Streak Master'
      ) {
        updateAchievementProgress(
          achievement.id,
          triggerData.workoutData.streakDays,
        );
      }

      // Example: Check for form-related achievements
      if (
        triggerData.formScore &&
        triggerData.formScore >= 95 &&
        achievement.title === 'Form Master'
      ) {
        // Track unique exercises with perfect form
        const exerciseName = triggerData.exerciseData?.name;
        if (exerciseName) {
          // We would need to track which exercises already have perfect form
          // This is simplified for the example
          updateAchievementProgress(achievement.id, achievement.progress + 1);
        }
      }

      // Add more achievement checks based on your game design
    });
  };

  // Manually reveal an achievement (for testing or special cases)
  const revealAchievement = (achievementId: string) => {
    setAchievements((prevAchievements) => {
      return prevAchievements.map((achievement) => {
        if (achievement.id === achievementId) {
          return {
            ...achievement,
            isRevealed: true,
          };
        }
        return achievement;
      });
    });
  };

  // Manually unlock an achievement (for testing or special cases)
  const unlockAchievement = (achievementId: string) => {
    setAchievements((prevAchievements) => {
      return prevAchievements.map((achievement) => {
        if (achievement.id === achievementId && !achievement.isEarned) {
          const updatedAchievement = {
            ...achievement,
            isEarned: true,
            isRevealed: true,
            progress: achievement.target,
            earnedDate: new Date().toISOString(),
          };

          setRecentlyUnlocked(updatedAchievement);
          return updatedAchievement;
        }
        return achievement;
      });
    });
  };

  // Clear the recently unlocked achievement
  const clearRecentlyUnlocked = () => {
    setRecentlyUnlocked(null);
  };

  // Reset all achievements (for testing)
  const resetAllAchievements = async () => {
    const resetData = achievements.map((achievement) => ({
      ...achievement,
      isEarned: false,
      isRevealed: false,
      progress: 0,
      earnedDate: null,
    }));

    setAchievements(resetData);
    setRecentlyUnlocked(null);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(resetData));
  };

  return {
    achievements,
    loading,
    recentlyUnlocked,
    updateAchievementProgress,
    processAchievementTriggers,
    revealAchievement,
    unlockAchievement,
    clearRecentlyUnlocked,
    resetAllAchievements,
  };
};
