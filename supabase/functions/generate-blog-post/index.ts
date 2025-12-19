import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.87.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// GEO-Optimized Content Template (2025 Standards)
const GEO_CONTENT_TEMPLATE = `
Generate a complete, publish-ready blog post following STRICT GEO (Generative Engine Optimization) standards.
The content will be extracted by AI search engines (ChatGPT, Perplexity, Gemini) as authoritative answers.

## CRITICAL RULES (NON-NEGOTIABLE)

### 1. ANSWER-FIRST RULE
Every H2 section MUST begin IMMEDIATELY with:
**Short answer:** <1–2 factual, direct sentences>

NO introductory text before the short answer. The short answer must be independently correct if extracted alone.

### 2. MODULAR WRITING
- Every paragraph must stand alone and make sense if extracted independently
- Avoid context-dependent references ("this," "that," "it") without restating the subject
- Paragraphs should be ≤ 700 characters
- Assume any paragraph may be quoted by an AI engine

### 3. ENTITY-FIRST COVERAGE
- Prioritize named legal entities: statutes, code chapters, regulations, standards
- Introduce the controlling authority early in each section
- Every entity in the entityPack MUST appear at least once in the article

### 4. CONVERSATIONAL LONG-TAIL INTENT
- H2 headings must be real questions a professional would ask
- Use jurisdictional and situational specificity
- Avoid generic keyword-style headings

### 5. VERIFIABLE AUTHORITY
Include:
- At least 1 structured markdown table (deadlines, thresholds, comparisons)
- At least 1 checklist (compliance steps, filing steps)
- At least 4 outbound authority links to .gov, .org, legislatures, courts, standards bodies
- Prefer primary sources over commentary
- Distribute links throughout the article

### 6. FACTUAL DISCIPLINE
- State deadlines, triggers, thresholds precisely
- If uncertain, explicitly state uncertainty and point to the authoritative source
- NEVER fabricate statutes, deadlines, or citations

## REQUIRED OUTPUT STRUCTURE

Your output MUST follow this exact order:

# {TITLE}

## TL;DR
- 3–5 bullet points with concrete takeaways
- Each bullet must be independently actionable

## Table of Contents
[Link each H2 as an anchor]

## Main Content (8–12 H2 sections)
[Each H2 follows the Answer-First Rule]

[Include at least one table]

[Include at least one checklist]

## Frequently Asked Questions
[3 questions with direct answers derived from article content]

---

FAQ_JSON_START
{"faqs":[
  {"q":"Question matching H2 or key topic?","a":"Direct factual answer under 50 words."},
  {"q":"Second question?","a":"Direct factual answer under 50 words."},
  {"q":"Third question?","a":"Direct factual answer under 50 words."},
  {"q":"Fourth question?","a":"Direct factual answer under 50 words."},
  {"q":"Fifth question?","a":"Direct factual answer under 50 words."},
  {"q":"Sixth question?","a":"Direct factual answer under 50 words."}
]}

## OUTPUT CONSTRAINTS
- Output pure markdown for the article
- Output valid JSON for FAQs after FAQ_JSON_START delimiter
- Do NOT explain reasoning
- Do NOT mention SEO, GEO, or prompts
- Do NOT reference being an AI
- No marketing language or filler
`;

// Jurisdiction-specific system prompts
const JURISDICTION_PROMPTS: Record<string, string> = {
  "Texas": `You are an expert on Texas construction law and mechanics lien rights.
Focus on Texas Property Code Chapter 53, monthly notice requirements, fund trapping procedures, and filing deadlines.
Key entities: Texas Property Code Chapter 53, Section 53.056 (monthly notices), Section 53.057 (fund trapping), Section 53.052 (lien affidavit).
Authority sources: Texas Legislature (statutes.capitol.texas.gov), Texas Secretary of State.`,

  "Virginia": `You are an expert on Virginia construction law, particularly federal contracting and data center projects.
Focus on constructive acceleration, schedule compression claims, and delay documentation.
Key entities: FAR 52.242-14 (Excusable Delays), AIA A401 (Standard Form of Agreement), Virginia data center boom.
Authority sources: Federal Acquisition Regulation (acquisition.gov), AIA Documents.`,

  "United Kingdom": `You are an expert on UK building safety regulations post-Grenfell.
Focus on Building Safety Act 2022, Golden Thread requirements, and digital record-keeping obligations.
Key entities: Building Safety Act 2022, Golden Thread, BS 8670 (competence), Higher-Risk Buildings, Building Safety Regulator.
Authority sources: UK Legislation (legislation.gov.uk), HSE, Building Safety Regulator guidance.`,

  "Florida": `You are an expert on Florida construction lien law.
Focus on Florida Statute 713, Notice to Owner requirements, first furnishing documentation, and lien filing.
Key entities: Florida Statute 713, Notice to Owner (NTO), 45-day deadline, first furnishing date, Claim of Lien.
Authority sources: Florida Legislature (leg.state.fl.us), Florida Construction Lien Law Manual.`,

  "International": `You are an expert on international construction dispute resolution and adjudication.
Focus on evidentiary standards for construction claims, contemporaneous records, and adjudication procedures.
Key entities: business records exception, contemporaneous records doctrine, FIDIC contracts, Security of Payment Acts.
Authority sources: FIDIC, various national adjudication bodies, case law.`
};

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
    return { articleContent: content, faqs: [] };
  }

  const articleContent = parts[0].trim();
  let jsonPart = parts[1].trim();
  
  // Clean up any markdown fences
  jsonPart = jsonPart.replace(/^```json?\s*/i, "").replace(/```\s*$/, "").trim();
  
  // Find the JSON object
  const jsonMatch = jsonPart.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    console.warn("No JSON object found in FAQ section");
    return { articleContent, faqs: [] };
  }
  
  try {
    const parsed = JSON.parse(jsonMatch[0]);
    
    if (!parsed.faqs || !Array.isArray(parsed.faqs)) {
      console.warn("Invalid FAQ structure");
      return { articleContent, faqs: [] };
    }

    const validFaqs = parsed.faqs.filter((faq: unknown) => {
      if (typeof faq !== "object" || faq === null) return false;
      const f = faq as Record<string, unknown>;
      return typeof f.q === "string" && typeof f.a === "string" && f.q.length > 0 && f.a.length > 0;
    }).slice(0, 10) as ParsedFAQ[];

    console.log(`Successfully parsed ${validFaqs.length} FAQs`);
    return { articleContent, faqs: validFaqs };
  } catch (e) {
    console.error("Failed to parse FAQ JSON:", e);
    return { articleContent, faqs: [] };
  }
}

// Build FAQPage schema
function buildFAQSchema(faqs: ParsedFAQ[]) {
  if (faqs.length === 0) return null;
  
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

// Validate GEO compliance
interface ValidationResult {
  passed: boolean;
  errors: string[];
  warnings: string[];
}

function validateGEOCompliance(content: string, entityPack: string[]): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Check for Answer-First rule
  const h2Sections = content.split(/(?=^## )/gm).filter(s => s.startsWith('## '));
  for (const section of h2Sections) {
    const lines = section.split('\n').filter(l => l.trim());
    if (lines.length > 1) {
      const firstContentLine = lines[1];
      if (!firstContentLine.includes('**Short answer:**')) {
        const heading = lines[0].replace('## ', '').substring(0, 50);
        warnings.push(`H2 "${heading}..." may be missing Answer-First format`);
      }
    }
  }
  
  // Check for required elements
  if (!content.includes('## TL;DR')) {
    errors.push('Missing TL;DR section');
  }
  
  if (!content.includes('|') || !content.includes('---')) {
    warnings.push('May be missing required table');
  }
  
  if (!content.includes('- [ ]') && !content.includes('- [x]')) {
    warnings.push('May be missing checklist');
  }
  
  // Check entity coverage
  for (const entity of entityPack) {
    if (!content.toLowerCase().includes(entity.toLowerCase())) {
      warnings.push(`Entity "${entity}" not found in content`);
    }
  }
  
  // Check for authority links
  const linkMatches = content.match(/\[([^\]]+)\]\(https?:\/\/[^)]+\)/g) || [];
  const govOrgLinks = linkMatches.filter(l => 
    l.includes('.gov') || l.includes('.org') || l.includes('legislation.')
  );
  if (govOrgLinks.length < 3) {
    warnings.push(`Only ${govOrgLinks.length} authority links found (recommend 4+)`);
  }
  
  return {
    passed: errors.length === 0,
    errors,
    warnings
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) throw new Error("Supabase credentials not configured");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");
    if (!SUPABASE_SERVICE_ROLE_KEY) throw new Error("SUPABASE_SERVICE_ROLE_KEY not configured");

    // Authenticate the request - require valid authorization
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.warn("Unauthorized request: missing Authorization header");
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const token = authHeader.replace('Bearer ', '');
    let userId = 'unknown';
    let isServiceCall = false;

    // Check if this is a service role call (from cron-blog-generator or admin)
    if (token === SUPABASE_SERVICE_ROLE_KEY) {
      userId = 'service-role';
      isServiceCall = true;
      console.log("Authenticated via service role key");
    } else {
      // Verify as user JWT
      const authSupabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        global: { headers: { Authorization: authHeader } }
      });

      const { data: { user }, error: authError } = await authSupabase.auth.getUser();
      if (authError || !user) {
        console.warn("Unauthorized request: invalid user JWT");
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      userId = user.id;
      console.log(`Authenticated as user: ${userId}`);
    }

    // Parse request body
    let postId: string | undefined;
    try {
      const body = await req.json();
      postId = body.postId;
    } catch {
      // If no body, we'll select the next scheduled post
    }

    // Validate postId format if provided (alphanumeric, hyphens, max 100 chars)
    if (postId !== undefined) {
      if (typeof postId !== 'string') {
        return new Response(JSON.stringify({ error: 'Invalid request' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (postId.length > 100) {
        return new Response(JSON.stringify({ error: 'Invalid request' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      // Only allow alphanumeric, hyphens, and underscores
      if (!/^[a-zA-Z0-9_-]+$/.test(postId)) {
        return new Response(JSON.stringify({ error: 'Invalid request' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    // Use service role for database operations
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Get post configuration from schedule table
    let postConfig;
    if (postId) {
      const { data, error } = await supabase
        .from('blog_schedule')
        .select('*')
        .eq('post_id', postId)
        .eq('is_active', true)
        .single();
      
      if (error || !data) {
        console.warn(`Post not found: ${postId}`);
        return new Response(JSON.stringify({ error: 'Post not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      postConfig = data;
    } else {
      // Select next post to generate (least recently generated, by priority)
      const { data, error } = await supabase
        .from('blog_schedule')
        .select('*')
        .eq('is_active', true)
        .order('last_generated_at', { ascending: true, nullsFirst: true })
        .order('priority', { ascending: true })
        .limit(1)
        .single();
      
      if (error || !data) {
        console.log('No posts scheduled for generation');
        return new Response(JSON.stringify({ error: 'No posts available' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      postConfig = data;
    }

    // Sanitize database content before using in prompts (prevent prompt injection)
    const sanitizeForPrompt = (str: string): string => {
      return str
        .replace(/```/g, '') // Remove code fences
        .replace(/\n{3,}/g, '\n\n') // Collapse multiple newlines
        .substring(0, 500); // Limit length
    };
    
    const sanitizeArray = (arr: string[]): string[] => {
      return arr.map(item => sanitizeForPrompt(item).substring(0, 100)).slice(0, 20);
    };

    console.log(`Generating blog post: ${postConfig.post_id} for ${isServiceCall ? 'service-role' : userId}`);

    // Get jurisdiction-specific system prompt
    const jurisdictionPrompt = JURISDICTION_PROMPTS[postConfig.jurisdiction] || JURISDICTION_PROMPTS["International"];

    // Generate blog content using Lovable AI
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro", // Using Pro for higher quality legal content
        messages: [
          { 
            role: "system", 
            content: `You are an AI legal-content engine specializing in construction law, payment protection, and compliance documentation.

Your goal: Become the canonical definition source that AI search engines (ChatGPT, Perplexity, Gemini) quote verbatim.

AUDIENCE: Experts under time pressure
- Subcontractors protecting payment rights
- Project managers defending delay claims  
- Construction lawyers seeking authoritative summaries

TONE: Factual, direct, authoritative. No marketing fluff. Answers first, explanations second.

${jurisdictionPrompt}

ENTITY PACK (MUST INCLUDE ALL):
${sanitizeArray(postConfig.entity_pack || []).join(', ')}`
          },
          { 
            role: "user", 
            content: `${GEO_CONTENT_TEMPLATE}

---

GENERATE NOW:

Title: ${sanitizeForPrompt(postConfig.title)}
Target Audience: ${sanitizeForPrompt(postConfig.target_audience)}
Jurisdiction: ${sanitizeForPrompt(postConfig.jurisdiction)}
Keywords: ${sanitizeArray(postConfig.keywords || []).join(", ")}
Required Entities: ${sanitizeArray(postConfig.entity_pack || []).join(", ")}`
          }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded' }), {
          status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'AI credits exhausted' }), {
          status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const rawContent = data.choices?.[0]?.message?.content;
    if (!rawContent) throw new Error("No content generated");

    // Parse FAQs and validate
    const { articleContent, faqs } = parseFAQsFromContent(rawContent);
    const validation = validateGEOCompliance(articleContent, postConfig.entity_pack);
    
    console.log(`Content validation: ${validation.passed ? 'PASSED' : 'FAILED'}`);
    if (validation.errors.length) console.error('Validation errors:', validation.errors);
    if (validation.warnings.length) console.warn('Validation warnings:', validation.warnings);

    // Build FAQ schema
    const faqSchema = buildFAQSchema(faqs);

    // Create slug
    const slug = postConfig.post_id;

    // Extract excerpt from TL;DR or first paragraph
    const tldrMatch = articleContent.match(/## TL;DR[\s\S]*?(?=##|$)/);
    const excerpt = tldrMatch 
      ? tldrMatch[0].replace('## TL;DR', '').trim().substring(0, 300)
      : postConfig.title;

    // Upsert post to database
    const { data: post, error: dbError } = await supabase
      .from("blog_posts")
      .upsert({
        slug,
        title: postConfig.title,
        meta_description: `${postConfig.title} - Expert guidance for ${postConfig.target_audience.toLowerCase()}s on ${postConfig.jurisdiction} construction compliance.`,
        content: articleContent,
        excerpt,
        keywords: postConfig.keywords,
        target_audience: postConfig.target_audience,
        jurisdiction: postConfig.jurisdiction,
        faq_schema: faqSchema,
        published: validation.passed, // Only publish if validation passes
        published_at: validation.passed ? new Date().toISOString() : null,
      }, { onConflict: "slug" })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      throw new Error('Failed to save content');
    }

    // Update schedule tracking
    await supabase
      .from("blog_schedule")
      .update({
        last_generated_at: new Date().toISOString(),
        generation_count: postConfig.generation_count + 1,
      })
      .eq("post_id", postConfig.post_id);

    console.log(`Blog post generated: ${slug}, published: ${validation.passed}, FAQs: ${faqs.length}`);

    return new Response(JSON.stringify({ 
      success: true, 
      post,
      faqCount: faqs.length,
      validation,
      published: validation.passed
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error generating blog post:", error);
    return new Response(JSON.stringify({ error: 'Content generation failed' }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
