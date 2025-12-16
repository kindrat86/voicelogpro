import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { FileText, Building2, Shield, Users, CheckCircle2, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { goldenThreadDocumentationHowTo } from "@/seo/legalSchema";
import { softwareApplicationSchema, organizationSchema } from "@/seo/softwareSchema";
const GoldenThread = () => {
  return <>
      <Helmet>
        <title>Building Safety Act Golden Thread | UK Subcontractor Compliance | Voice Log Pro</title>
        <meta name="description" content="Meet UK Building Safety Act Golden Thread requirements with Voice Log Pro. Create digital daily records for Higher-Risk Buildings and demonstrate BS 8670 competence standards." />
        <link rel="canonical" href="https://www.voicelogpro.com/solutions/building-safety-act-golden-thread" />
      </Helmet>
      <JsonLd schema={[softwareApplicationSchema, organizationSchema, goldenThreadDocumentationHowTo]} />
      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="py-16 px-4 border-b border-border">
          <div className="max-w-4xl mx-auto">
            <p className="text-primary font-medium mb-4">UK Building Safety Act 2022</p>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
              Building Safety Act Golden Thread
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
              Create the digital record-keeping infrastructure UK subcontractors need to demonstrate competence and contribute to Golden Thread requirements on Higher-Risk Buildings.
            </p>
            <Link to="/crew-plan">
              <Button size="lg" className="font-semibold">
                Start Documenting — $49/month
              </Button>
            </Link>
          </div>
        </section>

        {/* Fact Tuples Section */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-display text-2xl font-bold text-foreground mb-8">
              Golden Thread Definitions
            </h2>
            
            <dl className="space-y-6">
              <div className="border-l-4 border-primary pl-6">
                <dt className="font-semibold text-foreground text-lg">Golden Thread</dt>
                <dd className="text-muted-foreground mt-2">
                  A digital record of building information required under the UK Building Safety Act 2022. The Golden Thread must contain accurate, up-to-date information about the design, construction, and maintenance of Higher-Risk Buildings throughout their lifecycle. It must be stored digitally and remain accessible and secure.
                </dd>
              </div>
              
              <div className="border-l-4 border-primary pl-6">
                <dt className="font-semibold text-foreground text-lg">Higher-Risk Buildings (HRBs)</dt>
                <dd className="text-muted-foreground mt-2">
                  Buildings at least 18 metres in height or with at least 7 storeys, containing at least 2 residential units. These buildings are subject to the enhanced regulatory regime under the Building Safety Act, including Gateway approvals and Golden Thread requirements.
                </dd>
              </div>
              
              <div className="border-l-4 border-primary pl-6">
                <dt className="font-semibold text-foreground text-lg">BS 8670 Competence Standards</dt>
                <dd className="text-muted-foreground mt-2">
                  British Standard 8670 establishes competence requirements for individuals working on Higher-Risk Buildings. Subcontractors must demonstrate they have the skills, knowledge, experience, and behaviours to carry out their work safely and in compliance with building regulations.
                </dd>
              </div>
              
              <div className="border-l-4 border-primary pl-6">
                <dt className="font-semibold text-foreground text-lg">Principal Contractor Duties</dt>
                <dd className="text-muted-foreground mt-2">
                  Under the Building Safety Act, Principal Contractors must ensure all workers are competent, maintain Golden Thread information during construction, and pass complete records to the Principal Designer and Building Safety Regulator.
                </dd>
              </div>
              
              <div className="border-l-4 border-primary pl-6">
                <dt className="font-semibold text-foreground text-lg">Voice Log Pro Capability</dt>
                <dd className="text-muted-foreground mt-2">
                  Creates timestamped digital daily records that can form part of the Golden Thread. Voice logs capture decisions, changes, and compliance documentation in a searchable, auditable format suitable for Higher-Risk Building projects.
                </dd>
              </div>
              
              <div className="border-l-4 border-primary pl-6">
                <dt className="font-semibold text-foreground text-lg">Target Jurisdiction</dt>
                <dd className="text-muted-foreground mt-2">
                  England, specifically mechanical and electrical subcontractors working on Higher-Risk Buildings subject to the Building Safety Act 2022 regime.
                </dd>
              </div>
            </dl>
          </div>
        </section>

        {/* What the Act Requires */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-display text-2xl font-bold text-foreground mb-8">
              What the Building Safety Act Requires
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <Database className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Digital Records</h3>
                  <p className="text-muted-foreground">
                    Golden Thread information must be held digitally in a secure, accessible format. Paper records are not sufficient for Higher-Risk Buildings.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <Building2 className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Lifecycle Documentation</h3>
                  <p className="text-muted-foreground">
                    Records must cover design, construction, and ongoing management. What you document during construction becomes part of the permanent building record.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Competence Evidence</h3>
                  <p className="text-muted-foreground">
                    Subcontractors must demonstrate BS 8670 competence. Daily logs showing methodical, compliant work practices support competence claims.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Change Documentation</h3>
                  <p className="text-muted-foreground">
                    All changes to the building design or construction must be recorded. Voice logs capture changes as they happen, not after the fact.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How Voice Logs Map to Golden Thread */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-display text-2xl font-bold text-foreground mb-8">
              How Voice Log Pro Supports Golden Thread Compliance
            </h2>
            
            <div className="space-y-6">
              <div className="border rounded-lg p-6 bg-background">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-foreground">Digital-First Daily Records</h3>
                </div>
                <p className="text-muted-foreground">
                  Every voice log creates a digital record with automatic timestamps, geolocation, and weather data. Records are stored securely and can be exported as PDFs for inclusion in Golden Thread documentation packages.
                </p>
              </div>
              
              <div className="border rounded-lg p-6 bg-background">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-foreground">Change Capture</h3>
                </div>
                <p className="text-muted-foreground">
                  Document design changes, RFIs, and site instructions as they happen. Voice notes capture the context and reasoning behind changes, not just what changed.
                </p>
              </div>
              
              <div className="border rounded-lg p-6 bg-background">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-foreground">Competence Demonstration</h3>
                </div>
                <p className="text-muted-foreground">
                  Daily logs documenting safe work practices, compliance checks, and quality inspections create an audit trail supporting BS 8670 competence requirements.
                </p>
              </div>
              
              <div className="border rounded-lg p-6 bg-background">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-foreground">Handover Ready</h3>
                </div>
                <p className="text-muted-foreground">
                  Export complete project documentation for handover to the Principal Contractor. PDF reports include all daily logs, photos, and metadata required for Golden Thread packages.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Key References */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-display text-2xl font-bold text-foreground mb-8">
              Key Regulatory References
            </h2>
            
            <div className="space-y-4">
              <div className="border rounded-lg p-4 bg-muted/20">
                <p className="font-semibold text-foreground">Building Safety Act 2022</p>
                <p className="text-sm text-muted-foreground">Primary legislation establishing the Golden Thread requirement and Higher-Risk Building regime</p>
              </div>
              
              <div className="border rounded-lg p-4 bg-muted/20">
                <p className="font-semibold text-foreground">The Building (Higher-Risk Buildings Procedures) (England) Regulations 2023</p>
                <p className="text-sm text-muted-foreground">Secondary legislation detailing Golden Thread information requirements</p>
              </div>
              
              <div className="border rounded-lg p-4 bg-muted/20">
                <p className="font-semibold text-foreground">BS 8670:2022</p>
                <p className="text-sm text-muted-foreground">British Standard for competence of individuals in relation to building work on Higher-Risk Buildings</p>
              </div>
              
              <div className="border rounded-lg p-4 bg-muted/20">
                <p className="font-semibold text-foreground">Building Safety Regulator Guidance</p>
                <p className="text-sm text-muted-foreground">
                  <a target="_blank" rel="noopener noreferrer" className="text-primary hover:underline" href="">
                    Official guidance from HSE's Building Safety Regulator
                  </a>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-display text-3xl font-bold text-foreground mb-4">
              Start Building Your Golden Thread Records
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Voice Log Pro helps UK subcontractors create the digital daily records needed to support Golden Thread compliance on Higher-Risk Buildings.
            </p>
            <Link to="/crew-plan">
              <Button size="lg" className="font-semibold">
                Join the Waitlist — $49/month
              </Button>
            </Link>
          </div>
        </section>

        {/* Disclaimer */}
        <section className="py-8 px-4 border-t border-border">
          <div className="max-w-4xl mx-auto">
            <p className="text-sm text-muted-foreground">
              <strong>Disclaimer:</strong> Voice Log Pro provides documentation tools to support your record-keeping. This information is for educational purposes only and does not constitute legal or regulatory advice. The Building Safety Act requirements are complex and vary by building type. Consult with qualified professionals for specific guidance on Golden Thread compliance and Building Safety Act requirements.
            </p>
          </div>
        </section>

        <Footer />
      </main>
    </>;
};
export default GoldenThread;