import { Link } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { basicFaqs, authorityFaqs, type FAQItem } from "@/content/faqs";

const FAQItemComponent = ({ faq }: { faq: FAQItem }) => (
  <AccordionItem value={faq.id} className="border-border/50">
    <AccordionTrigger className="text-left text-base md:text-lg font-medium text-foreground hover:no-underline py-5">
      {faq.question}
    </AccordionTrigger>
    <AccordionContent className="text-muted-foreground text-base pb-5">
      {faq.answerText}
      {faq.answerLink && (
        <>
          {" "}
          <Link
            to={faq.answerLink}
            className="text-primary hover:underline font-medium"
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
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground text-lg">
            Quick answers about Voice Log Pro and construction compliance documentation.
          </p>
        </div>

        {/* Basics Section */}
        <div className="mb-10">
          <h3 className="text-xl font-semibold text-foreground mb-4 px-1">
            Basics
          </h3>
          <Accordion type="single" collapsible className="bg-background rounded-lg border border-border/50">
            {basicFaqs.map((faq) => (
              <FAQItemComponent key={faq.id} faq={faq} />
            ))}
          </Accordion>
        </div>

        {/* Compliance & Legal Section */}
        <div>
          <h3 className="text-xl font-semibold text-foreground mb-4 px-1">
            Compliance & Legal
          </h3>
          <Accordion type="single" collapsible className="bg-background rounded-lg border border-border/50">
            {authorityFaqs.map((faq) => (
              <FAQItemComponent key={faq.id} faq={faq} />
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};
