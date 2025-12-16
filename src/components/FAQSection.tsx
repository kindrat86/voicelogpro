import { Link } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { basicFaqs, authorityFaqs, type FAQItem } from "@/content/faqs";

const FAQItemComponent = ({ faq }: { faq: FAQItem }) => (
  <AccordionItem value={faq.id} className="border-b-2 border-border/50 last:border-b-0">
    <AccordionTrigger className="text-left text-base md:text-lg font-bold text-foreground hover:no-underline py-4 px-4">
      {faq.question}
    </AccordionTrigger>
    <AccordionContent className="text-muted-foreground text-base pb-4 px-4 font-medium">
      {faq.answerText}
      {faq.answerLink && (
        <>
          {" "}
          <Link
            to={faq.answerLink}
            className="text-primary hover:underline font-bold"
          >
            {faq.linkText || "Learn more"}
          </Link>
        </>
      )}
    </AccordionContent>
  </AccordionItem>
);

export const FAQSection = () => {
  return (
    <section className="py-12 md:py-20 bg-muted/50">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-display uppercase text-foreground mb-3 font-bold">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground text-lg font-medium">
            Quick answers about Voice Log Pro and construction compliance documentation.
          </p>
        </div>

        {/* Basics Section */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-foreground mb-3 px-1 uppercase tracking-wide">
            Basics
          </h3>
          <Accordion type="single" collapsible className="bg-background border-2 border-border" style={{ borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-hard)' }}>
            {basicFaqs.map((faq) => (
              <FAQItemComponent key={faq.id} faq={faq} />
            ))}
          </Accordion>
        </div>

        {/* Compliance & Legal Section */}
        <div>
          <h3 className="text-lg font-bold text-foreground mb-3 px-1 uppercase tracking-wide">
            Compliance & Legal
          </h3>
          <Accordion type="single" collapsible className="bg-background border-2 border-border" style={{ borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-hard)' }}>
            {authorityFaqs.map((faq) => (
              <FAQItemComponent key={faq.id} faq={faq} />
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};
