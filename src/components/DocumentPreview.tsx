import { FileText, Clock, CheckCircle } from "lucide-react";

export function DocumentPreview() {
  return (
    <div className="relative max-w-sm mx-auto">
      {/* Document Card */}
      <div className="relative bg-white dark:bg-slate-100 rounded-lg shadow-xl border-2 border-border overflow-hidden aspect-[8.5/11]">
        {/* Watermark Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `repeating-linear-gradient(
              -45deg,
              transparent,
              transparent 20px,
              #000 20px,
              #000 21px
            )`
          }}
        />

        {/* Document Header */}
        <div className="bg-slate-800 p-3 md:p-4">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-white" />
            <span className="text-white font-semibold text-sm">Daily Field Log</span>
          </div>
          <div className="text-slate-300 text-xs mt-1">VoiceLogPro — Automated Report</div>
        </div>

        {/* Document Content Skeleton */}
        <div className="p-4 space-y-4">
          {/* Date/Project Row */}
          <div className="flex justify-between items-center border-b border-slate-200 pb-2">
            <div className="space-y-1">
              <div className="h-2 w-16 bg-slate-300 rounded" />
              <div className="h-3 w-24 bg-slate-400 rounded" />
            </div>
            <div className="space-y-1 text-right">
              <div className="h-2 w-12 bg-slate-300 rounded ml-auto" />
              <div className="h-3 w-20 bg-slate-400 rounded" />
            </div>
          </div>

          {/* Weather/Crew Section */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 p-2 rounded">
              <div className="h-2 w-10 bg-slate-300 rounded mb-1" />
              <div className="h-3 w-16 bg-slate-400 rounded" />
            </div>
            <div className="bg-slate-50 p-2 rounded">
              <div className="h-2 w-10 bg-slate-300 rounded mb-1" />
              <div className="h-3 w-12 bg-slate-400 rounded" />
            </div>
          </div>

          {/* Work Performed Section */}
          <div>
            <div className="h-2 w-20 bg-slate-300 rounded mb-2" />
            <div className="space-y-1">
              <div className="h-2 w-full bg-slate-200 rounded" />
              <div className="h-2 w-5/6 bg-slate-200 rounded" />
              <div className="h-2 w-4/5 bg-slate-200 rounded" />
            </div>
          </div>

          {/* Table Section */}
          <div className="border border-slate-200 rounded">
            <div className="grid grid-cols-3 gap-px bg-slate-200">
              <div className="bg-slate-100 p-2">
                <div className="h-2 w-8 bg-slate-400 rounded" />
              </div>
              <div className="bg-slate-100 p-2">
                <div className="h-2 w-10 bg-slate-400 rounded" />
              </div>
              <div className="bg-slate-100 p-2">
                <div className="h-2 w-6 bg-slate-400 rounded" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-px bg-slate-200">
              <div className="bg-white p-2">
                <div className="h-2 w-12 bg-slate-300 rounded" />
              </div>
              <div className="bg-white p-2">
                <div className="h-2 w-8 bg-slate-300 rounded" />
              </div>
              <div className="bg-white p-2">
                <div className="h-2 w-10 bg-slate-300 rounded" />
              </div>
            </div>
          </div>
        </div>

        {/* Time Verified Stamp Overlay */}
        <div className="absolute bottom-4 right-4 transform rotate-[-12deg]">
          <div className="relative bg-primary/10 border-4 border-primary rounded-lg p-3 shadow-lg">
            {/* Inner border */}
            <div className="absolute inset-1 border-2 border-primary/50 rounded pointer-events-none" />
            
            <div className="relative text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Clock className="w-4 h-4 text-primary" />
                <CheckCircle className="w-4 h-4 text-primary" />
              </div>
              <div className="font-display text-primary font-bold text-sm uppercase tracking-wide">
                Time Verified
              </div>
              <div className="text-primary/70 text-[10px] mt-0.5">
                Timestamped Record
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Caption */}
      <p className="text-center text-sm text-muted-foreground mt-3">
        Court-ready format • Timestamped evidence
      </p>
    </div>
  );
}
