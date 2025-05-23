/*
import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, FlatList, Dimensions } from 'react-native';
import { useAchievements, GameAchievement } from '@/hooks/useAchievements';
import AchievementItem from './AchievementItem';

interface AchievementGridProps {
  initialAchievements?: GameAchievement[];
  onAchievementUnlocked?: (achievement: GameAchievement) => void;
  onAchievementPress: (achievement: GameAchievement) => void; // Callback for when an item is pressed
}

const AchievementGrid: React.FC<AchievementGridProps> = ({
  initialAchievements,
  onAchievementUnlocked,
  onAchievementPress,
}) => {
  const {
    achievements,
    unlockAchievement, // We might still need this if tapping unlocks
    recentlyUnlocked,
    clearRecentlyUnlocked,
  } = useAchievements(initialAchievements);

  const [numColumns, setNumColumns] = useState(2); // Default to 2 columns
  const animationValues = useRef<{[key: string]: Animated.Value}>({});

  // Calculate number of columns based on screen width
  useEffect(() => {
    const screenWidth = Dimensions.get('window').width;
    const itemWidth = 150; // Approximate width of an achievement item
    const calculatedNumColumns = Math.floor(screenWidth / itemWidth);
    setNumColumns(Math.max(2, calculatedNumColumns)); // Ensure at least 2 columns
  }, []);

  // Initialize animation values for each achievement
  useEffect(() => {
    achievements.forEach(ach => {
      if (!animationValues.current[ach.id]) {
        animationValues.current[ach.id] = new Animated.Value(0);
      }
    });
  }, [achievements]);

  // Handle animation when an achievement is unlocked
  useEffect(() => {
    if (recentlyUnlocked) {
      const animValue = animationValues.current[recentlyUnlocked.id];
      if (animValue) {
        Animated.sequence([
          Animated.timing(animValue, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.delay(1000),
          Animated.timing(animValue, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start(() => {
          if (onAchievementUnlocked) {
            onAchievementUnlocked(recentlyUnlocked);
          }
          clearRecentlyUnlocked(); // Clear after animation and callback
        });
      }
    }
  }, [recentlyUnlocked, onAchievementUnlocked, clearRecentlyUnlocked]);

  const renderItem = ({ item }: { item: GameAchievement }) => (
    <AchievementItem
      achievement={item}
      onPress={() => onAchievementPress(item)} // Use the passed callback
      isAnimating={recentlyUnlocked?.id === item.id}
    />
  );

  return (
    <FlatList
      data={achievements}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      numColumns={numColumns}
      columnWrapperStyle={styles.row}
      contentContainerStyle={styles.gridContainer}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  gridContainer: {
    paddingHorizontal: 5,
  },
  row: {
    justifyContent: 'space-around',
    marginBottom: 10,
  },
});

export default AchievementGrid;
*/
