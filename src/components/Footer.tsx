export function Footer() {
  return (
    <footer className="border-t border-border py-8 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <p className="font-display text-2xl text-primary mb-2">SiteLog AI</p>
        <p className="text-muted-foreground text-sm">
          Built for the crew. © {new Date().getFullYear()} All rights reserved.
        </p>
      </div>
    </footer>
  );
}
