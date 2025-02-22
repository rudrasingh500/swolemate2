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
      }
    }
  }
}