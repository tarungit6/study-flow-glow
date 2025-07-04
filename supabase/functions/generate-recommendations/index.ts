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
    const { query } = await req.json();
    
    if (!query?.trim()) {
      return new Response(
        JSON.stringify({ error: 'Query is required' }), 
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get user from auth header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization required' }), 
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'User not authenticated' }), 
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Generating recommendations for query:', query);

    // Generate embedding using OpenAI
    const openAIKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIKey) {
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured' }), 
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const embeddingResponse = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'text-embedding-ada-002',
        input: query,
      }),
    });

    if (!embeddingResponse.ok) {
      console.error('OpenAI embedding error:', await embeddingResponse.text());
      return new Response(
        JSON.stringify({ error: 'Failed to generate embedding' }), 
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const embeddingData = await embeddingResponse.json();
    const queryEmbedding = embeddingData.data[0].embedding;

    console.log('Generated embedding, searching for similar content...');

    // Use the existing database function to find similar content
    const { data: similarContent, error: searchError } = await supabase.rpc(
      'get_lesson_recommendations',
      {
        query_embedding: queryEmbedding,
        match_threshold: 0.6,
        match_count: 3
      }
    );

    if (searchError) {
      console.error('Search error:', searchError);
      return new Response(
        JSON.stringify({ error: 'Failed to search content' }), 
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Found similar content:', similarContent?.length || 0, 'items');

    // Generate AI recommendations based on found content
    const recommendationsPrompt = `Based on the user's search query "${query}" and the following available educational content, generate 3 personalized learning recommendations.

Available content:
${similarContent?.map(content => 
  `- ${content.lesson_title} (${content.course_title}): ${content.lesson_content?.substring(0, 100)}...`
).join('\n') || 'No matching content found'}

Generate recommendations in this exact JSON format:
[
  {
    "title": "Clear, actionable recommendation title",
    "description": "Detailed description explaining why this is recommended",
    "recommendation_type": "one of: study, practice, review, explore",
    "priority": 1-3 (1=high, 2=medium, 3=low),
    "action_url": null
  }
]

Make recommendations specific to the query and helpful for learning progression.`;

    const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are an expert educational AI that creates personalized learning recommendations. Always respond with valid JSON only.' },
          { role: 'user', content: recommendationsPrompt }
        ],
        temperature: 0.7,
        max_tokens: 800,
      }),
    });

    if (!aiResponse.ok) {
      console.error('OpenAI chat error:', await aiResponse.text());
      return new Response(
        JSON.stringify({ error: 'Failed to generate recommendations' }), 
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const aiData = await aiResponse.json();
    let recommendations;
    
    try {
      recommendations = JSON.parse(aiData.choices[0].message.content);
    } catch (parseError) {
      console.error('Failed to parse AI response:', aiData.choices[0].message.content);
      // Fallback recommendations
      recommendations = [
        {
          title: `Explore "${query}" Learning Path`,
          description: `Start your learning journey with ${query}. We've found relevant content to help you build foundational knowledge.`,
          recommendation_type: "explore",
          priority: 1,
          action_url: null
        }
      ];
    }

    console.log('Generated recommendations:', recommendations.length);

    // Store recommendations in database
    const recommendationsToInsert = recommendations.map((rec: any) => ({
      user_id: user.id,
      title: rec.title,
      description: rec.description,
      recommendation_type: rec.recommendation_type,
      priority: rec.priority,
      action_url: rec.action_url,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
    }));

    const { error: insertError } = await supabase
      .from('recommendations')
      .insert(recommendationsToInsert);

    if (insertError) {
      console.error('Error inserting recommendations:', insertError);
      return new Response(
        JSON.stringify({ error: 'Failed to save recommendations' }), 
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Successfully stored recommendations');

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Recommendations generated successfully',
        count: recommendations.length 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-recommendations:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});