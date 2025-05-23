/*
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { GameAchievement } from '@/hooks/useAchievements';

interface AchievementDetailsProps {
  achievement: GameAchievement | null;
  onClose: () => void;
}

const AchievementDetails: React.FC<AchievementDetailsProps> = ({
  achievement,
  onClose,
}) => {
  if (!achievement) return null;

  const getDifficulty = (target: number) => {
    if (!achievement) return 'Unknown';
    if (target <= 1) return 'Easy';
    if (target <= 5) return 'Medium';
    if (target <= 10) return 'Hard';
    return 'Challenging';
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Modal
      transparent={true}
      visible={!!achievement}
      onRequestClose={onClose}
      animationType="slide"
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {achievement.isRevealed ? (
              <>
                <Text style={styles.modalIcon}>{achievement.icon}</Text>
                <Text style={styles.modalTitle}>{achievement.title}</Text>
                <Text style={styles.modalDescription}>
                  {achievement.description}
                </Text>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Status:</Text>
                  <Text
                    style={[
                      styles.infoValue,
                      achievement.isEarned ? styles.earnedText : styles.lockedText,
                    ]}
                  >
                    {achievement.isEarned ? 'Unlocked' : 'Locked'}
                  </Text>
                </View>

                {achievement.isEarned && achievement.earnedDate && (
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Earned On:</Text>
                    <Text style={styles.infoValue}>
                      {formatDate(achievement.earnedDate)}
                    </Text>
                  </View>
                )}

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Progress:</Text>
                  <Text style={styles.infoValue}>
                    {achievement.progress}/{achievement.target}
                  </Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Difficulty:</Text>
                  <Text style={styles.infoValue}>
                    {getDifficulty(achievement.target)}
                  </Text>
                </View>
              </>
            ) : (
              <>
                <Text style={styles.modalIcon}>?</Text>
                <Text style={styles.modalTitle}>Mysterious Achievement</Text>
                <Text style={styles.modalDescription}>
                  Keep working out to discover this achievement!
                </Text>
                <Text style={styles.hintText}>
                  Some achievements are revealed through specific workout
                  milestones or by exploring different features of the app.
                  Keep pushing your limits to unlock more achievements!
                </Text>
              </>
            )}
          </ScrollView>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: 'rgba(30, 30, 30, 0.95)', // Darker, more translucent
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
  scrollContent: {
    alignItems: 'center',
    paddingBottom: 20, // Space for the close button
  },
  modalIcon: {
    fontSize: 50,
    color: '#e74c3c', // Theme color
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 10,
  },
  modalDescription: {
    fontSize: 16,
    color: '#e0e0e0', // Lighter gray
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  infoLabel: {
    fontSize: 15,
    color: '#b0b0b0', // Medium gray
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 15,
    color: 'white',
    fontWeight: '600',
  },
  earnedText: {
    color: '#2ecc71', // Green for earned
  },
  lockedText: {
    color: '#e74c3c', // Red for locked
  },
  hintText: {
    fontSize: 14,
    color: '#a0a0a0',
    textAlign: 'center',
    marginTop: 10,
    fontStyle: 'italic',
  },
  closeButton: {
    backgroundColor: '#e74c3c',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 25,
    marginTop: 20,
    alignSelf: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AchievementDetails;
*/
