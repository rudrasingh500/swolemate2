import React from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import { Button } from '@rneui/themed';
import { GameAchievement } from '@/hooks/useAchievements';

interface AchievementDetailsProps {
  achievement: GameAchievement | null;
  visible: boolean;
  onClose: () => void;
}

const AchievementDetails: React.FC<AchievementDetailsProps> = ({
  achievement,
  visible,
  onClose,
}) => {
  if (!achievement) return null;

  // Determine difficulty level based on target value
  const getDifficultyLevel = () => {
    if (!achievement) return 'Unknown';

    if (achievement.target <= 1) return 'Easy';
    if (achievement.target <= 5) return 'Medium';
    if (achievement.target <= 10) return 'Hard';
    return 'Legendary';
  };

  // Format date for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not yet earned';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {achievement.isRevealed ? (
            <>
              <Text style={styles.modalIcon}>{achievement.icon}</Text>
              <Text style={styles.modalTitle}>{achievement.title}</Text>
              <Text style={styles.modalDescription}>
                {achievement.description}
              </Text>

              <View style={styles.detailsContainer}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Status:</Text>
                  <Text
                    style={[
                      styles.detailValue,
                      achievement.isEarned
                        ? styles.earnedText
                        : styles.notEarnedText,
                    ]}
                  >
                    {achievement.isEarned ? 'Unlocked' : 'Locked'}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Difficulty:</Text>
                  <Text style={styles.detailValue}>{getDifficultyLevel()}</Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Unlocked:</Text>
                  <Text style={styles.detailValue}>
                    {formatDate(achievement.earnedDate)}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Progress:</Text>
                  <Text style={styles.detailValue}>
                    {achievement.progress}/{achievement.target}
                  </Text>
                </View>
              </View>
            </>
          ) : (
            <>
              <Text style={styles.modalIcon}>?</Text>
              <Text style={styles.modalTitle}>Mysterious Achievement</Text>
              <Text style={styles.modalDescription}>
                Keep working out to discover this achievement!
              </Text>
              <Text style={styles.mysteryHint}>
                Some achievements are revealed through specific workout
                activities. Try different exercises and maintain your streak to
                unlock more achievements!
              </Text>
            </>
          )}

          <Button
            title="Close"
            onPress={onClose}
            buttonStyle={styles.closeButton}
            titleStyle={styles.closeButtonText}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
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
    width: '85%',
    alignItems: 'center',
  },
  modalIcon: {
    fontSize: 48,
    marginBottom: 15,
    color: 'white',
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
    marginBottom: 20,
  },
  detailsContainer: {
    width: '100%',
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    padding: 15,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  detailLabel: {
    color: '#a0a0a0',
    fontSize: 14,
  },
  detailValue: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  earnedText: {
    color: '#e74c3c',
  },
  notEarnedText: {
    color: '#a0a0a0',
  },
  mysteryHint: {
    color: '#a0a0a0',
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AchievementDetails;
