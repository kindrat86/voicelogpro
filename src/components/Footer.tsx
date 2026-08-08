import { Link } from "react-router-dom";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useTranslation } from "react-i18next";

export function Footer() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();
  
    return <footer className="border-t border-border py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-5 gap-8 mb-8">
          {/* Brand */}
          <div>
            <p className="font-display text-2xl text-primary mb-2">VoiceLogPro</p>
            <p className="text-muted-foreground text-sm">
              {t("footer.brandTagline", "Voice-to-PDF daily reports for subcontractors.")}
            </p>
          </div>
          
          {/* Compliance */}
          <div>
            <p className="font-semibold text-foreground mb-3 text-sm">{t("footer.complianceHeader", "Jurisdiction-Specific Compliance")}
          </p>
            <nav className="flex flex-col gap-2">
              <Link to="/court-ready-daily-logs" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                Court-Ready Daily Logs
              </Link>
              <Link to="/solutions/texas-mechanics-lien-compliance" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                {t("footer.texasChapter53", "Texas Chapter 53 Compliance")}
              </Link>
              <Link to="/solutions/constructive-acceleration-defense" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                {t("footer.constructiveAccel", "Constructive Acceleration Defense")}
              </Link>
              <Link to="/solutions/building-safety-act-golden-thread" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                {t("footer.ukGoldenThread", "UK Golden Thread")}
              </Link>
            </nav>
          </div>
          
          {/* Resources */}
          <div>
            <p className="font-semibold text-foreground mb-3 text-sm">{t("footer.resourcesHeader", "Resources")}</p>
            <nav className="flex flex-col gap-2">
              <Link to="/blog" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                {t("nav.blog", "Blog")}
              </Link>
              <Link to="/blog/texas-property-code-chapter-53-guide-2025" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                Texas Property Code Chapter 53 Guide
              </Link>
              <Link to="/how-to" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                {t("nav.howTo", "How-To Guides")}
              </Link>
              <Link to="/compare" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                {t("nav.compare", "Compare Alternatives")}
              </Link>
              <Link to="/for" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                {t("nav.for", "For Your Trade")}
              </Link>
              <Link to="/raken-vs-voice-log-pro" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                {t("footer.rakenVs", "Raken vs VoiceLogPro")}
              </Link>
              <Link to="/fieldwire-vs-voice-log-pro" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                {t("footer.fieldwireVs", "Fieldwire vs VoiceLogPro")}
              </Link>
            </nav>
          </div>

          {/* Grow With Us — Traffic Secrets: Dream 100 (S5) + Affiliate Army (S18) + Press (S13/S20) */}
          <div>
            <p className="font-semibold text-foreground mb-3 text-sm">Grow With Us</p>
            <nav className="flex flex-col gap-2">
              <Link to="/dream-100" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                Dream 100 — Communities
              </Link>
              <Link to="/affiliates" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                Affiliates — 30% recurring
              </Link>
              <Link to="/press" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                Press &amp; Podcast Kit
              </Link>
            </nav>
          </div>

          {/* Network */}
          <div>
            <p className="font-semibold text-foreground mb-3 text-sm">Network</p>
            <nav className="flex flex-col gap-2">
              <a href="https://gitdealflow.com" target="_blank" rel="noopener" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                GitDealFlow
              </a>
              <a href="https://signals.gitdealflow.com" target="_blank" rel="noopener" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                VC Deal Flow Signal
              </a>
              <a href="https://sipi.bot" target="_blank" rel="noopener" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                Sipi.bot
              </a>
              <a href="https://invisibleexit.com" target="_blank" rel="noopener" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                InvisibleExit
              </a>
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
            {t("footer.copyright", "Built for the crew.")} &copy; {currentYear} {t("footer.allRightsReserved", "All rights reserved.")}
          </p>
        </div>
      </div>
    </footer>;
}
