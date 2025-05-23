import 'react-native-url-polyfill/auto';
import * as SecureStore from 'expo-secure-store';
import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';

// Secure storage adapter for persisting sessions
const ExpoSecureStoreAdapter = {
  getItem: (key: string) => {
    return SecureStore.getItemAsync(key);
  },
  setItem: (key: string, value: string) => {
    return SecureStore.setItemAsync(key, value);
  },
  removeItem: (key: string) => {
    return SecureStore.deleteItemAsync(key);
  },
};

// Hardcoded values for development purposes only
// In production, these would come from environment variables
const supabaseUrl = 'https://syibjnqnwgyrzjbzolxi.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN5aWJqbnFud2d5cnpqYnpvbHhpIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODY5NzkxODYsImV4cCI6MjAwMjU1NTE4Nn0.FYYFA33lYMEOPEn7WoaRn-XCj2JHEwt4kOb1ztW078I';

// Log configuration for debugging
console.log('Initializing Supabase with URL:', supabaseUrl);
console.log('Anon key exists:', !!supabaseAnonKey);

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: Platform.OS === 'web' ? localStorage : ExpoSecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Perform a test query to check connection in development environment
if (process.env.NODE_ENV === 'development') {
  (async () => {
    try {
      // Try to list buckets
      const { data, error } = await supabase.storage.listBuckets();
      if (error) {
        console.error('❌ Supabase connection test failed:', error.message);
      } else {
        console.log('✅ Supabase connection test successful!');
        console.log('Available storage buckets:', data.map(b => b.name));
      }
    } catch (err) {
      console.error('❌ Supabase initialization error:', err);
    }
  })();
}