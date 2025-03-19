import { useEffect, useState } from 'react';
import { View, Alert, ImageBackground, ScrollView } from 'react-native';
import { Text, Button } from '@rneui/themed';
import { router } from 'expo-router';
import { supabase } from '../../lib/supabase/supabase';
import type { Database } from '../../lib/supabase/supabase.types';
import profile_styles from '@/styles/profile_style';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileStats from '@/components/profile/ProfileStats';
import ProfileAchievements from '@/components/profile/ProfileAchievements';
import { Achievement } from '@/types/profile';

type Profile = Database['public']['Tables']['profiles']['Row'];
type AchievementRow = Database['public']['Tables']['achievements']['Row'];
type UserAchievementRow = Database['public']['Tables']['user_achievements']['Row'];

export default function ProfileScreen() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
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

      // Fetch profile data
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;
      
      setProfile(profileData);
      setFullName(profileData.full_name || '');
      
      // First, fetch all available achievements
      const { data: allAchievements, error: allAchievementsError } = await supabase
        .from('achievements')
        .select('*');
        
      if (allAchievementsError) throw allAchievementsError;
      
      // Then fetch user achievements with related achievement data
      const { data: userAchievementsData, error: achievementsError } = await supabase
        .from('user_achievements')
        .select(`
          id,
          progress,
          target,
          earned_at,
          achievement_id,
          achievements:achievement_id(id, icon, title, description)
        `)
        .eq('profile_id', user.id);
        
      if (achievementsError) throw achievementsError;
      
      // Create a map of user achievements for easy lookup
      const userAchievementsMap = new Map();
      userAchievementsData.forEach(item => {
        userAchievementsMap.set(item.achievement_id, item);
      });
      
      // Transform the data to match our Achievement type, ensuring all achievements are included
      const formattedAchievements: Achievement[] = allAchievements.map(achievement => {
        const userAchievement = userAchievementsMap.get(achievement.id);
        
        if (userAchievement) {
          // User has this achievement in their user_achievements table
          return {
            id: achievement.id,
            icon: achievement.icon,
            title: achievement.title,
            description: achievement.description,
            progress: userAchievement.progress,
            target: userAchievement.target,
            earnedDate: userAchievement.earned_at,
            isEarned: userAchievement.earned_at !== null
          };
        } else {
          // Achievement exists but user doesn't have it in their user_achievements table
          // Create a default entry with 0 progress
          return {
            id: achievement.id,
            icon: achievement.icon,
            title: achievement.title,
            description: achievement.description,
            progress: 0,
            target: achievement.title === 'First Workout' ? 1 : 
                   achievement.title === 'Week Streak' ? 7 : 
                   achievement.title === 'Form Master' ? 5 : 1,
            earnedDate: null,
            isEarned: false
          };
        }
      });
      
      // No need for the warning check anymore since we're including all achievements
      setAchievements(formattedAchievements);
    } catch (error) {
      console.error('Error fetching data:', error);
      Alert.alert('Error', 'Error fetching profile data');
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
          <ScrollView 
              style={profile_styles.scrollView}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}>
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
