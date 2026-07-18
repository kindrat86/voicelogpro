import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Footer } from "@/components/Footer";
import { Helmet } from "react-helmet-async";
import { CTAButton } from "@/components/CTAButton";

interface BlogPostData {
  id: string;
  slug: string;
  title: string;
  meta_description: string | null;
  content: string;
  excerpt: string | null;
  target_audience: string | null;
  jurisdiction: string | null;
  published_at: string | null;
  keywords: string[] | null;
  faq_schema: Record<string, unknown> | null;
}

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPostData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function fetchPost() {
      if (!slug) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .single();

      if (error || !data) {
        setNotFound(true);
      } else {
        setPost(data as BlogPostData);
      }
      setLoading(false);
    }
    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (notFound || !post) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
        <h1 className="headline-section text-foreground mb-4">Post Not Found</h1>
        <p className="text-muted-foreground mb-6">
          The article you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/blog" className="text-primary hover:underline">
          ← Back to Blog
        </Link>
      </div>
    );
  }

  // Helper to validate URL is safe (blocks javascript:, data:, vbscript: protocols)
  const isSafeUrl = (url: string): boolean => {
    const trimmed = url.trim().toLowerCase();
    // Block dangerous protocols
    const dangerousProtocols = ['javascript:', 'data:', 'vbscript:', 'file:'];
    for (const protocol of dangerousProtocols) {
      if (trimmed.startsWith(protocol)) {
        return false;
      }
    }
    // Only allow http, https, or relative paths
    return /^(https?:\/\/|\/[^\/])/.test(trimmed);
  };

  // Helper to render inline markdown links
  const LINK_RE = /\[([^\]]+)\]\((https?:\/\/[^\s)]+|\/[^\s)]+)\)/g;

  const renderInlineLinks = (text: string): React.ReactNode => {
    const nodes: React.ReactNode[] = [];
    let lastIndex = 0;
    
    for (const match of text.matchAll(LINK_RE)) {
      const [full, label, url] = match;
      const index = match.index ?? 0;
      
      // Add text before the link
      if (index > lastIndex) {
        nodes.push(text.slice(lastIndex, index));
      }
      
      // Security: Validate URL before rendering
      if (!isSafeUrl(url)) {
        // Render as plain text if URL is unsafe
        nodes.push(label);
        lastIndex = index + full.length;
        continue;
      }
      
      const external = /^https?:\/\//.test(url);
      nodes.push(
        <a
          key={`${url}-${index}`}
          href={url}
          target={external ? "_blank" : undefined}
          rel={external ? "nofollow noreferrer" : undefined}
          className="text-primary underline hover:text-primary/80"
        >
          {label}
        </a>
      );
      lastIndex = index + full.length;
    }
    
    // Add remaining text
    if (lastIndex < text.length) {
      nodes.push(text.slice(lastIndex));
    }
    
    // Return original text if no links found
    return nodes.length > 0 ? nodes : text;
  };

  // Parse markdown content to HTML-like structure
  const renderContent = (content: string) => {
    const lines = content.split("\n");
    const elements: JSX.Element[] = [];
    let inTable = false;
    let tableRows: string[][] = [];
    let tableHeaders: string[] = [];
    let inList = false;
    let listItems: string[] = [];
    let listType: "ul" | "ol" = "ul";

    const flushList = () => {
      if (listItems.length > 0) {
        const ListTag = listType;
        elements.push(
          <ListTag key={elements.length} className={`${listType === "ol" ? "list-decimal" : "list-disc"} pl-6 mb-6 space-y-2 text-muted-foreground`}>
            {listItems.map((item, i) => (
              <li key={i}>{renderInlineLinks(item)}</li>
            ))}
          </ListTag>
        );
        listItems = [];
        inList = false;
      }
    };

    const flushTable = () => {
      if (tableRows.length > 0) {
        elements.push(
          <div key={elements.length} className="overflow-x-auto mb-6">
            <table className="w-full border-collapse">
              {tableHeaders.length > 0 && (
                <thead>
                  <tr className="border-b border-border">
                    {tableHeaders.map((header, i) => (
                      <th key={i} className="text-left p-3 font-semibold text-foreground bg-secondary/50">
                        {renderInlineLinks(header)}
                      </th>
                    ))}
                  </tr>
                </thead>
              )}
              <tbody>
                {tableRows.map((row, i) => (
                  <tr key={i} className="border-b border-border/50">
                    {row.map((cell, j) => (
                      <td key={j} className="p-3 text-muted-foreground">
                        {renderInlineLinks(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        tableRows = [];
        tableHeaders = [];
        inTable = false;
      }
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();

      // Table detection
      if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
        flushList();
        const cells = trimmed.slice(1, -1).split("|").map(c => c.trim());
        
        // Skip separator line
        if (cells.every(c => c.match(/^[-:]+$/))) {
          continue;
        }
        
        if (!inTable) {
          inTable = true;
          tableHeaders = cells;
        } else {
          tableRows.push(cells);
        }
        continue;
      } else if (inTable) {
        flushTable();
      }

      // Headers
      if (trimmed.startsWith("# ")) {
        flushList();
        elements.push(
          <h1 key={elements.length} className="text-3xl md:text-4xl font-display uppercase text-foreground mb-6 mt-8">
            {renderInlineLinks(trimmed.slice(2))}
          </h1>
        );
      } else if (trimmed.startsWith("## ")) {
        flushList();
        elements.push(
          <h2 key={elements.length} className="text-2xl md:text-3xl font-display uppercase text-foreground mb-4 mt-8">
            {renderInlineLinks(trimmed.slice(3))}
          </h2>
        );
      } else if (trimmed.startsWith("### ")) {
        flushList();
        elements.push(
          <h3 key={elements.length} className="text-xl font-semibold text-foreground mb-3 mt-6">
            {renderInlineLinks(trimmed.slice(4))}
          </h3>
        );
      }
      // Numbered list
      else if (trimmed.match(/^\d+\.\s/)) {
        if (!inList || listType !== "ol") {
          flushList();
          inList = true;
          listType = "ol";
        }
        listItems.push(trimmed.replace(/^\d+\.\s/, ""));
      }
      // Bullet list
      else if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
        if (!inList || listType !== "ul") {
          flushList();
          inList = true;
          listType = "ul";
        }
        listItems.push(trimmed.slice(2));
      }
      // Paragraph
      else if (trimmed.length > 0) {
        flushList();
        elements.push(
          <p key={elements.length} className="text-muted-foreground leading-relaxed mb-4">
            {renderInlineLinks(trimmed)}
          </p>
        );
      }
    }

    flushList();
    flushTable();

    return elements;
  };

  return (
    <>
      <Helmet>
        <title>{post.title} | VoiceLogPro</title>
        <meta name="description" content={post.meta_description || post.excerpt || post.title} />
        <link rel="canonical" href={`https://voicelogpro.com/blog/${post.slug}`} />
        {post.keywords && <meta name="keywords" content={post.keywords.join(", ")} />}
        {post.faq_schema && (
          <script type="application/ld+json">
            {JSON.stringify(post.faq_schema)}
          </script>
        )}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": post.title,
            "description": post.meta_description || post.excerpt,
            "datePublished": post.published_at,
            "author": {
              "@type": "Organization",
              "name": "VoiceLogPro"
            },
            "publisher": {
              "@type": "Organization",
              "name": "VoiceLogPro",
              "url": "https://voicelogpro.com"
            }
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-background">
        <header className="border-b border-border">
          <div className="max-w-4xl mx-auto px-4 py-6 flex items-center justify-between">
            <Link to="/" className="font-display text-2xl uppercase text-foreground hover:text-primary transition-colors">
              VoiceLogPro
            </Link>
            <nav className="flex gap-6">
              <Link to="/blog" className="text-muted-foreground hover:text-foreground transition-colors">
                Blog
              </Link>
              <Link to="/crew-plan" className="text-muted-foreground hover:text-foreground transition-colors">
                Crew Plan
              </Link>
            </nav>
          </div>
        </header>

        <main className="max-w-3xl mx-auto px-4 py-12">
          <Link to="/blog" className="text-primary hover:underline text-sm mb-6 inline-block">
            ← Back to Blog
          </Link>

          <div className="flex flex-wrap gap-2 mb-4">
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

          {post.published_at && (
            <p className="text-sm text-muted-foreground mb-6">
              {new Date(post.published_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          )}

          <article className="prose-custom">
            {renderContent(post.content)}
          </article>

          <div className="mt-12 pt-8 border-t border-border">
            <div className="card-industrial text-center">
              <h3 className="text-xl font-display uppercase text-foreground mb-3">
                Protect Your Payment Rights
              </h3>
              <p className="text-muted-foreground mb-6">
                VoiceLogPro turns your voice notes into court-ready daily reports with timestamps and photos.
              </p>
              <CTAButton />
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
