import { Link } from "react-router-dom";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export function Footer() {
  return <footer className="border-t border-border py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <p className="font-display text-2xl text-primary mb-2">VoiceLogPro</p>
            <p className="text-muted-foreground text-sm">
              Voice-to-PDF daily reports for subcontractors.
            </p>
          </div>
          
          {/* Solutions */}
          <div>
            <p className="font-semibold text-foreground mb-3 text-sm">Jurisdiction-Specific Compliance
          </p>
            <nav className="flex flex-col gap-2">
              <Link to="/court-ready-daily-logs" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                Court-Ready Daily Logs
              </Link>
              <Link to="/solutions/texas-mechanics-lien-compliance" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                Texas Chapter 53 Compliance
              </Link>
              <Link to="/solutions/constructive-acceleration-defense" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                Constructive Acceleration Defense
              </Link>
              <Link to="/solutions/building-safety-act-golden-thread" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                UK Golden Thread
              </Link>
            </nav>
          </div>
          
          {/* Resources */}
          <div>
            <p className="font-semibold text-foreground mb-3 text-sm">Resources</p>
            <nav className="flex flex-col gap-2">
              <Link to="/blog" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                Blog
              </Link>
              <Link to="/blog/texas-property-code-chapter-53-guide-2025" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                Texas Property Code Chapter 53 Guide
              </Link>
              <Link to="/how-to" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                How-To Guides
              </Link>
              <Link to="/compare" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                Compare Alternatives
              </Link>
              <Link to="/for" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                For Your Trade
              </Link>
              <Link to="/raken-vs-voice-log-pro" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                Raken vs VoiceLogPro
              </Link>
              <Link to="/fieldwire-vs-voice-log-pro" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                Fieldwire vs VoiceLogPro
              </Link>
            </nav>
          </div>

          {/* Company */}
          <div>
            <p className="font-semibold text-foreground mb-3 text-sm">Company</p>
            <nav className="flex flex-col gap-2">
              <Link to="/about" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                About
              </Link>
              <Link to="/contact" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                Contact
              </Link>
              <a href="https://x.com/sipiteno" target="_blank" rel="me" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                X / Twitter
              </a>
            </nav>
          </div>
        </div>

        {/* Language Switcher + Copyright */}
        <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
          </div>
          <p className="text-muted-foreground text-sm">
            Built for the crew. &copy; {new Date().getFullYear()} All rights reserved.
          </p>
        </div>
      </div>
    </footer>;
}
