import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { supabase } from '../lib/supabase';
import { useRouter, useSegments } from 'expo-router';

export default function RootLayout() {
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        if (segments[0] === '(auth)' && segments[1] === 'questionnaire') {
          // Allow questionnaire flow to continue
          return;
        }
        if (segments[0] !== '(tabs)') {
          router.replace('/(tabs)');
        }
      }
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        if (segments[0] === '(auth)' && segments[1] === 'questionnaire') {
          // Allow questionnaire flow to continue
          return;
        }
        if (segments[0] !== '(tabs)') {
          router.replace('/(tabs)');
        }
      } else if (!session && segments[0] !== '(auth)') {
        router.replace('/');
      }
    });
  }, [segments]);

  return (
    <>
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}