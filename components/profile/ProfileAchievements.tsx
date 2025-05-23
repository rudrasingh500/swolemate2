/*
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { Button } from '@rneui/themed';
import profile_styles from '@/styles/profile_style'; // Assuming this contains relevant styles
import { Achievement } from '@/types/profile';

interface ProfileAchievementsProps {
  achievements: Achievement[];
}

export default function ProfileAchievements({ achievements }: ProfileAchievementsProps) {
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);

  const closeAchievementModal = () => {
    setSelectedAchievement(null);
  };

  return (
    <View style={profile_styles.achievementsContainer}>
      <Text h4 style={profile_styles.achievementsTitle}>Achievements</Text>
      <View style={profile_styles.achievementsGrid}>
        {achievements.map((achievement) => (
          <TouchableOpacity
            key={achievement.id}
            style={[
              profile_styles.achievementCard,
              achievement.isEarned ? { backgroundColor: 'rgba(231, 76, 60, 0.2)' } : {}
            ]}
            onPress={() => setSelectedAchievement(achievement)}
          >
            <Text style={profile_styles.achievementIcon}>{achievement.icon}</Text>
            <Text style={profile_styles.achievementTitle}>{achievement.title}</Text>
            <Text style={profile_styles.achievementDesc}>{achievement.description}</Text>
            <View style={profile_styles.progressBarContainer}>
              <View
                style={[
                  profile_styles.progressBar,
                  {
                    width: `${achievement.isEarned ? 100 : (achievement.progress / achievement.target) * 100}%`,
                    backgroundColor: achievement.isEarned ? '#e74c3c' : '#a0a0a0',
                  },
                ]}
              />
            </View>
            <Text style={profile_styles.progressText}>
              {achievement.isEarned ? 'Completed' : `${achievement.progress}/${achievement.target}`}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Modal for displaying achievement details */}
      <Modal
        visible={selectedAchievement !== null}
        transparent={true}
        animationType="fade"
        onRequestClose={closeAchievementModal}
      >
        <View style={profile_styles.modalOverlay}>
          <View style={profile_styles.modalContent}>
            {selectedAchievement && (
              <ScrollView>
                <Text style={profile_styles.modalIcon}>{selectedAchievement.icon}</Text>
                <Text style={profile_styles.modalTitle}>{selectedAchievement.title}</Text>
                <Text style={profile_styles.modalDescription}>{selectedAchievement.description}</Text>
                <Text style={profile_styles.modalDate}>Earned: {selectedAchievement.isEarned ? selectedAchievement.earnedDate : 'Not yet earned'}</Text>
                <Text style={profile_styles.modalProgress}>Progress: {selectedAchievement.progress}/{selectedAchievement.target}</Text>
                <Button
                  title="Close"
                  onPress={closeAchievementModal}
                  buttonStyle={profile_styles.modalCloseButton}
                />
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}
*/