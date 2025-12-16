import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Allowed trade values for input validation
const ALLOWED_TRADES = ['electrical', 'plumbing', 'HVAC', 'hvac', 'Electrical', 'Plumbing'];

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

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
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
