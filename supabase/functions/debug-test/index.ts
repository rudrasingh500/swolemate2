import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

// Simple debug function to test Edge function execution
serve(async (req) => {
  // Set CORS headers
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
    // Check environment variables
    const envStatus = {
      supabaseUrl: Boolean(Deno.env.get('SUPABASE_URL')),
      supabaseKey: Boolean(Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')),
      geminiApiKey: Boolean(Deno.env.get('GEMINI_API_KEY'))
    };

    // Get request data if any
    let requestData = {};
    try {
      if (req.bodyUsed === false && req.headers.get('content-type')?.includes('application/json')) {
        requestData = await req.json();
      }
    } catch (e) {
      // Ignore errors from parsing the body
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Debug edge function is working',
        timestamp: new Date().toISOString(),
        environment: envStatus,
        request: {
          method: req.method,
          url: req.url,
          headers: Object.fromEntries([...req.headers.entries()].map(([k, v]) => 
            [k, k.toLowerCase().includes('key') || k.toLowerCase().includes('auth') ? '[REDACTED]' : v]
          )),
          data: requestData
        }
      }),
      { 
        status: 200, 
        headers: corsHeaders 
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      }),
      { 
        status: 500, 
        headers: corsHeaders 
      }
    );
  }
}); 