/*
import React, { useState } from 'react';
import {
  View,
  ScrollView,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  Text,
} from 'react-native';
import { Button } from '@rneui/themed';
import GameAchievements from '@/components/profile/GameAchievements';
import { GameAchievement } from '@/hooks/useAchievements';
import profile_styles from '@/styles/profile_style';

export default function AchievementsScreen() {
  const [lastUnlocked, setLastUnlocked] = useState<GameAchievement | null>(
    null,
  );

  const handleAchievementUnlocked = (achievement: GameAchievement) => {
    setLastUnlocked(achievement);
    // In a real app, you might want to save this to a database or trigger other actions
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../assets/images/background.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
          >
            <View style={styles.headerContainer}>
              <Text style={styles.headerTitle}>Workout Achievements</Text>
              <Text style={styles.headerSubtitle}>
                Complete workouts to unlock mysterious achievements and track
                your fitness journey!
              </Text>
            </View>

            <GameAchievements
              onAchievementUnlocked={handleAchievementUnlocked}
              showReset={true} // For demo purposes
            />

            {lastUnlocked && (
              <View style={styles.lastUnlockedContainer}>
                <Text style={styles.lastUnlockedTitle}>Last Unlocked:</Text>
                <View style={styles.achievementInfo}>
                  <Text style={styles.achievementIcon}>
                    {lastUnlocked.icon}
                  </Text>
                  <View style={styles.achievementTextContainer}>
                    <Text style={styles.achievementTitle}>
                      {lastUnlocked.title}
                    </Text>
                    <Text style={styles.achievementDesc}>
                      {lastUnlocked.description}
                    </Text>
                  </View>
                </View>
              </View>
            )}

            <View style={styles.infoContainer}>
              <Text style={styles.infoTitle}>How It Works</Text>
              <Text style={styles.infoText}>
                • Achievements start clouded and mysterious
              </Text>
              <Text style={styles.infoText}>
                • Complete specific workout goals to reveal them
              </Text>
              <Text style={styles.infoText}>
                • Tap on any achievement to see more details
              </Text>
              <Text style={styles.infoText}>
                • For this demo, tap on a clouded achievement to simulate
                unlocking it
              </Text>
            </View>
          </ScrollView>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  ...profile_styles,
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingTop: 20,
  },
  scrollView: {
    flex: 1,
  },
  headerContainer: {
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 20,
    borderRadius: 15,
    marginBottom: 20,
  },
  headerTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  headerSubtitle: {
    color: '#e0e0e0',
    fontSize: 16,
  },
  lastUnlockedContainer: {
    backgroundColor: 'rgba(231, 76, 60, 0.2)',
    borderRadius: 10,
    padding: 15,
    marginTop: 20,
    marginHorizontal: 20,
  },
  lastUnlockedTitle: {
    color: '#e74c3c',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  achievementInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  achievementIcon: {
    fontSize: 30,
    marginRight: 15,
  },
  achievementTextContainer: {
    flex: 1,
  },
  achievementTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 5,
  },
  achievementDesc: {
    color: '#e0e0e0',
    fontSize: 14,
  },
  infoContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 15,
    marginTop: 20,
    marginHorizontal: 20,
    marginBottom: 30,
  },
  infoTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  infoText: {
    color: '#e0e0e0',
    fontSize: 14,
    marginBottom: 8,
  },
});
*/
