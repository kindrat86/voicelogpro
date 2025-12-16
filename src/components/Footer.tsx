import { Link } from "react-router-dom";
export function Footer() {
  return <footer className="border-t border-border py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <p className="font-display text-2xl text-primary mb-2">Voice Log Pro</p>
            <p className="text-muted-foreground text-sm">
              Voice-to-PDF daily reports for subcontractors.
            </p>
          </div>
          
          {/* Solutions */}
          <div>
            <p className="font-semibold text-foreground mb-3 text-sm">Solutions</p>
            <nav className="flex flex-col gap-2">
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
              <Link to="/raken-vs-voice-log-pro" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                Raken vs Voice Log Pro
              </Link>
            </nav>
          </div>
        </div>
        
        <div className="border-t border-border pt-8 text-center">
          <p className="text-muted-foreground text-sm">
            Built for the crew. © {new Date().getFullYear()} All rights reserved.
          </p>
        </div>
      </div>
    </footer>;
}