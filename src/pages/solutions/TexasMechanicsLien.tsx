import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Footer } from "@/components/Footer";
import { FileText, Calendar, Shield, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const TexasMechanicsLien = () => {
  return (
    <>
      <Helmet>
        <title>Texas Mechanics Lien Compliance | Property Code Chapter 53 | Voice Log Pro</title>
        <meta name="description" content="Automate Texas Property Code Chapter 53 compliance with Voice Log Pro. Generate monthly trapping notices and preserve lien rights with timestamped daily logs for Dallas-Fort Worth and Austin subcontractors." />
        <link rel="canonical" href="https://www.voicelogpro.com/solutions/texas-mechanics-lien-compliance" />
      </Helmet>
      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="py-16 px-4 border-b border-border">
          <div className="max-w-4xl mx-auto">
            <p className="text-primary font-medium mb-4">Texas Property Code Chapter 53</p>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
              Texas Mechanics Lien Compliance
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
              Preserve your lien rights with automated daily documentation that supports the Monthly Trapping Mechanism required under Texas law.
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
              Texas Chapter 53 Requirements
            </h2>
            
            <dl className="space-y-6">
              <div className="border-l-4 border-primary pl-6">
                <dt className="font-semibold text-foreground text-lg">Monthly Trapping Mechanism</dt>
                <dd className="text-muted-foreground mt-2">
                  A legal requirement under Texas Property Code Chapter 53 that requires subcontractors to serve notices by the 15th day of the second or third month following the month work was performed. This "traps" the work to a specific billing period to preserve lien rights.
                </dd>
              </div>
              
              <div className="border-l-4 border-primary pl-6">
                <dt className="font-semibold text-foreground text-lg">Texas Property Code Chapter 53 Requirement</dt>
                <dd className="text-muted-foreground mt-2">
                  Mandates monthly notices by the 15th of the second month to preserve lien rights. Subcontractors must document work performed each month with contemporaneous records.
                </dd>
              </div>
              
              <div className="border-l-4 border-primary pl-6">
                <dt className="font-semibold text-foreground text-lg">Voice Log Pro Capability</dt>
                <dd className="text-muted-foreground mt-2">
                  Generates court-ready PDF reports supporting the Monthly Trapping Mechanism. Each daily log is automatically tagged with the specific billing period required for Chapter 53 compliance.
                </dd>
              </div>
              
              <div className="border-l-4 border-primary pl-6">
                <dt className="font-semibold text-foreground text-lg">Target Jurisdiction</dt>
                <dd className="text-muted-foreground mt-2">
                  Texas, specifically Dallas-Fort Worth and Austin data center projects where rapid construction timelines create elevated lien protection needs.
                </dd>
              </div>
            </dl>
          </div>
        </section>

        {/* How Voice Log Pro Helps */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-display text-2xl font-bold text-foreground mb-8">
              How Voice Log Pro Supports Chapter 53 Compliance
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <Calendar className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Automatic Date Tagging</h3>
                  <p className="text-muted-foreground">
                    Every voice log is automatically timestamped with the date work was performed, creating contemporaneous records that tie work to specific billing periods.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <FileText className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Court-Ready PDF Export</h3>
                  <p className="text-muted-foreground">
                    Generate legally defensible PDF reports that document work performed, supporting lien claims and payment applications under Texas Property Code.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Lien Rights Documentation</h3>
                  <p className="text-muted-foreground">
                    Create the contemporaneous evidence required to enforce mechanics lien claims. Daily logs establish work was performed within the statutory timeframe.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <CheckCircle2 className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Monthly Period Tracking</h3>
                  <p className="text-muted-foreground">
                    Organize daily reports by billing period to simplify the Monthly Trapping Mechanism notice requirements and protect payment rights.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Key Requirements Table */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-display text-2xl font-bold text-foreground mb-8">
              Texas Chapter 53 Notice Deadlines
            </h2>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-4 px-4 font-semibold text-foreground">Work Performed</th>
                    <th className="text-left py-4 px-4 font-semibold text-foreground">Notice Deadline</th>
                    <th className="text-left py-4 px-4 font-semibold text-foreground">Required Documentation</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border">
                    <td className="py-4 px-4 text-muted-foreground">Month 1 (e.g., January)</td>
                    <td className="py-4 px-4 text-muted-foreground">15th of Month 2 or 3 (February or March)</td>
                    <td className="py-4 px-4 text-muted-foreground">Daily logs with timestamps, work descriptions</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-4 px-4 text-muted-foreground">Month 2 (e.g., February)</td>
                    <td className="py-4 px-4 text-muted-foreground">15th of Month 3 or 4 (March or April)</td>
                    <td className="py-4 px-4 text-muted-foreground">Daily logs with timestamps, work descriptions</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4 text-muted-foreground">Ongoing work</td>
                    <td className="py-4 px-4 text-muted-foreground">Rolling monthly deadlines</td>
                    <td className="py-4 px-4 text-muted-foreground">Continuous daily documentation</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-display text-3xl font-bold text-foreground mb-4">
              Protect Your Texas Lien Rights
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Start documenting with Voice Log Pro and create the contemporaneous records you need to preserve lien rights under Texas Property Code Chapter 53.
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
              <strong>Disclaimer:</strong> Voice Log Pro provides documentation tools to support your record-keeping. This information is for educational purposes only and does not constitute legal advice. Consult a licensed Texas attorney for specific guidance on mechanics lien compliance and Texas Property Code Chapter 53 requirements.
            </p>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
};

export default TexasMechanicsLien;
