import { Shield } from "lucide-react";

interface ComplianceBadgeProps {
  title: string;
  subtitle: string;
}

export function ComplianceBadge({ title, subtitle }: ComplianceBadgeProps) {
  return (
    <div className="relative inline-block">
      {/* Badge Container - Stamped industrial look */}
      <div 
        className="relative bg-background border-4 border-primary p-4 md:p-5 overflow-hidden"
        style={{ 
          borderRadius: 'var(--radius)',
          boxShadow: '4px 4px 0 0 hsl(25 95% 40%)' 
        }}
      >
        {/* Corner Flourishes */}
        <div className="absolute top-1 left-1 w-3 h-3 border-t-2 border-l-2 border-primary" />
        <div className="absolute top-1 right-1 w-3 h-3 border-t-2 border-r-2 border-primary" />
        <div className="absolute bottom-1 left-1 w-3 h-3 border-b-2 border-l-2 border-primary" />
        <div className="absolute bottom-1 right-1 w-3 h-3 border-b-2 border-r-2 border-primary" />

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
            <span className="text-xs uppercase tracking-wider text-primary font-bold">
              Protection Badge
            </span>
            <Shield className="w-5 h-5 text-primary" />
          </div>

          <h3 className="font-display text-lg md:text-xl font-bold text-foreground mb-2 uppercase">
            {title}
          </h3>

          <p className="text-sm text-muted-foreground max-w-xs mx-auto font-medium">
            {subtitle}
          </p>

          <div className="mt-3 text-xs text-primary font-bold uppercase tracking-wide">
            Built for subcontractor documentation
          </div>
        </div>
      </div>
    </div>
  );
}
