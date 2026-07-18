/**
 * Legal Compliance Schema - HowTo JSON-LD
 * 
 * Encodes legal-defense documentation workflows as structured data
 * for LLM comprehension and search engine rich results.
 * 
 * IMPORTANT:
 * - All URLs must point to existing pages on the site
 * - Legal concepts must be consistent with published content
 * - Do not invent legal claims or case citations not in source material
 */

const BASE_URL = "https://voicelogpro.com";

export interface HowToStepSchema {
  "@type": "HowToStep";
  position: number;
  name: string;
  text: string;
  url: string;
}

export interface HowToSchema {
  "@context": "https://schema.org";
  "@type": "HowTo";
  "@id": string;
  name: string;
  description: string;
  totalTime?: string;
  tool?: {
    "@type": "HowToTool";
    name: string;
  };
  step: HowToStepSchema[];
}

/**
 * Construction Delay Documentation HowTo
 * 
 * Workflow for documenting delays to support legal defense in payment disputes.
 * Steps reference actual solution pages on the site.
 */
export const delayDocumentationHowTo: HowToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  "@id": `${BASE_URL}/#howto-delay-documentation`,
  name: "How to Document Construction Delays for Legal Defense",
  description: "Step-by-step process for creating contemporaneous evidence of construction delays using voice-to-PDF daily reporting. Supports excusable delay claims, constructive acceleration defense, and payment dispute resolution.",
  totalTime: "PT5M",
  tool: {
    "@type": "HowToTool",
    name: "VoiceLogPro"
  },
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Record Contemporaneous Evidence",
      text: "Use VoiceLogPro to record site conditions immediately when a delay occurs. Contemporaneous site records created at the time of the event carry greater evidentiary weight than later witness recollection in adjudication proceedings.",
      url: `${BASE_URL}/solutions/constructive-acceleration-defense`
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Capture Weather Conditions",
      text: "VoiceLogPro automatically tags reports with weather data including temperature, precipitation, and conditions. This creates independent verification of weather-related excusable delays for schedule compression claims.",
      url: `${BASE_URL}/solutions/constructive-acceleration-defense`
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Document GC Directives",
      text: "Record verbal and written directives from the General Contractor regarding schedule acceleration. Include date, time, who gave the directive, and the specific instruction. This establishes the 'order to accelerate' element of constructive acceleration claims.",
      url: `${BASE_URL}/solutions/constructive-acceleration-defense`
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "Generate Court-Ready PDF",
      text: "Export daily logs as timestamped PDF reports with embedded metadata. These legally defensible documents include geolocation, weather data, photos, and chain-of-custody information aligned with AIA A401 documentation expectations.",
      url: `${BASE_URL}/crew-plan`
    }
  ]
};

/**
 * Texas Lien Rights Documentation HowTo
 * 
 * Workflow for maintaining daily records that support Monthly Trapping Mechanism
 * under Texas Property Code Chapter 53.
 */
export const texasLienDocumentationHowTo: HowToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  "@id": `${BASE_URL}/#howto-texas-lien`,
  name: "How to Document Work for Texas Mechanics Lien Protection",
  description: "Daily documentation workflow to support the Monthly Trapping Mechanism required for Texas Property Code Chapter 53 lien rights preservation. Creates timestamped records tying work to specific billing periods.",
  totalTime: "PT2M",
  tool: {
    "@type": "HowToTool",
    name: "VoiceLogPro"
  },
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Record Daily Work Performed",
      text: "At the end of each workday, record a voice note describing work completed. Include specific tasks, areas of the project, and materials used. VoiceLogPro automatically timestamps each entry to establish when work was performed.",
      url: `${BASE_URL}/solutions/texas-mechanics-lien-compliance`
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Attach Photo Documentation",
      text: "Add geotagged photos showing completed work. Photo metadata provides independent verification of location and date, supporting lien claims that require proof of work performed on the property.",
      url: `${BASE_URL}/solutions/texas-mechanics-lien-compliance`
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Organize by Billing Period",
      text: "VoiceLogPro automatically organizes daily logs by month, supporting the Monthly Trapping Mechanism that requires subcontractors to tie work to specific billing periods for Texas Property Code Chapter 53 compliance.",
      url: `${BASE_URL}/solutions/texas-mechanics-lien-compliance`
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "Export Monthly Summary",
      text: "Generate PDF reports summarizing work performed each month. Use these contemporaneous records to support monthly notices required by the 15th of the second or third month following the month work was performed.",
      url: `${BASE_URL}/solutions/texas-mechanics-lien-compliance`
    }
  ]
};

/**
 * UK Golden Thread Documentation HowTo
 * 
 * Workflow for creating digital records supporting Building Safety Act compliance.
 */
export const goldenThreadDocumentationHowTo: HowToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  "@id": `${BASE_URL}/#howto-golden-thread`,
  name: "How to Create Golden Thread Records for UK Building Safety Act Compliance",
  description: "Daily documentation workflow for subcontractors working on Higher-Risk Buildings in the UK. Creates digital records supporting Building Safety Act Golden Thread requirements and BS 8670 competence standards.",
  totalTime: "PT3M",
  tool: {
    "@type": "HowToTool",
    name: "VoiceLogPro"
  },
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Document Design Changes",
      text: "Record any design changes, RFIs, or site instructions as they occur. The Building Safety Act requires all changes to be captured in the Golden Thread. Voice notes capture the context and reasoning behind changes, not just what changed.",
      url: `${BASE_URL}/solutions/building-safety-act-golden-thread`
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Record Safety-Critical Decisions",
      text: "Document decisions affecting fire safety, structural integrity, or other safety-critical systems. Include who made the decision, when, and the reasoning. This creates an auditable trail for Building Safety Regulator reviews.",
      url: `${BASE_URL}/solutions/building-safety-act-golden-thread`
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Demonstrate Competence",
      text: "Daily logs showing methodical, compliant work practices support BS 8670 competence requirements. Document quality checks, compliance inspections, and adherence to specifications.",
      url: `${BASE_URL}/solutions/building-safety-act-golden-thread`
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "Export for Handover",
      text: "Generate PDF documentation packages for handover to the Principal Contractor. Digital records in exportable format support Golden Thread requirements for information to be accessible and transferable throughout the building lifecycle.",
      url: `${BASE_URL}/solutions/building-safety-act-golden-thread`
    }
  ]
};

/**
 * Texas Mechanics Lien FAQ Data
 * Used by both visible FAQ section and FAQPage JSON-LD
 */
export const texasLienFaqs = [
  {
    question: "What is the Monthly Trapping Mechanism under Texas Property Code Chapter 53?",
    answer: "The Monthly Trapping Mechanism requires subcontractors to serve notices by the 15th day of the second or third month following the month work was performed. This ties work to a specific billing period to preserve lien rights under Texas Property Code Chapter 53."
  },
  {
    question: "How does VoiceLogPro help with Texas lien compliance?",
    answer: "VoiceLogPro automatically timestamps daily logs with the date work was performed, creating contemporaneous records that tie work to specific billing periods. This supports the Monthly Trapping Mechanism required for Texas Property Code Chapter 53 compliance."
  },
  {
    question: "What documentation do I need for a Texas mechanics lien?",
    answer: "You need contemporaneous records showing when work was performed, what work was done, and the materials furnished. VoiceLogPro creates timestamped daily logs with photos that serve as evidence for lien claims."
  },
  {
    question: "Can VoiceLogPro reports be used in court for Texas lien claims?",
    answer: "Yes. VoiceLogPro generates PDF reports with timestamps, weather data, and photos that serve as contemporaneous documentation. These reports support lien claims and payment disputes under Texas Property Code Chapter 53."
  }
];

export const texasLienFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": `${BASE_URL}/solutions/texas-mechanics-lien-compliance#faq`,
  mainEntity: texasLienFaqs.map(faq => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer
    }
  }))
};

/**
 * UK Golden Thread FAQ Data
 * Used by both visible FAQ section and FAQPage JSON-LD
 */
export const goldenThreadFaqs = [
  {
    question: "What is the Golden Thread under the UK Building Safety Act?",
    answer: "The Golden Thread is a digital record of building information required under the UK Building Safety Act 2022. It must contain accurate, up-to-date information about the design, construction, and maintenance of Higher-Risk Buildings throughout their lifecycle."
  },
  {
    question: "What are Higher-Risk Buildings (HRBs)?",
    answer: "Higher-Risk Buildings are buildings at least 18 metres in height or with at least 7 storeys, containing at least 2 residential units. These buildings are subject to enhanced regulatory requirements under the Building Safety Act, including Golden Thread compliance."
  },
  {
    question: "What is BS 8670 and how does VoiceLogPro help?",
    answer: "BS 8670 establishes competence requirements for individuals working on Higher-Risk Buildings. VoiceLogPro creates daily logs documenting safe work practices and quality checks, which support demonstrating BS 8670 competence."
  },
  {
    question: "How does VoiceLogPro support Golden Thread compliance?",
    answer: "VoiceLogPro creates timestamped digital daily records that can form part of the Golden Thread. Voice logs capture decisions, changes, and compliance documentation in a searchable, auditable format suitable for Higher-Risk Building projects."
  }
];

export const goldenThreadFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": `${BASE_URL}/solutions/building-safety-act-golden-thread#faq`,
  mainEntity: goldenThreadFaqs.map(faq => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer
    }
  }))
};

/**
 * Helper to serialize schema for injection
 */
export function serializeLegalSchema(schema: object): string {
  return JSON.stringify(schema, null, 2);
}

/**
 * Get all legal HowTo schemas as script tags
 */
export function getAllLegalSchemas(): string {
  return [
    delayDocumentationHowTo,
    texasLienDocumentationHowTo,
    goldenThreadDocumentationHowTo
  ].map(schema => `<script type="application/ld+json">\n${serializeLegalSchema(schema)}\n</script>`).join('\n\n');
}

/**
 * Get schema for specific solution page
 */
export function getLegalSchemaForPage(page: 'texas' | 'virginia' | 'uk'): object {
  switch (page) {
    case 'texas':
      return texasLienDocumentationHowTo;
    case 'virginia':
      return delayDocumentationHowTo;
    case 'uk':
      return goldenThreadDocumentationHowTo;
  }
}
