import { Stack } from 'expo-router';

export default function QuestionnaireLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
        animation: 'slide_from_right',
        headerBackVisible: false,
        headerLeft: () => null
      }}
    >
      <Stack.Screen name="basic-info" />
      <Stack.Screen name="fitness-goals" />
      <Stack.Screen name="equipment-access" />
    </Stack>
  );
}