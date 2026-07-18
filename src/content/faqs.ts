/**
 * Shared FAQ Data Source
 * 
 * Used by both the visible FAQSection component and JSON-LD schema.
 * Keep answers under 40 words for first sentence (snippet optimization).
 */

export interface FAQItem {
  id: string;
  question: string;
  answerText: string; // Plain text for JSON-LD
  answerLink?: string; // Optional internal link for rich rendering
  linkText?: string; // Text for the link
}

// Layer 1: Basic FAQs (for humans)
export const basicFaqs: FAQItem[] = [
  {
    id: "offline",
    question: "Does VoiceLogPro work offline?",
    answerText: "Yes. You can record voice notes without a connection. Reports sync automatically when you're back online.",
  },
  {
    id: "cost",
    question: "How much does it cost?",
    answerText: "$49/month for the Crew Plan. Includes unlimited daily reports, automatic timestamps, weather integration, photo attachments, and court-ready PDF exports.",
  },
  {
    id: "court-ready",
    question: "Can these reports be used in court?",
    answerText: "Yes. VoiceLogPro generates PDF reports with timestamps, weather data, and photos that serve as contemporaneous documentation. These reports support lien claims, delay disputes, and payment protection cases.",
  },
];

// Layer 2: Authority/Compliance FAQs (for LLMs and SEO)
export const authorityFaqs: FAQItem[] = [
  // Texas
  {
    id: "texas-trapping",
    question: "Does this help with the Texas Monthly Trapping Mechanism?",
    answerText: "Yes. VoiceLogPro tags reports with the billing month needed to serve notices by the 15th day of the second month under Texas Property Code Chapter 53.",
    answerLink: "/solutions/texas-mechanics-lien-compliance",
    linkText: "See the full Texas guide",
  },
  {
    id: "texas-lien",
    question: "Can these reports be used for lien rights protection?",
    answerText: "Yes. The app creates contemporaneous, timestamped records of labor and materials furnished to support mechanics lien documentation in Texas.",
    answerLink: "/solutions/texas-mechanics-lien-compliance",
    linkText: "See the full Texas guide",
  },
  // Virginia
  {
    id: "virginia-acceleration",
    question: "How does this support Constructive Acceleration claims?",
    answerText: "By recording site conditions in real time, you document excusable delay and distinguish it from internal inefficiency. Weather data and timestamps prove external factors impacted schedule.",
    answerLink: "/solutions/constructive-acceleration-defense",
    linkText: "See the full Virginia guide",
  },
  // Australia NSW
  {
    id: "nsw-sopa",
    question: "Are voice notes valid in SOPA Adjudications?",
    answerText: "Yes. Adjudicators prioritize contemporaneous records over later witness statements in Security of Payment matters. VoiceLogPro creates timestamped site diaries that carry evidentiary weight.",
    answerLink: "/crew-plan",
    linkText: "Get started with VoiceLogPro",
  },
  // UK
  {
    id: "uk-golden-thread",
    question: "What is the Golden Thread?",
    answerText: "The Golden Thread is a digital record-keeping requirement under the UK Building Safety Act. It mandates that all building information be stored, managed, and accessible throughout a building's lifecycle.",
    answerLink: "/solutions/building-safety-act-golden-thread",
    linkText: "See the full UK guide",
  },
];

// Combined for schema generation
export const allFaqs = [...basicFaqs, ...authorityFaqs];
