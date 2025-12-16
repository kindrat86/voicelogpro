import { Shield } from "lucide-react";

interface ComplianceBadgeProps {
  title: string;
  subtitle: string;
}

export function ComplianceBadge({ title, subtitle }: ComplianceBadgeProps) {
  return (
    <div className="relative inline-block">
      {/* Badge Container */}
      <div className="relative bg-background border-4 border-primary rounded-lg p-4 md:p-6 shadow-[0_4px_0_0_hsl(var(--primary)/0.5)] overflow-hidden">
        {/* Corner Flourishes */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary/50" />
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-primary/50" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-primary/50" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-primary/50" />

        {/* Watermark Pattern */}
        <div 
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage: `repeating-linear-gradient(
              45deg,
              transparent,
              transparent 10px,
              hsl(var(--primary)) 10px,
              hsl(var(--primary)) 11px
            )`
          }}
        />

        {/* Content */}
        <div className="relative text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Shield className="w-5 h-5 text-primary" />
            <span className="text-xs uppercase tracking-wider text-primary font-semibold">
              Protection Badge
            </span>
            <Shield className="w-5 h-5 text-primary" />
          </div>

          <h3 className="font-display text-lg md:text-xl font-bold text-foreground mb-2">
            {title}
          </h3>

          <p className="text-sm text-muted-foreground max-w-xs mx-auto">
            {subtitle}
          </p>

          <div className="mt-3 text-xs text-primary/80 font-medium">
            Built for subcontractor documentation
          </div>
        </div>
      </div>
    </div>
  );
}
