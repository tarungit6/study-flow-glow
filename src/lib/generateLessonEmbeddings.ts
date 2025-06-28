import 'dotenv/config';
import { supabase } from '../integrations/supabase/client';
import { OpenAI } from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  // @ts-ignore
  const { data: lessons, error: lessonsError } = await supabase
    .from('course_lessons')
    .select('id, title, content, module_id, course_modules(id, course_id)');

  if (lessonsError) {
    console.error('Error fetching lessons:', lessonsError);
    process.exit(1);
  }

  for (const lesson of lessons ?? []) {
    const { id: lesson_id, title, content, module_id, course_modules } = lesson;
    // course_modules is an array (because of the join)
    let course_id = Array.isArray(course_modules) && course_modules.length > 0 ? course_modules[0].course_id : undefined;

    // Fallback: fetch course_id directly if not present
    if (!course_id && module_id) {
      // fallback query
      const { data: moduleData, error: moduleError } = await supabase
        .from('course_modules')
        .select('course_id')
        .eq('id', module_id)
        .maybeSingle();
      if (moduleData && moduleData.course_id) {
        course_id = moduleData.course_id;
      }
    }

    if (!course_id) {
      console.warn(`Lesson ${lesson_id} has no course_id (module join failed). Skipping.`);
      continue;
    }
    const input = `title: ${title}\ncontent: ${content ?? ''}`;

    // @ts-ignore
    const { data: existing, error: existingError } = await supabase
      .from('course_lesson_vectors')
      .select('lesson_id')
      .eq('lesson_id', lesson_id)
      .maybeSingle();

    if (existingError) {
      console.error(`Error checking vector for lesson ${lesson_id}:`, existingError);
      continue;
    }

    try {
      const embeddingResponse = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input,
      });
      const embedding = embeddingResponse.data[0].embedding;

      // @ts-ignore
      const { error: upsertError } = await supabase
        .from('course_lesson_vectors')
        .upsert({
          lesson_id,
          course_id,
          embedding,
          created_at: new Date().toISOString(),
        });

      if (upsertError) {
        console.error(`Error upserting vector for lesson ${lesson_id}:`, upsertError);
      } else {
        console.log(`Processed lesson ${lesson_id}`);
      }
    } catch (err) {
      console.error(`OpenAI error for lesson ${lesson_id}:`, err);
    }

    await delay(100 + Math.floor(Math.random() * 200));
  }

  console.log('Done.');
}

main();