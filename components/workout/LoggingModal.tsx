import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface LoggingModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  exerciseName?: string;
}

const LoggingModal: React.FC<LoggingModalProps> = ({ 
  isVisible, 
  onClose, 
  onSave,
  exerciseName = "Exercise"
}) => {
  const [sets, setSets] = useState([{ reps: '', weight: '' }]);

  const addSet = () => {
    setSets([...sets, { reps: '', weight: '' }]);
  };

  const updateSet = (index: number, field: 'reps' | 'weight', value: string) => {
    const updatedSets = [...sets];
    updatedSets[index][field] = value;
    setSets(updatedSets);
  };

  const handleSave = () => {
    onSave({
      exercise: exerciseName,
      sets: sets,
      date: new Date().toISOString()
    });
    setSets([{ reps: '', weight: '' }]);
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Log {exerciseName}</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.setsContainer}>
            {sets.map((set, index) => (
              <View key={index} style={styles.setRow}>
                <Text style={styles.setNumber}>Set {index + 1}</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="Reps"
                    keyboardType="number-pad"
                    value={set.reps}
                    onChangeText={(value) => updateSet(index, 'reps', value)}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Weight (lbs)"
                    keyboardType="decimal-pad"
                    value={set.weight}
                    onChangeText={(value) => updateSet(index, 'weight', value)}
                  />
                </View>
              </View>
            ))}
          </ScrollView>
          
          <TouchableOpacity style={styles.addButton} onPress={addSet}>
            <Text style={styles.addButtonText}>Add Set</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = {
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modalView: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  setsContainer: {
    maxHeight: 300
  },
  setRow: {
    marginBottom: 15
  },
  setNumber: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    width: '48%'
  },
  addButton: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10
  },
  addButtonText: {
    color: '#333',
    fontWeight: '600'
  },
  saveButton: {
    backgroundColor: '#e74c3c',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16
  }
};

export default LoggingModal;