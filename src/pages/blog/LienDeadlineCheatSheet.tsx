import { Helmet } from "react-helmet-async";
import { JsonLd } from "@/components/JsonLd";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft, FileText, Calendar, MapPin } from "lucide-react";
import lienDeadlineCheatSheet from "@/content/blog/construction-lien-deadlines-cheat-sheet";

export default function LienDeadlineCheatSheetPage() {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{lienDeadlineCheatSheet.title} | VoiceLogPro</title>
        <meta name="description" content={lienDeadlineCheatSheet.metaDescription} />
        <meta name="keywords" content={lienDeadlineCheatSheet.keywords.join(", ")} />
        <link rel="canonical" href={`https://voicelogpro.com/blog/${lienDeadlineCheatSheet.slug}`} />
        <meta property="og:title" content={lienDeadlineCheatSheet.title} />
        <meta property="og:description" content={lienDeadlineCheatSheet.metaDescription} />
        <meta property="og:type" content="article" />
      </Helmet>
      
      <JsonLd schema={lienDeadlineCheatSheet.faqSchema} />
      
      <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center px-4">
          <Link to="/blog" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Blog</span>
          </Link>
        </div>
      </header>

      <article className="container max-w-4xl px-4 py-12">
        <header className="mb-12">
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
            <span className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {lienDeadlineCheatSheet.jurisdiction}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {new Date(lienDeadlineCheatSheet.publishedAt).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </span>
            <span className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              {lienDeadlineCheatSheet.targetAudience}
            </span>
          </div>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-6">
            {lienDeadlineCheatSheet.title}
          </h1>
          
          <p className="text-lg text-muted-foreground leading-relaxed">
            {lienDeadlineCheatSheet.metaDescription}
          </p>
        </header>

        <div className="prose prose-slate dark:prose-invert max-w-none
          prose-headings:scroll-mt-20
          prose-h2:text-2xl prose-h2:font-bold prose-h2:mt-12 prose-h2:mb-4 prose-h2:text-foreground
          prose-h3:text-xl prose-h3:font-semibold prose-h3:mt-8 prose-h3:mb-3 prose-h3:text-foreground
          prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:mb-4
          prose-strong:text-foreground prose-strong:font-semibold
          prose-a:text-primary prose-a:no-underline hover:prose-a:underline
          prose-ul:text-muted-foreground prose-ol:text-muted-foreground
          prose-li:mb-2
          prose-table:border-collapse prose-table:w-full
          prose-th:border prose-th:border-border prose-th:bg-muted prose-th:px-4 prose-th:py-2 prose-th:text-left prose-th:font-semibold
          prose-td:border prose-td:border-border prose-td:px-4 prose-td:py-2
          prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
          prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4 prose-blockquote:italic
        ">
          <MarkdownContent content={lienDeadlineCheatSheet.content} />
        </div>

        <section className="mt-16 p-8 bg-muted/50 rounded-lg border border-border">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Never Miss a Lien Deadline Again
          </h2>
          <p className="text-muted-foreground mb-6">
            VoiceLogPro documents your first and last furnishing dates automatically — the foundation data for every lien deadline calculation.
          </p>
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
            <Link to="/crew-plan">Get VoiceLogPro — $49/month</Link>
          </Button>
        </section>

        <footer className="mt-12 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground">
            <strong>Disclaimer:</strong> This content is for educational purposes only and does not constitute legal advice. 
            State lien laws change frequently. Consult a licensed attorney in your jurisdiction for specific legal guidance.
          </p>
        </footer>
      </article>

      <Footer />
    </div>
  );
}

function MarkdownContent({ content }: { content: string }) {
  const lines = content.split('\n');
  const elements: JSX.Element[] = [];
  let currentTable: string[] = [];
  let inTable = false;
  let listItems: string[] = [];
  let listType: 'ul' | 'ol' | 'checklist' | null = null;

  const processInlineMarkdown = (text: string): (string | JSX.Element)[] => {
    const parts: (string | JSX.Element)[] = [];
    let remaining = text;
    let keyIndex = 0;

    while (remaining.length > 0) {
      const linkMatch = remaining.match(/\[([^\]]+)\]\(([^)]+)\)/);
      const boldMatch = remaining.match(/\*\*([^*]+)\*\*/);
      const codeMatch = remaining.match(/`([^`]+)`/);

      const matches = [
        linkMatch ? { type: 'link', match: linkMatch, index: remaining.indexOf(linkMatch[0]) } : null,
        boldMatch ? { type: 'bold', match: boldMatch, index: remaining.indexOf(boldMatch[0]) } : null,
        codeMatch ? { type: 'code', match: codeMatch, index: remaining.indexOf(codeMatch[0]) } : null,
      ].filter(Boolean).sort((a, b) => (a?.index ?? 0) - (b?.index ?? 0));

      if (matches.length === 0) {
        parts.push(remaining);
        break;
      }

      const first = matches[0]!;
      if (first.index > 0) {
        parts.push(remaining.slice(0, first.index));
      }

      if (first.type === 'link') {
        parts.push(
          <a key={keyIndex++} href={first.match![2]} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
            {first.match![1]}
          </a>
        );
      } else if (first.type === 'bold') {
        parts.push(<strong key={keyIndex++}>{first.match![1]}</strong>);
      } else if (first.type === 'code') {
        parts.push(<code key={keyIndex++} className="bg-muted px-1.5 py-0.5 rounded text-sm">{first.match![1]}</code>);
      }

      remaining = remaining.slice(first.index + first.match![0].length);
    }

    return parts;
  };

  const flushList = () => {
    if (listItems.length > 0 && listType) {
      const items = listItems.map((item, i) => {
        if (listType === 'checklist') {
          const checked = item.startsWith('[x]');
          const text = item.replace(/^\[[ x]\]\s*/, '');
          return (
            <li key={i} className="flex items-start gap-2">
              <input type="checkbox" checked={checked} readOnly className="mt-1" />
              <span>{processInlineMarkdown(text)}</span>
            </li>
          );
        }
        return <li key={i}>{processInlineMarkdown(item)}</li>;
      });

      if (listType === 'ol') {
        elements.push(<ol key={elements.length} className="list-decimal pl-6 mb-4">{items}</ol>);
      } else {
        elements.push(<ul key={elements.length} className="list-disc pl-6 mb-4">{items}</ul>);
      }
      listItems = [];
      listType = null;
    }
  };

  const flushTable = () => {
    if (currentTable.length > 0) {
      const rows = currentTable.map(row => 
        row.split('|').filter(cell => cell.trim()).map(cell => cell.trim())
      );
      
      if (rows.length >= 2) {
        const headers = rows[0];
        const dataRows = rows.slice(2);
        
        elements.push(
          <div key={elements.length} className="overflow-x-auto mb-6">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  {headers.map((header, i) => (
                    <th key={i} className="border border-border bg-muted px-4 py-2 text-left font-semibold">
                      {processInlineMarkdown(header)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dataRows.map((row, i) => (
                  <tr key={i}>
                    {row.map((cell, j) => (
                      <td key={j} className="border border-border px-4 py-2">
                        {processInlineMarkdown(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }
      currentTable = [];
      inTable = false;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      flushList();
      continue;
    }

    if (trimmed.startsWith('|')) {
      flushList();
      currentTable.push(trimmed);
      inTable = true;
      continue;
    } else if (inTable) {
      flushTable();
    }

    if (trimmed.startsWith('# ')) {
      flushList();
      elements.push(<h1 key={elements.length} className="text-3xl font-bold mt-8 mb-4">{trimmed.slice(2)}</h1>);
      continue;
    }
    if (trimmed.startsWith('## ')) {
      flushList();
      const text = trimmed.slice(3);
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      elements.push(<h2 key={elements.length} id={id} className="text-2xl font-bold mt-12 mb-4">{text}</h2>);
      continue;
    }
    if (trimmed.startsWith('### ')) {
      flushList();
      elements.push(<h3 key={elements.length} className="text-xl font-semibold mt-8 mb-3">{trimmed.slice(4)}</h3>);
      continue;
    }

    if (trimmed === '---') {
      flushList();
      elements.push(<hr key={elements.length} className="my-8 border-border" />);
      continue;
    }

    if (trimmed.match(/^- \[[ x]\]/)) {
      if (listType !== 'checklist') {
        flushList();
        listType = 'checklist';
      }
      listItems.push(trimmed.slice(2));
      continue;
    }

    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      if (listType !== 'ul') {
        flushList();
        listType = 'ul';
      }
      listItems.push(trimmed.slice(2));
      continue;
    }

    if (trimmed.match(/^\d+\.\s/)) {
      if (listType !== 'ol') {
        flushList();
        listType = 'ol';
      }
      listItems.push(trimmed.replace(/^\d+\.\s/, ''));
      continue;
    }

    flushList();
    elements.push(<p key={elements.length} className="mb-4 text-muted-foreground leading-relaxed">{processInlineMarkdown(trimmed)}</p>);
  }

  flushList();
  flushTable();

  return <>{elements}</>;
}
