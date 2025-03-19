import { useState } from 'react';
import { View, ImageBackground, ScrollView, Alert } from 'react-native';
import { Button, Text, CheckBox } from '@rneui/themed';
import { router } from 'expo-router';
import { supabase } from '@/lib/supabase/supabase';
import questionnaire_styles from '@/styles/questionnaire_style';
import { Equipment } from '@/types/questionnaire';
import { equipmentList } from '@/constants/questionnaire';

export default function EquipmentAccess() {
  const [loading, setLoading] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment[]>([]);

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
    <View style={questionnaire_styles.container}>
      <ImageBackground
        source={require('../../../assets/images/background.png')}
        style={questionnaire_styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={questionnaire_styles.overlay}>
          <View style={questionnaire_styles.content}>
            <Text h2 style={questionnaire_styles.title}>Equipment Access</Text>
            <Text style={questionnaire_styles.subtitle}>Step 5 of 5</Text>

            <ScrollView 
              style={questionnaire_styles.equipmentContainer}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}>
              {equipmentList.map(equipment => (
                <CheckBox
                  key={equipment.id}
                  title={equipment.title}
                  subtitle={equipment.description}
                  checked={selectedEquipment.includes(equipment.id)}
                  onPress={() => toggleEquipment(equipment.id)}
                  containerStyle={questionnaire_styles.checkboxContainer}
                  textStyle={questionnaire_styles.checkboxText}
                  wrapperStyle={questionnaire_styles.checkboxWrapper}
                />
              ))}
            </ScrollView>

            <Button
              title="Finish"
              onPress={saveEquipmentAccess}
              loading={loading}
              containerStyle={questionnaire_styles.buttonContainer}
              buttonStyle={questionnaire_styles.button}
            />
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}
