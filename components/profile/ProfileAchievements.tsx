import { View, TouchableOpacity, Modal } from 'react-native';
import { Text, Button } from '@rneui/themed';
import { useState } from 'react';
import profile_styles from '@/styles/profile_style';

interface Achievement {
  id: number;
  icon: string;
  title: string;
  description: string;
  earnedDate?: string;
  progress?: string;
}

interface ProfileAchievementsProps {
  achievements: Achievement[];
}

export default function ProfileAchievements({ achievements }: ProfileAchievementsProps) {
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);

  const closeAchievementModal = () => {
    setSelectedAchievement(null);
  };

  return (
    <>
      <View style={profile_styles.achievementsContainer}>
        <Text h4 style={profile_styles.achievementsTitle}>Achievements</Text>
        <View style={profile_styles.achievementsGrid}>
          {achievements.map((achievement) => (
            <TouchableOpacity
              key={achievement.id}
              style={profile_styles.achievementCard}
              onPress={() => setSelectedAchievement(achievement)}
            >
              <Text style={profile_styles.achievementIcon}>{achievement.icon}</Text>
              <Text style={profile_styles.achievementTitle}>{achievement.title}</Text>
              <Text style={profile_styles.achievementDesc}>{achievement.description}</Text>
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
        <View style={profile_styles.modalContainer}>
          <View style={profile_styles.modalContent}>
            {selectedAchievement && (
              <>
                <Text style={profile_styles.modalIcon}>{selectedAchievement.icon}</Text>
                <Text style={profile_styles.modalTitle}>{selectedAchievement.title}</Text>
                <Text style={profile_styles.modalDescription}>{selectedAchievement.description}</Text>
                <Text style={profile_styles.modalDate}>Earned: {selectedAchievement.earnedDate}</Text>
                <Text style={profile_styles.modalProgress}>Progress: {selectedAchievement.progress}</Text>
                <Button
                  title="Close"
                  onPress={closeAchievementModal}
                  buttonStyle={profile_styles.modalCloseButton}
                  titleStyle={profile_styles.modalCloseButtonText}
                />
              </>
            )}
          </View>
        </View>
      </Modal>
    </>
  );
}