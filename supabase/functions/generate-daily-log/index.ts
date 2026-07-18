import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// This endpoint spends paid Lovable AI credits, so CORS is locked to the site
// (was '*') and rate limiting is durable + shared across instances when the
// edge_rate_limits migration is applied (graceful in-memory fallback otherwise).
const ALLOWED_ORIGINS = [
  'https://voicelogpro.com',
  'https://www.voicelogpro.com',
  'http://localhost:8080',
];

function buildCorsHeaders(req: Request): Record<string, string> {
  const origin = req.headers.get('origin') ?? '';
  return {
    'Access-Control-Allow-Origin': ALLOWED_ORIGINS.includes(origin) ? origin : 'https://voicelogpro.com',
    'Vary': 'Origin',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };
}

// Allowed trade values for input validation
const ALLOWED_TRADES = ['electrical', 'plumbing', 'HVAC', 'hvac', 'Electrical', 'Plumbing'];

// Rate limits: per-IP per minute, plus a hard global daily cap on AI spend.
const RATE_LIMIT = 10; // requests per window per IP
const RATE_WINDOW_MS = 60 * 1000; // 1 minute
const GLOBAL_DAILY_CAP = 300; // total AI calls per day across all callers

// In-memory fallback limiter (per instance, resets on cold start). Only used
// when the durable store is unavailable (e.g. migration not yet applied).
const requestCounts = new Map<string, { count: number; resetTime: number }>();

const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

function getRateLimitKey(req: Request): string {
  // Take the LAST hop of X-Forwarded-For: appended by the edge proxy, so a
  // client sending its own XFF header cannot control it (the first entry can
  // be spoofed freely).
  const forwarded = req.headers.get('x-forwarded-for');
  if (!forwarded) return 'unknown';
  const hops = forwarded.split(',').map((h) => h.trim()).filter(Boolean);
  return hops[hops.length - 1] || 'unknown';
}

// Atomic shared counter via the edge_rate_increment() SQL function.
// Returns the new count for this window, or null if the durable store is
// unavailable (caller falls back to the in-memory limiter).
async function durableIncrement(key: string, windowSeconds: number): Promise<number | null> {
  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) return null;
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/edge_rate_increment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
      },
      body: JSON.stringify({ p_key: key, p_window_seconds: windowSeconds }),
    });
    if (!res.ok) return null;
    const count = await res.json();
    return typeof count === 'number' ? count : null;
  } catch {
    return null;
  }
}

function checkRateLimitFallback(key: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const record = requestCounts.get(key);

  if (!record || now > record.resetTime) {
    requestCounts.set(key, { count: 1, resetTime: now + RATE_WINDOW_MS });
    return { allowed: true, remaining: RATE_LIMIT - 1 };
  }

  if (record.count >= RATE_LIMIT) {
    return { allowed: false, remaining: 0 };
  }

  record.count++;
  return { allowed: true, remaining: RATE_LIMIT - record.count };
}

async function checkRateLimit(key: string): Promise<{ allowed: boolean; remaining: number }> {
  // Global daily cap first: hard ceiling on paid AI calls regardless of source.
  const globalCount = await durableIncrement('generate-daily-log:global', 86400);
  if (globalCount !== null && globalCount > GLOBAL_DAILY_CAP) {
    console.warn(`Global daily cap reached (${globalCount}/${GLOBAL_DAILY_CAP})`);
    return { allowed: false, remaining: 0 };
  }

  // Per-IP window: durable when available, in-memory per instance otherwise.
  const ipCount = await durableIncrement(`generate-daily-log:ip:${key}`, Math.floor(RATE_WINDOW_MS / 1000));
  if (ipCount !== null) {
    return { allowed: ipCount <= RATE_LIMIT, remaining: Math.max(0, RATE_LIMIT - ipCount) };
  }
  return checkRateLimitFallback(key);
}

serve(async (req) => {
  const corsHeaders = buildCorsHeaders(req);

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Apply rate limiting to prevent abuse
    const rateLimitKey = getRateLimitKey(req);
    const rateCheck = await checkRateLimit(rateLimitKey);

    if (!rateCheck.allowed) {
      console.warn(`Rate limit exceeded for ${rateLimitKey}`);
      return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }), {
        status: 429,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
          'Retry-After': '60'
        },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log(`Processing request from ${rateLimitKey}, remaining: ${rateCheck.remaining}`);

    // Parse and validate request body
    let requestBody;
    try {
      requestBody = await req.json();
    } catch {
      return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { trade } = requestBody;
    
    // Input validation: validate trade parameter
    if (trade !== undefined && trade !== null) {
      if (typeof trade !== 'string') {
        return new Response(JSON.stringify({ error: 'Trade must be a string' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      if (trade.length > 50) {
        return new Response(JSON.stringify({ error: 'Trade parameter too long' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      // Check against allowlist (case-insensitive)
      const normalizedTrade = trade.toLowerCase();
      if (!ALLOWED_TRADES.map(t => t.toLowerCase()).includes(normalizedTrade)) {
        return new Response(JSON.stringify({ error: 'Invalid trade specified. Allowed: electrical, plumbing, HVAC' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    // Sanitize trade for use in prompt (use default if not provided)
    const safeTrade = trade ? trade.toLowerCase() : 'electrical';
    
    // Get actual current date
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    const systemPrompt = `You are a construction field worker generating a realistic daily log entry. Generate a daily log that would be spoken by a subcontractor at the end of their work day.

IMPORTANT: Today's date is ${formattedDate}. You MUST use this exact date in the log.

The log MUST include:
- Date (use exactly: ${formattedDate}) and location
- Crew size and trade (${safeTrade})
- Weather conditions
- Work completed (3-4 bullet points)
- Any blockers or delays
- Materials used
- Safety notes

Format it exactly like this:
Daily Log — ${formattedDate}
Location: [Address]
Crew: [Number] ${safeTrade} workers on-site

Weather: [Temperature]°F, [conditions]

Work Completed:
• [Task 1]
• [Task 2]
• [Task 3]

Blockers:
• [Any delays or issues]

Materials Used:
• [Material 1]
• [Material 2]

Safety: [Brief safety note]

Keep it realistic, specific, and under 200 words. Use realistic construction terminology.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Generate a realistic daily construction log for ${formattedDate}. Make it sound like it was spoken by an experienced ${safeTrade} foreman. Include specific details that would be important for payment protection and dispute documentation.` }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Lovable AI error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'AI credits exhausted. Please add credits to continue.' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const transcript = data.choices?.[0]?.message?.content;

    if (!transcript) {
      throw new Error('No transcript generated');
    }

    console.log('Generated daily log:', transcript.substring(0, 100) + '...');

    return new Response(JSON.stringify({ transcript }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-daily-log:', error);
    return new Response(JSON.stringify({ error: 'Log generation failed. Please try again.' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
