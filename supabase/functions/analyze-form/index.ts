import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { GoogleGenerativeAI } from 'https://esm.sh/@google/generative-ai@0.22.0';

const systemPrompt = `You are a personal trainer analyzing exercise form in the user's video. Focus solely on observable movements and positions shown in the video, without adding any information beyond what is directly visible. If you cannot clearly see an aspect of form, acknowledge the limitation rather than making assumptions. Provide time-stamped feedback on specific form issues visible in the video, with clear corrections based only on what you can observe. If no video is present or video fails to load, clearly state that you cannot provide form analysis without visual input.`;

const userPrompt = `You are a personal trainer analyzing exercise form. IMPORTANT: First verify if a video has been uploaded. If no video is present, clearly state "No video detected. Unable to provide form analysis without visual input." and do not attempt to analyze non-existent footage.

Only if a video is present:
First, Identify what exercise the user is attempting or is performing in the video. 

Your second step is to identify how many reps have been performed by the user. When you have correctly identified how many reps the user has performed in the exercise, I need you to provide the precise time stamps in the format, minute:second:millisecond.

Once you have identified the reps and their timestamps, I need the following done for each rep:
- Analyze said exercise for form issues from minor to major, focusing solely on observable movements within each repetition.
- When analyzing the form, determine what elements and mechanics are needed to perform said form correctly
- Additionally, consider other factors such as rep tempo, breathing patterns, and environmental factors
- Identify using the timestamp structure, minute:second:millisecond, of exactly when the issue has occured
- If possible, provide both quantitative and qualitative identification of issues
- ONLY and ONLY perform these actions if said issue is within the video, do not consider anything that is not in the video. However, if you suspect that a user is making an issue, but you are not certain about it, mention it as well, and mention your lack of confidence in the description

Then, for each issue discovered within the video, provide a detailed fix, and steps the user can take so such form issues do not occur again along.

Finally, for each rep, provide an accuracy score out of 100%, considering the mistakes that the user's have made throughout the rep.

For each identified issue, provide:
1. Timestamp (0:00:00) when visible
2. Location coordinates where applicable
3. Description based only on what you can directly observe
4. Evidence-based correction recommendation

Return analysis in the following JSON format only if video is present:
{
  "exercise": "string",                // e.g. "Back Squat"
  "total_reps": 0,                     // integer count detected
  "reps": [
    {
      "rep_number": 1,                 // 1‑based index
      "start_time": "mm:ss:ms",        // optional, if you track the whole rep window
      "end_time":   "mm:ss:ms",
      "accuracy_score": 0,             // 0‑100 integer
      "issues": [
        {
          "timestamp": "mm:ss:ms",     // moment the issue is visible
          "coordinates": {             // omit or set null if not applicable
            "x": 0.0,
            "y": 0.0
          },
          "description": "string",     // concise, observation‑only
          "correction": "string"       // evidence‑based fix
        }
        // …more issues for this rep
      ]
    }
    // …more reps
  ]
}


Otherwise, return in plain text:
No video detected. Unable to provide form analysis without visual input.`;

serve(async (req) => {
  // Set CORS headers for all responses
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Content-Type': 'application/json'
  };

  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }

  try {
    // Log environment variables (without revealing full values)
    console.log('Environment check:');
    console.log('SUPABASE_URL exists:', Boolean(Deno.env.get('SUPABASE_URL')));
    console.log('SUPABASE_SERVICE_ROLE_KEY exists:', Boolean(Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')));
    console.log('GEMINI_API_KEY exists:', Boolean(Deno.env.get('GEMINI_API_KEY')));

    // Get request payload
    console.log('Parsing request body...');
    const requestData = await req.json();
    console.log('Request data:', JSON.stringify(requestData));
    
    // Check if this is a test call
    if (requestData.test) {
      console.log('Test request detected, returning success response');
      return new Response(
        JSON.stringify({ success: true, message: 'Edge function is working' }),
        { status: 200, headers: corsHeaders }
      );
    }
    
    const { videoPath, userId, bucketName = 'form_videos' } = requestData;
    
    // Validate input
    if (!videoPath || !userId) {
      console.log('Missing required fields:', { videoPath: Boolean(videoPath), userId: Boolean(userId) });
      return new Response(
        JSON.stringify({ error: 'Missing required fields: videoPath and userId' }),
        { status: 400, headers: corsHeaders }
      );
    }
    
    console.log('Creating Supabase client...');
    // Create Supabase client using environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase environment variables');
      return new Response(
        JSON.stringify({ error: 'Server configuration error: Missing Supabase credentials' }),
        { status: 500, headers: corsHeaders }
      );
    }
    
    const supabaseClient = createClient(supabaseUrl, supabaseKey);
    
    // Get video file from storage
    console.log(`Downloading video from ${bucketName}/${videoPath}...`);
    try {
      const { data: fileData, error: fileError } = await supabaseClient
        .storage
        .from(bucketName)
        .download(videoPath);
        
      if (fileError) {
        console.error('Error downloading video:', fileError);
        return new Response(
          JSON.stringify({ 
            error: `Failed to download video: ${fileError.message}`,
            details: fileError,
            path: videoPath,
            bucket: bucketName
          }),
          { status: 500, headers: corsHeaders }
        );
      }
      
      if (!fileData) {
        console.error('No file data returned');
        return new Response(
          JSON.stringify({ error: 'No file data returned from storage' }),
          { status: 500, headers: corsHeaders }
        );
      }
      
      console.log('File downloaded successfully, size:', fileData.size);
      
      // Convert file data to base64
      console.log('Converting file to base64...');
      const fileBase64 = await blobToBase64(fileData);
      console.log('Base64 conversion complete, length:', fileBase64.length);
      
      // Initialize Google Generative AI
      console.log('Initializing Gemini API...');
      const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
      if (!geminiApiKey) {
        console.error('Missing GEMINI_API_KEY environment variable');
        return new Response(
          JSON.stringify({ error: 'Server configuration error: Missing API key for video analysis' }),
          { status: 500, headers: corsHeaders }
        );
      }
      
      const genAI = new GoogleGenerativeAI(geminiApiKey);
      
      // Get the Gemini model (2.5 Pro)
      console.log('Getting Gemini model...');
      try {
        const model = genAI.getGenerativeModel({
          model: 'gemini-2.5-pro-preview-05-06',
          systemInstruction: systemPrompt,
        });
        
        // Create content parts with the video
        console.log('Preparing video for analysis...');
        const videoPart = {
          inlineData: {
            mimeType: fileData.type,
            data: fileBase64,
          },
        };

        // Generate content
        console.log('Sending request to Gemini API...');
        try {
          const result = await model.generateContent([videoPart, userPrompt]);
          const response = await result.response;
          const analysisText = response.text();
          console.log('Received analysis from Gemini:', analysisText.substring(0, 100) + '...');
          
          let analysisData;
          try {
            // Check if the response is JSON or plain text
            if (analysisText.trim().startsWith('{')) {
              analysisData = JSON.parse(analysisText);
              console.log('Successfully parsed JSON response');
            } else {
              // If plain text (likely "No video detected" message)
              console.log('Received plain text response from Gemini');
              analysisData = { error: analysisText };
            }
          } catch (parseError) {
            // If JSON parsing fails, return the raw text
            console.error('JSON parsing error:', parseError);
            analysisData = { error: analysisText };
          }
          
          // Save analysis to database if it's a valid analysis (has exercise data)
          if (analysisData.exercise) {
            console.log('Saving analysis to database...');
            try {
              const { error: dbError } = await supabaseClient
                .from('form_analyses')
                .insert({
                  user_id: userId,
                  video_storage_path: videoPath,
                  analysis_data: analysisData,
                });
              
              if (dbError) {
                console.error('Error saving analysis to database:', dbError);
                // Continue anyway as we can still return the analysis to the user
              } else {
                console.log('Analysis saved to database successfully');
              }
            } catch (dbInsertError) {
              console.error('Database insert error:', dbInsertError);
              // Continue anyway as we can still return the analysis to the user
            }
          }
          
          // Return response with CORS headers
          console.log('Returning analysis to client');
          return new Response(
            JSON.stringify({ 
              success: true, 
              analysis: analysisData 
            }),
            { 
              status: 200, 
              headers: corsHeaders 
            }
          );
        } catch (geminiError) {
          console.error('Gemini API error:', geminiError);
          return new Response(
            JSON.stringify({ 
              error: 'Error analyzing video with AI', 
              details: String(geminiError)
            }),
            { status: 500, headers: corsHeaders }
          );
        }
      } catch (modelError) {
        console.error('Error creating Gemini model:', modelError);
        return new Response(
          JSON.stringify({ 
            error: 'Error initializing AI model', 
            details: String(modelError)
          }),
          { status: 500, headers: corsHeaders }
        );
      }
    } catch (storageError) {
      console.error('Storage operation error:', storageError);
      return new Response(
        JSON.stringify({ 
          error: 'Error accessing storage', 
          details: String(storageError)
        }),
        { status: 500, headers: corsHeaders }
      );
    }
  } catch (error) {
    console.error('Error in edge function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Server error', 
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        stack: error instanceof Error ? error.stack : undefined
      }),
      { status: 500, headers: corsHeaders }
    );
  }
});

// Helper function to convert Blob to base64
async function blobToBase64(blob: Blob): Promise<string> {
  try {
    console.log('Converting blob to base64, size:', blob.size, 'type:', blob.type);
    const buffer = await blob.arrayBuffer();
    const uint8Array = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < uint8Array.length; i++) {
      binary += String.fromCharCode(uint8Array[i]);
    }
    const result = btoa(binary);
    console.log('Base64 conversion complete, length:', result.length);
    return result;
  } catch (error) {
    console.error('Error in blobToBase64:', error);
    throw error;
  }
} 