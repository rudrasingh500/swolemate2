import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { useAchievements, GameAchievement } from '@/hooks/useAchievements';
import AchievementItem from './AchievementItem';

interface AchievementGridProps {
  initialAchievements?: GameAchievement[];
  onAchievementUnlocked?: (achievement: GameAchievement) => void;
  columns?: number;
}

const AchievementGrid: React.FC<AchievementGridProps> = ({
  initialAchievements,
  onAchievementUnlocked,
  columns = 3,
}) => {
  const {
    achievements,
    recentlyUnlocked,
    unlockAchievement,
    clearRecentlyUnlocked,
    resetAllAchievements,
  } = useAchievements(initialAchievements);

  const [selectedAchievement, setSelectedAchievement] =
    useState<GameAchievement | null>(null);
  const [unlockAnimation] = useState(new Animated.Value(0));
  const screenWidth = Dimensions.get('window').width;
  const itemWidth = (screenWidth - 40 - (columns - 1) * 10) / columns; // 40 for horizontal margins, 10 for gap

  // Handle achievement selection
  const handleAchievementPress = (achievement: GameAchievement) => {
    setSelectedAchievement(achievement);

    // For demo purposes - tapping a locked achievement will unlock it
    if (!achievement.isEarned) {
      unlockAchievement(achievement.id);
    }
  };

  // Handle animation when an achievement is unlocked
  useEffect(() => {
    if (recentlyUnlocked) {
      Animated.sequence([
        Animated.timing(unlockAnimation, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(unlockAnimation, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Notify parent component if callback provided
      if (onAchievementUnlocked) {
        onAchievementUnlocked(recentlyUnlocked);
      }

      // Clear the recently unlocked achievement after animation
      setTimeout(() => {
        clearRecentlyUnlocked();
      }, 1000);
    }
  }, [recentlyUnlocked]);

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {achievements.map((achievement) => (
          <AchievementItem
            key={achievement.id}
            achievement={achievement}
            onPress={() => handleAchievementPress(achievement)}
            isAnimating={recentlyUnlocked?.id === achievement.id}
            animationValue={unlockAnimation}
            width={itemWidth}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
});

export default AchievementGrid;
