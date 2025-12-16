import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.87.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Blog post configurations from the content calendar
const POST_CONFIGS = [
  {
    id: "texas-lien-law",
    title: "Texas Property Code Chapter 53: The 2025 Guide for Electrical Subcontractors",
    targetAudience: "Texas Subcontractor",
    jurisdiction: "Texas",
    keywords: ["Texas mechanics lien", "monthly notice requirement", "fund trapping", "construction daily log"],
    systemPrompt: `You are writing for Texas electrical subcontractors who need to protect their lien rights. Focus on:
- Texas Property Code Chapter 53 requirements
- Monthly notice deadlines (15th of 2nd month to GC, 15th of 3rd month to owner)
- Fund trapping procedures
- How daily logs support lien claims`
  },
  {
    id: "data-center-acceleration",
    title: "Constructive Acceleration in Data Center Construction: How to Get Paid for Overtime",
    targetAudience: "Data Center Project Manager",
    jurisdiction: "Virginia",
    keywords: ["schedule compression claims", "excusable delay", "Northern Virginia data center", "daily construction report evidence"],
    systemPrompt: `You are writing for project managers on Northern Virginia data center projects. Focus on:
- Constructive acceleration vs directed acceleration
- Documenting schedule compression
- Evidence needed for overtime cost recovery
- AIA A401 requirements for daily reports`
  },
  {
    id: "daily-logs-adjudication",
    title: "Daily Logs vs. Site Diaries: What Wins in Adjudication?",
    targetAudience: "Global Construction Professional",
    jurisdiction: "International",
    keywords: ["construction adjudication evidence", "contemporaneous records", "security of payment act evidence"],
    systemPrompt: `You are writing a comparison piece for construction professionals globally. Focus on:
- Difference between daily logs and site diaries
- What adjudicators and arbitrators accept as evidence
- Requirements for contemporaneous records
- Best practices for evidentiary documentation`
  },
  {
    id: "uk-golden-thread",
    title: "The \"Golden Thread\" Explained: Digital Record Keeping for UK Subcontractors",
    targetAudience: "UK Subcontractor",
    jurisdiction: "United Kingdom",
    keywords: ["Building Safety Act 2022", "Golden Thread guidance", "digital site records", "BS 8670 competence"],
    systemPrompt: `You are writing for UK subcontractors about post-Grenfell regulatory requirements. Focus on:
- Building Safety Act 2022 requirements
- Golden Thread of building information
- Digital record-keeping obligations
- BS 8670 competence requirements`
  },
  {
    id: "florida-nto",
    title: "Florida Notice to Owner (NTO): Proving \"First Furnishing\" Date",
    targetAudience: "Florida Subcontractor",
    jurisdiction: "Florida",
    keywords: ["Florida Statute 713", "Notice to Owner deadline", "proof of first furnishing", "daily log timestamp"],
    systemPrompt: `You are writing for Florida subcontractors about protecting lien rights. Focus on:
- Florida Statute 713 requirements
- 45-day NTO deadline from first furnishing
- How to prove first furnishing date
- Using daily logs with timestamps as evidence`
  }
];

// Valid post IDs for validation
const VALID_POST_IDS = POST_CONFIGS.map(p => p.id);

const CONTENT_TEMPLATE = `
Generate a complete blog post following this EXACT structure. No introductions, no fluff. Answer first, explanation second.

POST STRUCTURE:

# {TITLE}

## {Primary Question as H2}
{Direct answer paragraph - 2-3 sentences with exact dates, statute names, no hedging}

## Key Deadlines and Requirements
{Create a markdown table with columns: Action | Deadline | Risk Level | Reference}

## How to Document Compliance
{Numbered list of 4-5 specific steps using construction daily logs}
{Each step should mention: what to record, format requirements, how it supports the legal requirement}

## Common Failure Points
{Bullet list of 3-4 tactical failure points - things that actually go wrong}

## Frequently Asked Questions
{3 questions with direct answers - do NOT use "See the guide" placeholders}

REQUIREMENTS:
- Use exact statute numbers and dates
- Include specific deadlines (e.g., "by the 15th day of the third month")
- Reference how Voice Log Pro or daily documentation helps at each step
- Keep language direct - written for foremen, trusted by lawyers
- No corporate fluff or marketing language
- Every claim must be actionable

CITATIONS REQUIREMENT (MANDATORY):
- You MUST include at least 3 outbound links to authoritative official sources from .gov or .org domains.
- Use Markdown link syntax: [Source title](https://...).
- Preferred sources: official statutes (.gov), standards bodies (.org), court decisions, official guidance documents.
- Do NOT invent URLs. If you cannot provide an official URL, remove or rephrase the claim.
- Distribute links throughout the article, not all in one place.

CRITICAL: At the very end of your response, output FAQ_JSON_START on its own line, followed immediately by a strict JSON object with exactly 3 FAQs. Use this exact format:
FAQ_JSON_START
{"faqs":[{"q":"Question 1?","a":"Direct answer under 40 words."},{"q":"Question 2?","a":"Direct answer under 40 words."},{"q":"Question 3?","a":"Direct answer under 40 words."}]}

Rules for FAQ JSON:
- No markdown code fences around the JSON
- No text after the closing brace
- Each answer's first sentence must be under 40 words and purely factual
- FAQs must be derived from the article content and match the jurisdiction
- Must be valid JSON parsable by JSON.parse()
`;

// Helper to parse FAQ JSON from model output
interface ParsedFAQ {
  q: string;
  a: string;
}

interface FAQParseResult {
  articleContent: string;
  faqs: ParsedFAQ[];
}

function parseFAQsFromContent(content: string): FAQParseResult {
  const delimiter = "FAQ_JSON_START";
  const parts = content.split(delimiter);
  
  if (parts.length < 2) {
    console.warn("FAQ_JSON_START delimiter not found, using fallback FAQs");
    return {
      articleContent: content,
      faqs: []
    };
  }

  const articleContent = parts[0].trim();
  let jsonPart = parts[1].trim();
  
  // Clean up any markdown fences if the model added them despite instructions
  jsonPart = jsonPart.replace(/^```json?\s*/i, "").replace(/```\s*$/, "").trim();
  
  try {
    const parsed = JSON.parse(jsonPart);
    
    // Validate structure
    if (!parsed.faqs || !Array.isArray(parsed.faqs) || parsed.faqs.length === 0) {
      console.warn("Invalid FAQ structure, faqs array missing or empty");
      return { articleContent, faqs: [] };
    }

    // Validate each FAQ has q and a strings
    const validFaqs = parsed.faqs.filter((faq: unknown) => {
      if (typeof faq !== "object" || faq === null) return false;
      const f = faq as Record<string, unknown>;
      return typeof f.q === "string" && typeof f.a === "string" && f.q.length > 0 && f.a.length > 0;
    }).slice(0, 3) as ParsedFAQ[];

    if (validFaqs.length === 0) {
      console.warn("No valid FAQs found after validation");
      return { articleContent, faqs: [] };
    }

    console.log(`Successfully parsed ${validFaqs.length} FAQs`);
    return { articleContent, faqs: validFaqs };
  } catch (e) {
    console.error("Failed to parse FAQ JSON:", e);
    console.error("Raw JSON part:", jsonPart.substring(0, 500));
    return { articleContent, faqs: [] };
  }
}

// Build FAQPage schema from parsed FAQs
function buildFAQSchema(faqs: ParsedFAQ[], fallbackTitle: string, fallbackKeywords: string[]) {
  // If we have parsed FAQs, use them
  if (faqs.length > 0) {
    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map(faq => ({
        "@type": "Question",
        "name": faq.q,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.a
        }
      }))
    };
  }
  
  // Fallback to keyword-based FAQs (weak but better than nothing)
  console.warn("Using fallback keyword-based FAQ schema");
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": fallbackKeywords.slice(0, 2).map(keyword => ({
      "@type": "Question",
      "name": `What are the requirements for ${keyword}?`,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": `See the detailed guide on ${fallbackTitle} for specific requirements and deadlines.`
      }
    }))
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // ===== AUTHENTICATION CHECK =====
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.warn('Unauthenticated request to generate-blog-post rejected');
      return new Response(JSON.stringify({ error: 'Unauthorized: Authentication required' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY");
    
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      throw new Error("Supabase credentials not configured");
    }

    // Verify the user is authenticated
    const authSupabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: authHeader } }
    });

    const { data: { user }, error: authError } = await authSupabase.auth.getUser();
    if (authError || !user) {
      console.warn('Invalid auth token in generate-blog-post:', authError?.message);
      return new Response(JSON.stringify({ error: 'Unauthorized: Invalid token' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Authenticated request from user: ${user.id}`);
    // ===== END AUTHENTICATION CHECK =====

    // ===== INPUT VALIDATION =====
    let requestBody;
    try {
      requestBody = await req.json();
    } catch {
      return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { postId } = requestBody;
    
    // Validate postId
    if (!postId) {
      return new Response(JSON.stringify({ error: 'postId is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    if (typeof postId !== 'string') {
      return new Response(JSON.stringify({ error: 'postId must be a string' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    if (postId.length > 100) {
      return new Response(JSON.stringify({ error: 'postId too long' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    // Validate against known post IDs
    if (!VALID_POST_IDS.includes(postId)) {
      return new Response(JSON.stringify({ 
        error: 'Invalid postId',
        validIds: VALID_POST_IDS 
      }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    // ===== END INPUT VALIDATION =====
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");
    if (!SUPABASE_SERVICE_ROLE_KEY) throw new Error("SUPABASE_SERVICE_ROLE_KEY not configured");

    // Use service role for database operations
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Find post config (already validated above)
    const postConfig = POST_CONFIGS.find(p => p.id === postId)!;

    // Generate blog content using Lovable AI
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { 
            role: "system", 
            content: `You are an AI legal-content engine specializing in construction law, payment protection, and delay claims for subcontractors.
Your goal is to become the canonical definition source that Google, ChatGPT, Claude, and Perplexity quote verbatim.

Write for experts under time pressure:
- Subcontractors protecting payment rights
- Project managers defending delay claims
- Construction lawyers looking for authoritative summaries

You do not write marketing fluff. You write answers first, explanations second.

${postConfig.systemPrompt}`
          },
          { 
            role: "user", 
            content: `${CONTENT_TEMPLATE.replace("{TITLE}", postConfig.title)}

Topic: ${postConfig.title}
Target Audience: ${postConfig.targetAudience}
Jurisdiction: ${postConfig.jurisdiction}
Keywords to address naturally: ${postConfig.keywords.join(", ")}`
          }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }), {
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
    const rawContent = data.choices?.[0]?.message?.content;

    if (!rawContent) throw new Error("No content generated");

    // Parse FAQs from the model output
    const { articleContent, faqs } = parseFAQsFromContent(rawContent);
    console.log(`Parsed content: ${articleContent.length} chars, ${faqs.length} FAQs`);

    // Build FAQ schema using parsed FAQs (or fallback)
    const faqSchema = buildFAQSchema(faqs, postConfig.title, postConfig.keywords);

    // Create slug from post ID
    const slug = postConfig.id;

    // Extract first paragraph as excerpt
    const excerptMatch = articleContent.match(/##[^\n]+\n+([^\n]+)/);
    const excerpt = excerptMatch ? excerptMatch[1].substring(0, 300) : postConfig.title;

    // Insert or update post in database
    const { data: post, error } = await supabase
      .from("blog_posts")
      .upsert({
        slug,
        title: postConfig.title,
        meta_description: `${postConfig.title} - Expert guidance for ${postConfig.targetAudience.toLowerCase()}s on construction compliance and payment protection.`,
        content: articleContent,
        excerpt,
        keywords: postConfig.keywords,
        target_audience: postConfig.targetAudience,
        jurisdiction: postConfig.jurisdiction,
        faq_schema: faqSchema,
        published: true,
        published_at: new Date().toISOString(),
      }, { onConflict: "slug" })
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);
      throw new Error(`Database error: ${error.message}`);
    }

    console.log(`Blog post generated successfully: ${slug} by user ${user.id}`);

    return new Response(JSON.stringify({ success: true, post, faqCount: faqs.length }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error generating blog post:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
