import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting embedding generation process...');

    // Get OpenAI API key
    const openAIKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIKey) {
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured' }), 
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create Supabase client with service role
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Fetch all course lessons that don't have embeddings yet
    const { data: lessons, error: lessonsError } = await supabase
      .from('course_lessons')
      .select(`
        id,
        title,
        content,
        module_id,
        course_modules!inner(course_id)
      `)
      .not('content', 'is', null);

    if (lessonsError) {
      console.error('Error fetching lessons:', lessonsError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch lessons' }), 
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Found ${lessons?.length || 0} lessons to process`);

    let processed = 0;
    let errors = 0;

    for (const lesson of lessons || []) {
      try {
        // Check if embedding already exists
        const { data: existing } = await supabase
          .from('course_lesson_vectors')
          .select('lesson_id')
          .eq('lesson_id', lesson.id)
          .single();

        if (existing) {
          console.log(`Skipping lesson ${lesson.id} - embedding already exists`);
          continue;
        }

        // Prepare text for embedding
        const textToEmbed = `${lesson.title}\n\n${lesson.content || ''}`.trim();
        
        if (!textToEmbed) {
          console.log(`Skipping lesson ${lesson.id} - no content to embed`);
          continue;
        }

        console.log(`Generating embedding for lesson: ${lesson.title}`);

        // Generate embedding using OpenAI
        const embeddingResponse = await fetch('https://api.openai.com/v1/embeddings', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openAIKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'text-embedding-ada-002',
            input: textToEmbed,
          }),
        });

        if (!embeddingResponse.ok) {
          const errorText = await embeddingResponse.text();
          console.error(`OpenAI embedding error for lesson ${lesson.id}:`, errorText);
          errors++;
          continue;
        }

        const embeddingData = await embeddingResponse.json();
        const embedding = embeddingData.data[0].embedding;

        // Store embedding in database
        const { error: insertError } = await supabase
          .from('course_lesson_vectors')
          .insert({
            lesson_id: lesson.id,
            course_id: lesson.course_modules.course_id,
            embedding: JSON.stringify(embedding)
          });

        if (insertError) {
          console.error(`Error storing embedding for lesson ${lesson.id}:`, insertError);
          errors++;
        } else {
          processed++;
          console.log(`Successfully processed lesson ${lesson.id}`);
        }

        // Add small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));

      } catch (error) {
        console.error(`Error processing lesson ${lesson.id}:`, error);
        errors++;
      }
    }

    console.log(`Embedding generation complete. Processed: ${processed}, Errors: ${errors}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Embedding generation completed',
        processed,
        errors,
        total: lessons?.length || 0
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-embeddings:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});