import { FileCheck, Lock, RotateCcw, Shield } from "lucide-react";

const guarantees = [
  {
    icon: RotateCcw,
    title: "Useful-Report Refund",
    description: "If the reports are not useful, email us within 7 calendar days after the final pilot report for a refund of the $49 pilot payment.",
  },
  {
    icon: Lock,
    title: "No Automatic Renewal",
    description: "The $49 charge is one-time. Buying the pilot does not enroll you in another plan.",
  },
  {
    icon: FileCheck,
    title: "Your Supplied Facts",
    description: "We structure the information you provide. Missing facts are omitted or marked Not provided, never invented.",
  },
  {
    icon: Shield,
    title: "Clear Limits",
    description: "Reports support project records but do not guarantee compliance, admissibility, payment, lien rights, or a legal outcome.",
  },
];

export function GuaranteeSection() {
  return (
    <section className="section-container">
      <div className="max-w-4xl mx-auto">
        <h2 className="headline-section text-foreground mb-3 text-center">A small, clear first step</h2>
        <p className="body-large text-center mb-10">One paid pilot, a defined deliverable, and no hidden subscription.</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {guarantees.map((item) => (
            <div key={item.title} className="card-sunlight text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center border-2 border-primary bg-primary/20" style={{ borderRadius: "var(--radius)" }}>
                <item.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-1 text-sm font-bold text-foreground">{item.title}</h3>
              <p className="text-xs text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
