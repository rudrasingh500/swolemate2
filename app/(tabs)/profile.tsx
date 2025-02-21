import { useEffect, useState } from 'react';
import { StyleSheet, View, Alert, TextInput, ImageBackground } from 'react-native';
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
              <View style={styles.achievementCard}>
                <Text style={styles.achievementIcon}>🏃</Text>
                <Text style={styles.achievementTitle}>First Workout</Text>
                <Text style={styles.achievementDesc}>Completed your first workout</Text>
              </View>
              <View style={styles.achievementCard}>
                <Text style={styles.achievementIcon}>🔥</Text>
                <Text style={styles.achievementTitle}>Week Streak</Text>
                <Text style={styles.achievementDesc}>Worked out 7 days in a row</Text>
              </View>
              <View style={styles.achievementCard}>
                <Text style={styles.achievementIcon}>⭐</Text>
                <Text style={styles.achievementTitle}>Form Master</Text>
                <Text style={styles.achievementDesc}>Perfect form in 5 exercises</Text>
              </View>
            </View>
          </View>
      
          <Button
            title="Sign Out"
            onPress={handleSignOut}
            containerStyle={styles.signOutButton}
            type="outline"
            buttonStyle={styles.outlineButton}
            titleStyle={styles.outlineButtonText}
          />
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
    paddingTop: 120,
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
});