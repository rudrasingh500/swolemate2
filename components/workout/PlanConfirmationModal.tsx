import { View, Modal } from 'react-native';
import { Text, Button } from '@rneui/themed';
import plan_styles from '@/styles/plan_style';
import { PreDefinedPlan } from '@/types/workout';

interface PlanConfirmationModalProps {
  isVisible: boolean;
  selectedPlan: PreDefinedPlan | null;
  onConfirm: (plan: PreDefinedPlan) => void;
  onCancel: () => void;
}

export default function PlanConfirmationModal({
  isVisible,
  selectedPlan,
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