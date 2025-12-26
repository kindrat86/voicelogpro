import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.87.3";

/**
 * Cron-triggered blog post generator
 * 
 * This function is called by pg_cron once per day to generate a new blog post.
 * It selects the next post from the schedule and triggers the generate-blog-post function.
 */

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const startTime = Date.now();
  console.log("Internal Supabase Cron Triggered");
  console.log(`[${new Date().toISOString()}] Cron blog generator triggered`);

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY");
    
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !SUPABASE_ANON_KEY) {
      throw new Error("Supabase credentials not configured");
    }

    // SECURITY: Only accept service role key for cron jobs
    // The anon key is public and must NOT be allowed to trigger blog generation
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      console.warn("Unauthorized request: missing Authorization header");
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const token = authHeader.replace("Bearer ", "");
    
    // CRITICAL: Only service role key can trigger cron jobs
    // This prevents public anon key from being used to drain AI credits
    if (token !== SUPABASE_SERVICE_ROLE_KEY) {
      console.warn("Unauthorized request: only service role key allowed");
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("Request authenticated successfully");

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Get the next post to generate (least recently generated, active, by priority)
    const { data: nextPost, error: scheduleError } = await supabase
      .from('blog_schedule')
      .select('post_id, title, last_generated_at, generation_count')
      .eq('is_active', true)
      .order('last_generated_at', { ascending: true, nullsFirst: true })
      .order('priority', { ascending: true })
      .limit(1)
      .single();

    if (scheduleError || !nextPost) {
      console.log('No posts scheduled for generation');
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'No posts scheduled for generation' 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log(`Selected post for generation: ${nextPost.post_id} (${nextPost.title})`);
    console.log(`Last generated: ${nextPost.last_generated_at || 'never'}, count: ${nextPost.generation_count}`);

    // Call the generate-blog-post function with service role key for internal auth
    const generateUrl = `${SUPABASE_URL}/functions/v1/generate-blog-post`;
    
    const response = await fetch(generateUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      },
      body: JSON.stringify({ postId: nextPost.post_id }),
    });

    const result = await response.json();
    const duration = Date.now() - startTime;

    if (!response.ok) {
      console.error(`Generation failed for ${nextPost.post_id}:`, result);
      return new Response(JSON.stringify({ 
        success: false,
        postId: nextPost.post_id,
        error: 'Generation failed',
        duration: `${duration}ms`
      }), {
        status: response.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log(`Successfully generated ${nextPost.post_id} in ${duration}ms`);
    console.log(`Published: ${result.published}, FAQs: ${result.faqCount}`);
    
    if (result.validation?.warnings?.length) {
      console.warn('Validation warnings:', result.validation.warnings);
    }

    return new Response(JSON.stringify({ 
      success: true,
      postId: nextPost.post_id,
      title: nextPost.title,
      published: result.published,
      faqCount: result.faqCount,
      validation: result.validation,
      duration: `${duration}ms`
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error("Cron blog generator error:", error);
    
    return new Response(JSON.stringify({ 
      success: false,
      error: 'Blog generation failed',
      duration: `${duration}ms`
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
