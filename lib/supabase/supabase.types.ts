export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string | null
          full_name: string | null
          avatar_url: string | null
          updated_at: string
          height: number | null
          weight: number | null
          age: number | null
          medical_conditions: string[] | null
          activity_level: 'sedentary' | 'light' | 'moderate' | 'very_active' | 'extra_active' | null
          fitness_goals: string[] | null
          available_equipment: string[] | null
        }
        Insert: {
          id: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          updated_at?: string
          height?: number | null
          weight?: number | null
          age?: number | null
          medical_conditions?: string[] | null
          activity_level?: 'sedentary' | 'light' | 'moderate' | 'very_active' | 'extra_active' | null
          fitness_goals?: string[] | null
          available_equipment?: string[] | null
        }
        Update: {
          id?: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          updated_at?: string
          height?: number | null
          weight?: number | null
          age?: number | null
          medical_conditions?: string[] | null
          activity_level?: 'sedentary' | 'light' | 'moderate' | 'very_active' | 'extra_active' | null
          fitness_goals?: string[] | null
          available_equipment?: string[] | null
        }
      },
      workout_plans: {
        Row: {
          id: string
          profile_id: string
          plan_data: Json
          current_streak: number
          longest_streak: number
          last_workout_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          plan_data?: Json
          current_streak?: number
          longest_streak?: number
          last_workout_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          profile_id?: string
          plan_data?: Json
          current_streak?: number
          longest_streak?: number
          last_workout_date?: string | null
          created_at?: string
          updated_at?: string
        }
      },
      achievements: {
        Row: {
          id: string
          icon: string
          title: string
          description: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          icon: string
          title: string
          description: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          icon?: string
          title?: string
          description?: string
          created_at?: string
          updated_at?: string
        }
      },
      user_achievements: {
        Row: {
          id: string
          profile_id: string
          achievement_id: string
          progress: number
          target: number
          earned_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          achievement_id: string
          progress?: number
          target: number
          earned_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          profile_id?: string
          achievement_id?: string
          progress?: number
          target?: number
          earned_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}