import { useEffect, useState } from 'react';
import { StyleSheet, View, Alert, TextInput, ImageBackground, ScrollView, Modal, TouchableOpacity } from 'react-native';
import { Text, Button, Avatar } from '@rneui/themed';
import { router } from 'expo-router';
import { supabase } from '../../lib/supabase';
import type { Database } from '../../lib/supabase.types';

type Profile = Database['public']['Tables']['profiles']['Row'];

export default function ProfileScreen() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState('');
  const [selectedAchievement, setSelectedAchievement] = useState(null);
  const achievements = [
    {
      id: 1,
      icon: '🏃',
      title: 'First Workout',
      description: 'Completed your first workout',
      earnedDate: '2024-02-15',
      progress: '1/1 workouts'
    },
    {
      id: 2,
      icon: '🔥',
      title: 'Week Streak',
      description: 'Worked out 7 days in a row',
      earnedDate: '2024-02-20',
      progress: '7/7 days'
    },
    {
      id: 3,
      icon: '⭐',
      title: 'Form Master',
      description: 'Perfect form in 5 exercises',
      earnedDate: 'Not earned yet',
      progress: '3/5 exercises'
    }
  ];
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
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../assets/images/background.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <ScrollView style={styles.scrollView}>
            <View style={styles.header}>
              <Avatar
                size="xlarge"
                rounded
                source={profile?.avatar_url ? { uri: profile.avatar_url } : undefined}
                icon={{ name: 'user', type: 'font-awesome' }}
                containerStyle={styles.avatar}
              />
              
              {editing ? (
                <View style={styles.editContainer}>
                  <TextInput
                    style={styles.input}
                    value={fullName}
                    onChangeText={setFullName}
                    placeholder="Enter your full name"
                    placeholderTextColor="#999"
                  />
                  <View style={styles.editButtons}>
                    <Button
                      title="Save"
                      onPress={updateProfile}
                      containerStyle={styles.editButton}
                      buttonStyle={styles.button}
                    />
                    <Button
                      title="Cancel"
                      type="outline"
                      onPress={() => {
                        setEditing(false);
                        setFullName(profile?.full_name || '');
                      }}
                      containerStyle={styles.editButton}
                      buttonStyle={styles.outlineButton}
                      titleStyle={styles.outlineButtonText}
                    />
                  </View>
                </View>
              ) : (
                <>
                  <Text h3 style={styles.name}>{profile?.full_name || 'Add your name'}</Text>
                  <Text style={styles.email}>{profile?.username}</Text>
                  <Button
                    title="Edit Profile"
                    type="outline"
                    onPress={() => setEditing(true)}
                    containerStyle={styles.editProfileButton}
                    buttonStyle={styles.outlineButton}
                    titleStyle={styles.outlineButtonText}
                  />
                </>
              )}
            </View>
      
            <View style={styles.stats}>
              <View style={styles.statItem}>
                <Text h4 style={styles.statNumber}>0</Text>
                <Text style={styles.statLabel}>Workouts</Text>
              </View>
              <View style={styles.statItem}>
                <Text h4 style={styles.statNumber}>0</Text>
                <Text style={styles.statLabel}>Analysis</Text>
              </View>
            </View>
      
            <View style={styles.achievementsContainer}>
              <Text h4 style={styles.achievementsTitle}>Achievements</Text>
              <View style={styles.achievementsGrid}>
                {achievements.map((achievement) => (
                  <TouchableOpacity
                    key={achievement.id}
                    style={styles.achievementCard}
                    onPress={() => setSelectedAchievement(achievement)}
                  >
                    <Text style={styles.achievementIcon}>{achievement.icon}</Text>
                    <Text style={styles.achievementTitle}>{achievement.title}</Text>
                    <Text style={styles.achievementDesc}>{achievement.description}</Text>
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
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  {selectedAchievement && (
                    <>
                      <Text style={styles.modalIcon}>{selectedAchievement.icon}</Text>
                      <Text style={styles.modalTitle}>{selectedAchievement.title}</Text>
                      <Text style={styles.modalDescription}>{selectedAchievement.description}</Text>
                      <Text style={styles.modalDate}>Earned: {selectedAchievement.earnedDate}</Text>
                      <Text style={styles.modalProgress}>Progress: {selectedAchievement.progress}</Text>
                      <Button
                        title="Close"
                        onPress={closeAchievementModal}
                        buttonStyle={styles.modalCloseButton}
                        titleStyle={styles.modalCloseButtonText}
                      />
                    </>
                  )}
                </View>
              </View>
            </Modal>
      
            <Button
              title="Sign Out"
              onPress={handleSignOut}
              containerStyle={styles.signOutButton}
              type="outline"
              buttonStyle={styles.outlineButton}
              titleStyle={styles.outlineButtonText}
            />
          </ScrollView>
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
  },
  scrollView: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 20,
    borderRadius: 15,
  },
  avatar: {
    backgroundColor: '#e74c3c',
    marginBottom: 15,
  },
  name: {
    color: 'white',
    marginBottom: 5,
  },
  email: {
    color: '#e0e0e0',
  },
  editContainer: {
    width: '100%',
    alignItems: 'center',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: 'white',
  },
  editButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  editButton: {
    minWidth: 100,
  },
  button: {
    backgroundColor: '#e74c3c',
    paddingVertical: 15,
    borderRadius: 10,
  },
  outlineButton: {
    borderColor: '#e74c3c',
    borderWidth: 1,
    paddingVertical: 15,
    borderRadius: 10,
  },
  outlineButtonText: {
    color: '#e74c3c',
  },
  editProfileButton: {
    marginTop: 15,
    width: '100%',
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginTop: 20,
    marginHorizontal: 20,
    borderRadius: 15,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    color: 'white',
  },
  statLabel: {
    color: '#e0e0e0',
  },
  achievementsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 15,
    marginTop: 20,
    marginHorizontal: 20,
  },
  achievementsTitle: {
    color: 'white',
    marginBottom: 15,
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  achievementCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    padding: 12,
    width: '31%',
    alignItems: 'center',
    minWidth: 100,
  },
  achievementIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  achievementTitle: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 4,
  },
  achievementDesc: {
    color: '#e0e0e0',
    fontSize: 12,
    textAlign: 'center',
  },
  signOutButton: {
    margin: 20,
  },
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
    width: '80%',
    alignItems: 'center',
  },
  modalIcon: {
    fontSize: 48,
    marginBottom: 15,
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
    marginBottom: 15,
  },
  modalDate: {
    color: '#e74c3c',
    fontSize: 14,
    marginBottom: 5,
  },
  modalProgress: {
    color: '#e0e0e0',
    fontSize: 14,
    marginBottom: 20,
  },
  modalCloseButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  modalCloseButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  outlineButton: {
    borderColor: '#e74c3c',
    borderWidth: 1,
    paddingVertical: 15,
    borderRadius: 10,
  },
  outlineButtonText: {
    color: '#e74c3c',
  },
  editProfileButton: {
    marginTop: 15,
    width: '100%',
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginTop: 20,
    marginHorizontal: 20,
    borderRadius: 15,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    color: 'white',
  },
  statLabel: {
    color: '#e0e0e0',
  },
  achievementsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 15,
    marginTop: 20,
    marginHorizontal: 20,
  },
  achievementsTitle: {
    color: 'white',
    marginBottom: 15,
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  achievementCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    padding: 12,
    width: '31%',
    alignItems: 'center',
    minWidth: 100,
  },
  achievementIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  achievementTitle: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 4,
  },
  achievementDesc: {
    color: '#e0e0e0',
    fontSize: 12,
    textAlign: 'center',
  },
  signOutButton: {
    margin: 20,
  },
});