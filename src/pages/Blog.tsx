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
        numberOfItems: posts.length,
        itemListElement: posts.map((post, i) => ({
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
              {[1, 2, 3].map((i) => (
                <div key={i} className="card-industrial animate-pulse">
                  <div className="h-6 bg-muted rounded w-3/4 mb-4" />
                  <div className="h-4 bg-muted rounded w-full mb-2" />
                  <div className="h-4 bg-muted rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="card-industrial text-center py-12">
              <p className="text-muted-foreground">
                Blog posts coming soon. Check back for expert guides on construction compliance.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {posts.map((post) => (
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
