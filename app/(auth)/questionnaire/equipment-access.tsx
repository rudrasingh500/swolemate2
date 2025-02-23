import { useState } from 'react';
import { StyleSheet, View, ImageBackground, ScrollView, Alert } from 'react-native';
import { Button, Text, CheckBox } from '@rneui/themed';
import { router } from 'expo-router';
import { supabase } from '@/lib/supabase/supabase';

type Equipment = 'dumbbells' | 'barbell' | 'bench' | 'squat_rack' | 'cables' | 'cardio_machines' | 'resistance_bands' | 'bodyweight_only';

export default function EquipmentAccess() {
  const [loading, setLoading] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment[]>([]);

  const equipmentList = [
    { id: 'dumbbells' as Equipment, title: 'Dumbbells', description: 'Free weights for various exercises' },
    { id: 'barbell' as Equipment, title: 'Barbell', description: 'For compound movements and heavy lifts' },
    { id: 'bench' as Equipment, title: 'Bench', description: 'For bench press and other exercises' },
    { id: 'squat_rack' as Equipment, title: 'Squat Rack', description: 'For squats and other barbell exercises' },
    { id: 'cables' as Equipment, title: 'Cable Machines', description: 'For isolation and resistance training' },
    { id: 'cardio_machines' as Equipment, title: 'Cardio Machines', description: 'Treadmill, bike, elliptical, etc.' },
    { id: 'resistance_bands' as Equipment, title: 'Resistance Bands', description: 'For mobility and resistance training' },
    { id: 'bodyweight_only' as Equipment, title: 'Bodyweight Only', description: 'No equipment needed' },
  ];

  const toggleEquipment = (equipment: Equipment) => {
    if (equipment === 'bodyweight_only') {
      setSelectedEquipment(['bodyweight_only']);
    } else {
      setSelectedEquipment(prev => {
        const newSelection = prev.filter(e => e !== 'bodyweight_only');
        return prev.includes(equipment)
          ? newSelection.filter(e => e !== equipment)
          : [...newSelection, equipment];
      });
    }
  };

  async function saveEquipmentAccess() {
    if (selectedEquipment.length === 0) {
      Alert.alert('Error', 'Please select at least one option');
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('No user found');

      const { error } = await supabase
        .from('profiles')
        .update({
          available_equipment: selectedEquipment,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;
      
      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert('Error', 'Failed to save information');
      console.error('Error saving equipment access:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../../assets/images/background.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <View style={styles.content}>
            <Text h2 style={styles.title}>Equipment Access</Text>
            <Text style={styles.subtitle}>Step 5 of 5</Text>

            <ScrollView style={styles.equipmentContainer}>
              {equipmentList.map(equipment => (
                <CheckBox
                  key={equipment.id}
                  title={equipment.title}
                  subtitle={equipment.description}
                  checked={selectedEquipment.includes(equipment.id)}
                  onPress={() => toggleEquipment(equipment.id)}
                  containerStyle={styles.checkboxContainer}
                  textStyle={styles.checkboxText}
                  wrapperStyle={styles.checkboxWrapper}
                />
              ))}
            </ScrollView>

            <Button
              title="Finish"
              onPress={saveEquipmentAccess}
              loading={loading}
              containerStyle={styles.buttonContainer}
              buttonStyle={styles.button}
            />
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  content: {
    flex: 1,
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
    paddingTop: 20,
  },
  title: {
    color: 'white',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    color: '#e0e0e0',
    fontSize: 18,
    marginBottom: 40,
    textAlign: 'center',
  },
  equipmentContainer: {
    flex: 1,
    marginBottom: 20,
  },
  checkboxContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 10,
    marginBottom: 10,
    padding: 15,
  },
  checkboxText: {
    color: 'white',
    fontSize: 16,
  },
  checkboxWrapper: {
    marginBottom: 5,
  },
  buttonContainer: {
    marginTop: 15,
    width: '100%',
  },
  button: {
    backgroundColor: '#e74c3c',
    paddingVertical: 15,
    borderRadius: 10,
  },
});