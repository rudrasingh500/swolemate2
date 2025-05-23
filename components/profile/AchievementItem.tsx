/*
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';
import { GameAchievement } from '@/hooks/useAchievements';

interface AchievementItemProps {
  achievement: GameAchievement;
  onPress: () => void;
  isAnimating?: boolean; // To trigger animation when unlocked
}

const AchievementItem: React.FC<AchievementItemProps> = ({
  achievement,
  onPress,
  isAnimating = false,
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isAnimating) {
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.ease),
          useNativeDriver: false, // Using native driver for scale/opacity can be complex
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 300,
          delay: 1000, // Hold the animated state for a bit
          easing: Easing.in(Easing.ease),
          useNativeDriver: false,
        }),
      ]).start();
    }
  }, [isAnimating, animatedValue]);

  const animatedStyle = {
    transform: [
      {
        scale: animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 1.1],
        }),
      },
    ],
    opacity: animatedValue.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [1, 0.7, 1],
    }),
  };

  return (
    <TouchableOpacity
      style={[
        styles.achievementCard,
        achievement.isRevealed ? {} : styles.mysteriousCard,
        achievement.isEarned ? styles.earnedAchievement : {},
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Animated.View style={[styles.achievementContent, animatedStyle]}>
        {achievement.isRevealed ? (
          <>
            <Text style={styles.achievementIcon}>{achievement.icon}</Text>
            <Text style={styles.achievementTitle}>{achievement.title}</Text>
            <Text style={styles.achievementDesc}>
              {achievement.description}
            </Text>
            <View style={styles.progressBarContainer}>
              <View
                style={[
                  styles.progressBar,
                  {
                    width: `${achievement.isEarned ? 100 : (achievement.progress / achievement.target) * 100}%`,
                    backgroundColor: achievement.isEarned ? '#e74c3c' : '#a0a0a0',
                  },
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              {achievement.isEarned
                ? 'Completed'
                : `${achievement.progress}/${achievement.target}`}
            </Text>
          </>
        ) : (
          <>
            <Text style={styles.mysteriousIcon}>?</Text>
            <Text style={styles.mysteriousText}>Mysterious Achievement</Text>
          </>
        )}
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  achievementCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 15,
    margin: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: '45%', // Adjust for 2 columns
    aspectRatio: 1, // Make it square
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  earnedAchievement: {
    borderColor: '#e74c3c',
    borderWidth: 1,
  },
  achievementContent: {
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  achievementIcon: {
    fontSize: 30,
    color: '#e74c3c',
    marginBottom: 8,
  },
  achievementTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 4,
  },
  achievementDesc: {
    fontSize: 10,
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 8,
  },
  progressBarContainer: {
    height: 5,
    width: '80%',
    backgroundColor: '#555',
    borderRadius: 2.5,
    marginBottom: 4,
  },
  progressBar: {
    height: '100%',
    borderRadius: 2.5,
  },
  progressText: {
    fontSize: 10,
    color: '#aaa',
  },
  mysteriousCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  mysteriousIcon: {
    fontSize: 40,
    color: '#777',
    marginBottom: 10,
  },
  mysteriousText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});

export default AchievementItem;
*/
