import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      query, 
      match_count = 10, 
      match_threshold = 0.7,
      filter_course_id,
      filter_difficulty,
      filter_grade_level 
    } = await req.json();

    if (!query) {
      throw new Error('Query text is required');
    }

    console.log('Getting recommendations for query:', query);

    // Generate embedding for the query
    const openAIResponse = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'text-embedding-3-small',
        input: query,
        encoding_format: 'float',
      }),
    });

    if (!openAIResponse.ok) {
      const error = await openAIResponse.json();
      throw new Error(`OpenAI API error: ${error.error?.message || 'Unknown error'}`);
    }

    const openAIData = await openAIResponse.json();
    const queryEmbedding = openAIData.data[0].embedding;

    console.log('Generated query embedding with dimension:', queryEmbedding.length);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Call the database function to get recommendations
    const { data, error } = await supabase.rpc('get_lesson_recommendations', {
      query_embedding: queryEmbedding,
      match_threshold,
      match_count,
      filter_course_id,
      filter_difficulty,
      filter_grade_level,
    });

    if (error) {
      console.error('Supabase RPC error:', error);
      throw new Error(`Database error: ${error.message}`);
    }

    console.log(`Found ${data?.length || 0} recommendations`);

    return new Response(
      JSON.stringify({ 
        recommendations: data || [],
        query,
        count: data?.length || 0
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in get-recommendations function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});