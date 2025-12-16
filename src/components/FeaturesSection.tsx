import { useState } from "react";
import { Link } from "react-router-dom";
import { CTAButton } from "@/components/CTAButton";
import { ComplianceBadge } from "@/components/ComplianceBadge";
import { DocumentPreview } from "@/components/DocumentPreview";
import { Mic, Cloud, AlertTriangle, FileCheck, Share2, WifiOff, ChevronRight } from "lucide-react";
const features = [{
  icon: Mic,
  title: "Hands-free voice capture",
  description: "contemporaneous records preserved as evidence"
}, {
  icon: Cloud,
  title: "Automatic weather tagging",
  description: "excusable delay proof for schedule compression claims"
}, {
  icon: AlertTriangle,
  title: "RFI detection",
  description: "dispute prevention and delay claim documentation"
}, {
  icon: FileCheck,
  title: "Legally defensible PDFs",
  description: "aligned with AIA A401 documentation expectations"
}, {
  icon: Share2,
  title: "One-click GC sharing",
  description: "supports payment applications and lien rights"
}, {
  icon: WifiOff,
  title: "Offline capture",
  description: "evidence-grade daily logs from anywhere"
}];
const complianceByRegion = {
  texas: {
    label: "Texas",
    badgeTitle: "Chapter 53 Lien Rights Protection",
    badgeSubtitle: "Documentation aligned to Texas Property Code Chapter 53.",
    href: "/solutions/texas-mechanics-lien-compliance"
  },
  uk: {
    label: "UK",
    badgeTitle: "Golden Thread Compliant",
    badgeSubtitle: "Digital records aligned to Building Safety Act Golden Thread expectations.",
    href: "/solutions/building-safety-act-golden-thread"
  }
} as const;
type RegionKey = keyof typeof complianceByRegion;
export function FeaturesSection() {
  const [selectedRegion, setSelectedRegion] = useState<RegionKey>("texas");
  const currentCompliance = complianceByRegion[selectedRegion];
  return <section className="section-container bg-secondary/50">
      <h2 className="headline-section text-foreground mb-3 text-center">
        Built for Subcontractors
      </h2>
      <p className="body-large text-center mb-10">
        Every feature designed for the field.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {features.map(feature => <div key={feature.title} className="card-sunlight text-center group transition-all duration-200">
            <div className="w-12 h-12 bg-primary/20 border-2 border-primary flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/30 transition-colors" style={{ borderRadius: 'var(--radius)' }}>
              <feature.icon className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-bold text-foreground mb-1">{feature.title}</h3>
            <p className="text-muted-foreground text-sm font-medium">— {feature.description}</p>
          </div>)}
      </div>

      {/* Compliance Authority Section */}
      <div className="card-industrial p-5 md:p-6 mb-10">
        <h3 className="headline-section text-foreground mb-5 text-center text-xl md:text-2xl">
          Jurisdiction-Specific Compliance
        </h3>

        {/* Jurisdiction Selector */}
        <div className="flex flex-col items-center mb-6">
          <select id="region-select" value={selectedRegion} onChange={e => setSelectedRegion(e.target.value as RegionKey)} className="w-full max-w-xs h-14 md:h-12 px-4 text-base font-bold bg-background border-2 border-primary text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors cursor-pointer uppercase tracking-wide" style={{ borderRadius: 'var(--radius)' }}>
            {Object.entries(complianceByRegion).map(([key, value]) => <option key={key} value={key}>
                {value.label}
              </option>)}
          </select>
        </div>

        {/* Badge and Preview Grid */}
        <div className="grid md:grid-cols-2 gap-6 items-center">
          {/* Badge Column */}
          <div className="flex flex-col items-center">
            <ComplianceBadge title={currentCompliance.badgeTitle} subtitle={currentCompliance.badgeSubtitle} />

            {/* Machine-readable data for SEO */}
            <dl className="mt-4 text-xs text-muted-foreground space-y-1 text-center font-medium">
              <div className="flex items-center justify-center gap-2">
                <dt className="font-bold uppercase">Jurisdiction:</dt>
                <dd>{currentCompliance.label}</dd>
              </div>
              <div className="flex items-center justify-center gap-2">
                <dt className="font-bold uppercase">Requirement:</dt>
                <dd>{currentCompliance.badgeTitle}</dd>
              </div>
            </dl>

            {/* Learn More Link */}
            <Link to={currentCompliance.href} className="inline-flex items-center gap-1 mt-4 text-primary font-bold hover:underline uppercase text-sm tracking-wide">
              Learn about {currentCompliance.label} compliance
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Document Preview Column */}
          <div>
            <DocumentPreview />
          </div>
        </div>
      </div>

      <div className="text-center">
        <CTAButton />
      </div>
    </section>;
}