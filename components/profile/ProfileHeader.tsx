import { View, TextInput } from 'react-native';
import { Text, Button, Avatar } from '@rneui/themed';
import profile_styles from '@/styles/profile_style';

interface ProfileHeaderProps {
  profile: {
    avatar_url?: string;
    full_name?: string;
    username?: string;
  } | null;
  editing: boolean;
  fullName: string;
  onFullNameChange: (name: string) => void;
  onSave: () => void;
  onCancel: () => void;
  onEdit: () => void;
}

export default function ProfileHeader({
  profile,
  editing,
  fullName,
  onFullNameChange,
  onSave,
  onCancel,
  onEdit,
}: ProfileHeaderProps) {
  return (
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
            onChangeText={onFullNameChange}
            placeholder="Enter your full name"
            placeholderTextColor="#999"
          />
          <View style={profile_styles.editButtons}>
            <Button
              title="Save"
              onPress={onSave}
              containerStyle={profile_styles.editButton}
              buttonStyle={profile_styles.button}
            />
            <Button
              title="Cancel"
              type="outline"
              onPress={onCancel}
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
            onPress={onEdit}
            containerStyle={profile_styles.editProfileButton}
            buttonStyle={profile_styles.outlineButton}
            titleStyle={profile_styles.outlineButtonText}
          />
        </>
      )}
    </View>
  );
}