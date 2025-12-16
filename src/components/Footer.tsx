import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t border-border py-8 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <p className="font-display text-2xl text-primary mb-2">Voice Log Pro</p>
        <nav className="flex justify-center gap-6 mb-4">
          <Link to="/blog" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
            Blog
          </Link>
          <Link to="/crew-plan" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
            Crew Plan
          </Link>
        </nav>
        <p className="text-muted-foreground text-sm">
          Built for the crew. © {new Date().getFullYear()} All rights reserved.
        </p>
      </div>
    </footer>
  );
}