import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  target_audience: string | null;
  jurisdiction: string | null;
  published_at: string | null;
  keywords: string[] | null;
}

// Static blog posts (content/*.ts files) that exist as dedicated routes
const STATIC_POSTS = [
  {
    id: "static-texas-lien",
    slug: "texas-property-code-chapter-53-guide-2025",
    title: "Texas Property Code Chapter 53: The 2026 Guide for Electrical Subcontractors",
    excerpt: "Complete guide to Texas mechanics lien rights under Chapter 53. Monthly notice deadlines, fund trapping procedures, and documentation requirements for subcontractors.",
    target_audience: "Texas Electrical Subcontractor",
    jurisdiction: "Texas",
    published_at: "2025-01-15",
    keywords: ["Texas mechanics lien", "Texas Property Code Chapter 53"],
  },
  {
    id: "static-california-notice",
    slug: "california-20-day-preliminary-notice-guide-2026",
    title: "California 20-Day Preliminary Notice: The 2026 Guide for Subcontractors & Suppliers",
    excerpt: "Complete guide to California's 20-day preliminary notice (Civil Code 8200). Deadlines, exemptions, service requirements, and how daily logs prove notice timing.",
    target_audience: "California Subcontractors & Material Suppliers",
    jurisdiction: "California",
    published_at: "2026-07-21",
    keywords: ["California preliminary notice", "20-day preliminary notice"],
  },
  {
    id: "static-florida-nto",
    slug: "florida-notice-to-owner-45-day-guide-2026",
    title: "Florida Notice to Owner: The 2026 Guide for Subcontractors (45-Day Deadline)",
    excerpt: "Complete guide to Florida's Notice to Owner (NTO) under Chapter 713. The critical 45-day deadline, proper service procedures, exemptions, and how daily logs support lien claims.",
    target_audience: "Florida Subcontractors & Suppliers",
    jurisdiction: "Florida",
    published_at: "2026-07-21",
    keywords: ["Florida Notice to Owner", "Florida mechanics lien"],
  },
  {
    id: "static-daily-log",
    slug: "construction-daily-log-best-practices-legal-court",
    title: "Construction Daily Log Best Practices: What to Record for Legal Protection (2026)",
    excerpt: "Definitive guide to construction daily log best practices for legal protection. What to record, how often, photo requirements, and how courts use daily logs in lien disputes.",
    target_audience: "Subcontractors & Project Managers",
    jurisdiction: "National",
    published_at: "2026-07-21",
    keywords: ["construction daily log", "daily log best practices"],
  },
  {
    id: "static-ny-lien",
    slug: "new-york-lien-law-article-2-subcontractor-guide-2026",
    title: "New York Lien Law Article 2: The 2026 Guide for Subcontractors (8-Month Filing Window)",
    excerpt: "Complete guide to New York Lien Law Article 2 for subcontractors. 8-month filing window, trust fund provisions, and how daily logs prove last furnishing dates.",
    target_audience: "New York Subcontractors & Suppliers",
    jurisdiction: "New York",
    published_at: "2026-07-21",
    keywords: ["New York Lien Law", "New York mechanics lien"],
  },
  {
    id: "static-cheat-sheet",
    slug: "construction-lien-deadlines-cheat-sheet-2026",
    title: "Construction Lien Deadlines Cheat Sheet: 50-State Comparison (2026 Update)",
    excerpt: "State-by-state construction lien deadlines comparison. Preliminary notice windows, lien filing deadlines, and enforcement periods for all 50 states.",
    target_audience: "Multi-State Subcontractors & GCs",
    jurisdiction: "National",
    published_at: "2026-07-21",
    keywords: ["construction lien deadlines", "50-state comparison"],
  },
];

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("id, slug, title, excerpt, target_audience, jurisdiction, published_at, keywords")
        .eq("published", true)
        .order("published_at", { ascending: false });

      if (!error && data) {
        setPosts(data);
      }
      setLoading(false);
    }
    fetchPosts();
  }, []);

  // Combine static posts (always shown) with dynamic posts from Supabase
  const allPosts = [...STATIC_POSTS, ...posts];

  return (
    <>
      <Helmet>
        <title>Construction Law & Compliance Blog | VoiceLogPro</title>
        <meta name="description" content="Expert guides on construction lien law, payment protection, and daily documentation for subcontractors and project managers." />
        <link rel="canonical" href="https://voicelogpro.com/blog" />
      </Helmet>
      <JsonLd schema={{
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "Construction Law & Compliance Blog",
        description: "Expert guides on construction lien law, payment protection, and daily documentation for subcontractors and project managers.",
        url: "https://voicelogpro.com/blog",
        itemListOrder: "https://schema.org/ItemListOrderAscending",
        numberOfItems: allPosts.length,
        itemListElement: allPosts.map((post, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: post.title,
          url: `https://voicelogpro.com/blog/${post.slug}`
        }))
      }} />

      <div className="min-h-screen bg-background">
        <header className="border-b border-border">
          <div className="max-w-4xl mx-auto px-4 py-6 flex items-center justify-between">
            <Link to="/" className="font-display text-2xl uppercase text-foreground hover:text-primary transition-colors">
              VoiceLogPro
            </Link>
            <nav className="flex gap-6">
              <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
                Home
              </Link>
              <Link to="/crew-plan" className="text-muted-foreground hover:text-foreground transition-colors">
                Crew Plan
              </Link>
            </nav>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-12">
          <h1 className="headline-section text-foreground mb-4">
            Construction Law & Compliance
          </h1>
          <p className="body-large mb-12">
            Expert guidance on lien rights, payment protection, and documentation for the trades.
          </p>

          {loading ? (
            <div className="space-y-6">
              {allPosts.map((post) => (
                <Link
                  key={post.id}
                  to={`/blog/${post.slug}`}
                  className="card-industrial block hover:border-primary/50 transition-colors group"
                >
                  <div className="flex flex-wrap gap-2 mb-3">
                    {post.jurisdiction && (
                      <span className="text-xs font-medium px-2 py-1 bg-accent/20 text-accent rounded">
                        {post.jurisdiction}
                      </span>
                    )}
                    {post.target_audience && (
                      <span className="text-xs font-medium px-2 py-1 bg-secondary text-secondary-foreground rounded">
                        {post.target_audience}
                      </span>
                    )}
                  </div>
                  <h2 className="text-xl font-display uppercase text-foreground group-hover:text-primary transition-colors mb-2">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="text-muted-foreground line-clamp-2">
                      {post.excerpt}
                    </p>
                  )}
                  {post.published_at && (
                    <p className="text-sm text-muted-foreground mt-4">
                      {new Date(post.published_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {allPosts.map((post) => (
                <Link
                  key={post.id}
                  to={`/blog/${post.slug}`}
                  className="card-industrial block hover:border-primary/50 transition-colors group"
                >
                  <div className="flex flex-wrap gap-2 mb-3">
                    {post.jurisdiction && (
                      <span className="text-xs font-medium px-2 py-1 bg-accent/20 text-accent rounded">
                        {post.jurisdiction}
                      </span>
                    )}
                    {post.target_audience && (
                      <span className="text-xs font-medium px-2 py-1 bg-secondary text-secondary-foreground rounded">
                        {post.target_audience}
                      </span>
                    )}
                  </div>
                  <h2 className="text-xl font-display uppercase text-foreground group-hover:text-primary transition-colors mb-2">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="text-muted-foreground line-clamp-2">
                      {post.excerpt}
                    </p>
                  )}
                  {post.published_at && (
                    <p className="text-sm text-muted-foreground mt-4">
                      {new Date(post.published_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          )}
        </main>

        <Footer />
      </div>
    </>
  );
}
