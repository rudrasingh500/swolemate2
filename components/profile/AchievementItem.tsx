import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { GameAchievement } from '@/hooks/useAchievements';

interface AchievementItemProps {
  achievement: GameAchievement;
  onPress: () => void;
  isAnimating: boolean;
  animationValue: Animated.Value;
  width?: number;
}

const AchievementItem: React.FC<AchievementItemProps> = ({
  achievement,
  onPress,
  isAnimating,
  animationValue,
  width,
}) => {
  const itemStyle = {
    width: width || '31%',
    aspectRatio: 0.9,
  };

  const animatedStyle = isAnimating
    ? {
        transform: [
          {
            scale: animationValue.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 1.2],
            }),
          },
        ],
        backgroundColor: animationValue.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [
            'rgba(231, 76, 60, 0.2)',
            'rgba(231, 76, 60, 0.6)',
            'rgba(231, 76, 60, 0.2)',
          ],
        }),
      }
    : {};

  return (
    <TouchableOpacity
      style={[
        styles.achievementCard,
        itemStyle,
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
          </>
        ) : (
          <View style={styles.mysteriousContainer}>
            <BlurView intensity={80} style={styles.blurContainer}>
              <Text style={styles.mysteriousIcon}>?</Text>
              <Text style={styles.mysteriousText}>Mysterious Achievement</Text>
            </BlurView>
          </View>
        )}
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  achievementCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    padding: 12,
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
    color: 'white',
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
});

export default AchievementItem;
