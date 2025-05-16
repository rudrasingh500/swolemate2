# Form Analysis Edge Function

This Supabase Edge Function uses Gemini 2.5 Pro to analyze workout videos and provide detailed form feedback.

## How It Works

1. The function receives a request with the video path and user ID
2. It fetches the video from Supabase Storage
3. The video is sent to the Gemini 2.5 Pro API for analysis
4. The analysis is returned as a JSON object and stored in the database

## Setup

### Environment Variables

Set the following environment variables in your Supabase project:

```bash
supabase secrets set GEMINI_API_KEY=your_gemini_api_key
```

The function already uses the built-in Supabase variables:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

### Database Setup

Ensure you've created the necessary storage bucket and tables:

```sql
-- Create the storage bucket for form analysis videos
insert into storage.buckets (id, name, public)
values ('form_videos', 'form_videos', false)
on conflict (id) do nothing;

-- Create the table to store form analysis results
create table public.form_analyses (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users(id) on delete cascade,
    video_storage_path text not null,
    analysis_data jsonb not null,
    exercise_name text generated always as (analysis_data->>'exercise') stored,
    total_reps integer generated always as ((analysis_data->>'total_reps')::integer) stored,
    created_at timestamp with time zone default now() not null
);
```

## Usage

Call the function with:

```typescript
// In your React Native app
const { supabase } = useSupabase();

// First upload the video
const filePath = `${user.id}/${new Date().getTime()}.mp4`;
const { error: uploadError } = await supabase.storage
  .from('form_videos')
  .upload(filePath, videoFile);

if (uploadError) {
  console.error('Error uploading video:', uploadError);
  return;
}

// Then call the analysis function
const { data, error } = await supabase.functions.invoke('analyze-form', {
  body: {
    videoPath: filePath,
    userId: user.id
  }
});

if (error) {
  console.error('Error analyzing form:', error);
  return;
}

// Process the analysis results
const analysis = data.analysis;
// ...do something with the analysis
```

## Response Format

The function returns a JSON object with:

```json
{
  "success": true,
  "analysis": {
    "exercise": "String - type of exercise detected",
    "total_reps": 0,
    "reps": [
      {
        "rep_number": 1,
        "start_time": "mm:ss:ms",
        "end_time": "mm:ss:ms",
        "accuracy_score": 85,
        "issues": [
          {
            "timestamp": "mm:ss:ms",
            "coordinates": {
              "x": 0.5,
              "y": 0.3
            },
            "description": "Description of the form issue",
            "correction": "How to correct the issue"
          }
        ]
      }
    ]
  }
}
```

## Deployment

Deploy the function to your Supabase project:

```bash
supabase functions deploy analyze-form
``` 