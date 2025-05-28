import React from 'react';
import { View, Modal } from 'react-native';
import { Text, Button } from '@rneui/themed';
import plan_styles from '@/styles/plan_style';
import { EnhancedWorkoutPlan } from '@/types/enhanced-workout';

interface PlanConfirmationModalProps {
  isVisible: boolean;
  selectedPlan: EnhancedWorkoutPlan | null;
  selectedDays: string[];
  onConfirm: (plan: EnhancedWorkoutPlan) => void;
  onCancel: () => void;
}

export default function PlanConfirmationModal({
  isVisible,
  selectedPlan,
  selectedDays,
  onConfirm,
  onCancel
}: PlanConfirmationModalProps) {
  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={plan_styles.modalContainer}>
        <View style={plan_styles.modalContent}>
          <Text style={plan_styles.modalTitle}>Confirm Plan Selection</Text>
          {selectedPlan && (
            <>
              <Text style={plan_styles.modalPlanTitle}>{selectedPlan.title}</Text>
              <Text style={plan_styles.modalDescription}>{selectedPlan.description}</Text>
              <Text style={[plan_styles.modalDescription, { marginTop: 10, fontSize: 14 }]}>
                Level: {selectedPlan.level} • Duration: {selectedPlan.estimatedTimePerSession} • {selectedPlan.daysPerWeek} days/week
              </Text>
              {selectedDays.length > 0 && (
                <Text style={[plan_styles.modalDescription, { marginTop: 10, fontSize: 14, color: '#e74c3c', fontWeight: 'bold' }]}>
                  Your workout days: {selectedDays.join(', ')}
                </Text>
              )}
              <View style={plan_styles.modalButtons}>
                <Button
                  title="Confirm"
                  onPress={() => selectedPlan && onConfirm(selectedPlan)}
                  buttonStyle={plan_styles.confirmButton}
                />
                <Button
                  title="Cancel"
                  onPress={onCancel}
                  type="outline"
                  buttonStyle={plan_styles.cancelButton}
                  titleStyle={plan_styles.cancelButtonText}
                />
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}