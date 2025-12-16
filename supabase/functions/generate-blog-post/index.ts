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

## FAQ
{2-3 additional questions and direct answers}

REQUIREMENTS:
- Use exact statute numbers and dates
- Include specific deadlines (e.g., "by the 15th day of the third month")
- Reference how Voice Log Pro or daily documentation helps at each step
- Keep language direct - written for foremen, trusted by lawyers
- No corporate fluff or marketing language
- Every claim must be actionable
`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { postId } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) throw new Error("Supabase credentials not configured");

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Find post config
    const postConfig = POST_CONFIGS.find(p => p.id === postId) || POST_CONFIGS[0];

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
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) throw new Error("No content generated");

    // Generate FAQ schema
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": postConfig.keywords.slice(0, 2).map(keyword => ({
        "@type": "Question",
        "name": `What are the requirements for ${keyword}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `See the detailed guide on ${postConfig.title} for specific requirements and deadlines.`
        }
      }))
    };

    // Create slug from post ID
    const slug = postConfig.id;

    // Extract first paragraph as excerpt
    const excerptMatch = content.match(/##[^\n]+\n+([^\n]+)/);
    const excerpt = excerptMatch ? excerptMatch[1].substring(0, 300) : postConfig.title;

    // Insert or update post in database
    const { data: post, error } = await supabase
      .from("blog_posts")
      .upsert({
        slug,
        title: postConfig.title,
        meta_description: `${postConfig.title} - Expert guidance for ${postConfig.targetAudience.toLowerCase()}s on construction compliance and payment protection.`,
        content,
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

    return new Response(JSON.stringify({ success: true, post }), {
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
