import { useEffect, useState } from 'react';
import { View, Alert, ImageBackground, ScrollView } from 'react-native';
import { Text, Button } from '@rneui/themed';
import { router } from 'expo-router';
import { supabase } from '../../lib/supabase/supabase';
import type { Database } from '../../lib/supabase/supabase.types';
import profile_styles from '@/styles/profile_style';
import { achievements } from '@/constants/profile';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileStats from '@/components/profile/ProfileStats';
import ProfileAchievements from '@/components/profile/ProfileAchievements';

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
            <ProfileHeader
              profile={profile}
              editing={editing}
              fullName={fullName}
              onFullNameChange={setFullName}
              onSave={updateProfile}
              onCancel={() => {
                setEditing(false);
                setFullName(profile?.full_name || '');
              }}
              onEdit={() => setEditing(true)}
            />
            
            <ProfileStats workouts={0} analyses={0} />
            
            <ProfileAchievements achievements={achievements} />
            
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
