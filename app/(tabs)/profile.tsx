import { useEffect, useState } from 'react';
import { View, Alert, TextInput, ImageBackground, ScrollView, Modal, TouchableOpacity } from 'react-native';
import { Text, Button, Avatar } from '@rneui/themed';
import { router } from 'expo-router';
import { supabase } from '../../lib/supabase/supabase';
import type { Database } from '../../lib/supabase/supabase.types';
import profile_styles from '@/styles/profile_style';
import { achievements } from '@/constants/profile';

type Profile = Database['public']['Tables']['profiles']['Row'];

export default function ProfileScreen() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState('');
  const [selectedAchievement, setSelectedAchievement] = useState(null);

  const closeAchievementModal = () => {
    setSelectedAchievement(null);
  };
  useEffect(() => {
    getProfile();
  }, []);
  async function getProfile() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('No user found');

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      
      setProfile(data);
      setFullName(data.full_name || '');
    } catch (error) {
      Alert.alert('Error', 'Error fetching profile');
    } finally {
      setLoading(false);
    }
  }
  async function updateProfile() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('No user found');

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;
      
      setEditing(false);
      getProfile();
    } catch (error) {
      Alert.alert('Error', 'Error updating profile');
    }
  }
  async function handleSignOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert('Error', error.message);
    } else {
      router.replace('/sign-in');
    }
  }
  if (loading) {
    return (
      <View style={profile_styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }
  return (
    <View style={profile_styles.container}>
      <ImageBackground
        source={require('../../assets/images/background.png')}
        style={profile_styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={profile_styles.overlay}>
          <ScrollView style={profile_styles.scrollView}>
            <View style={profile_styles.header}>
              <Avatar
                size="xlarge"
                rounded
                source={profile?.avatar_url ? { uri: profile.avatar_url } : undefined}
                icon={{ name: 'user', type: 'font-awesome' }}
                containerStyle={profile_styles.avatar}
              />
              
              {editing ? (
                <View style={profile_styles.editContainer}>
                  <TextInput
                    style={profile_styles.input}
                    value={fullName}
                    onChangeText={setFullName}
                    placeholder="Enter your full name"
                    placeholderTextColor="#999"
                  />
                  <View style={profile_styles.editButtons}>
                    <Button
                      title="Save"
                      onPress={updateProfile}
                      containerStyle={profile_styles.editButton}
                      buttonStyle={profile_styles.button}
                    />
                    <Button
                      title="Cancel"
                      type="outline"
                      onPress={() => {
                        setEditing(false);
                        setFullName(profile?.full_name || '');
                      }}
                      containerStyle={profile_styles.editButton}
                      buttonStyle={profile_styles.outlineButton}
                      titleStyle={profile_styles.outlineButtonText}
                    />
                  </View>
                </View>
              ) : (
                <>
                  <Text h3 style={profile_styles.name}>{profile?.full_name || 'Add your name'}</Text>
                  <Text style={profile_styles.email}>{profile?.username}</Text>
                  <Button
                    title="Edit Profile"
                    type="outline"
                    onPress={() => setEditing(true)}
                    containerStyle={profile_styles.editProfileButton}
                    buttonStyle={profile_styles.outlineButton}
                    titleStyle={profile_styles.outlineButtonText}
                  />
                </>
              )}
            </View>
      
            <View style={profile_styles.stats}>
              <View style={profile_styles.statItem}>
                <Text h4 style={profile_styles.statNumber}>0</Text>
                <Text style={profile_styles.statLabel}>Workouts</Text>
              </View>
              <View style={profile_styles.statItem}>
                <Text h4 style={profile_styles.statNumber}>0</Text>
                <Text style={profile_styles.statLabel}>Analysis</Text>
              </View>
            </View>
      
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
      
            <Button
              title="Sign Out"
              onPress={handleSignOut}
              containerStyle={profile_styles.signOutButton}
              type="outline"
              buttonStyle={profile_styles.outlineButton}
              titleStyle={profile_styles.outlineButtonText}
            />
          </ScrollView>
        </View>
      </ImageBackground>
    </View>
  );
}
