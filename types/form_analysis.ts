export interface Coordinates {
  x: number;
  y: number;
}

export interface Issue {
  timestamp: string; // "mm:ss:ms"
  coordinates: Coordinates | null;
  description: string;
  correction: string;
}

export interface RepAnalysis {
  rep_number: number;
  start_time?: string; // "mm:ss:ms", optional
  end_time?: string;   // "mm:ss:ms", optional
  accuracy_score: number; // 0-100
  issues: Issue[];
}

export interface FormAnalysis {
  exercise: string;
  total_reps: number;
  reps: RepAnalysis[];
}

// Type for the database table row (combining analysis data with metadata)
export interface FormAnalysisRecord {
  id: string; // uuid
  user_id: string; // uuid
  video_storage_path: string;
  analysis_data: FormAnalysis; // The actual JSON analysis
  exercise_name: string; // Generated column
  total_reps: number; // Generated column
  created_at: string; // timestamp with time zone
}