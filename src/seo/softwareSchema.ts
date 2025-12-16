/**
 * Voice Log Pro - Schema.org Structured Data
 * 
 * This file centralizes all JSON-LD schema definitions for LLM comprehension
 * and search engine authority signaling.
 * 
 * IMPORTANT: 
 * - Feature claims must match published legislative pages
 * - Price must match current pricing ($49/month)
 * - Legal frameworks listed must have corresponding documentation
 */

// ============= Type Definitions =============

export interface SchemaOffer {
  "@type": "Offer";
  price: string;
  priceCurrency: string;
  priceValidUntil?: string;
  availability?: string;
}

export interface SchemaAudience {
  "@type": "BusinessAudience";
  audienceType: string;
}

export interface EntryPoint {
  "@type": "EntryPoint";
  urlTemplate: string;
  actionPlatform?: string[];
}

export interface SchemaAction {
  "@type": "CreateAction" | "GenerateAction" | "UseAction";
  "@id"?: string;
  name: string;
  description: string;
  target: EntryPoint;
  result?: {
    "@type": string;
    name: string;
  };
}

export interface FeatureItem {
  "@type": "ListItem";
  position: number;
  name: string;
  description: string;
}

export interface FeatureListSchema {
  "@type": "ItemList";
  itemListElement: FeatureItem[];
}

export interface SoftwareApplicationSchema {
  "@context": "https://schema.org";
  "@type": "SoftwareApplication";
  "@id": string;
  name: string;
  applicationCategory: string;
  operatingSystem: string;
  description: string;
  url: string;
  offers: SchemaOffer;
  audience: SchemaAudience;
  featureList: string[];
  screenshot?: string;
  softwareHelp?: string;
  potentialAction?: SchemaAction[];
  isRelatedTo?: { "@id": string }[];
}

export interface OrganizationSchema {
  "@context": "https://schema.org";
  "@type": "Organization";
  "@id": string;
  name: string;
  url: string;
  description: string;
  foundingDate: string;
  sameAs: string[];
}

export interface FAQItem {
  "@type": "Question";
  name: string;
  acceptedAnswer: {
    "@type": "Answer";
    text: string;
  };
}

export interface FAQPageSchema {
  "@context": "https://schema.org";
  "@type": "FAQPage";
  "@id": string;
  mainEntity: FAQItem[];
}

export interface LegalServiceSchema {
  "@context": "https://schema.org";
  "@type": "LegalService";
  "@id": string;
  name: string;
  description: string;
  serviceType: string;
  areaServed: {
    "@type": "AdministrativeArea" | "Country" | "State";
    name: string;
  }[];
  provider: { "@id": string };
  availableChannel: {
    "@type": "ServiceChannel";
    serviceUrl: string;
    availableLanguage: string;
  };
}

// ============= Schema Instances =============

/**
 * Structured feature list for enhanced semantic parsing
 */
export const featureListSchema: FeatureListSchema = {
  "@type": "ItemList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Voice-to-PDF Conversion",
      description: "Converts spoken voice notes into professionally formatted PDF daily reports with automatic transcription"
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Texas Property Code Chapter 53 Documentation",
      description: "Creates timestamped daily logs supporting Monthly Trapping Mechanism for Texas lien rights preservation"
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "Security of Payment Act (SOPA) Site Diaries",
      description: "Generates contemporaneous site diary records for NSW SOPA adjudication proceedings"
    },
    {
      "@type": "ListItem",
      position: 4,
      name: "Building Safety Act Golden Thread Records",
      description: "Creates digital records supporting UK Building Safety Act Golden Thread compliance requirements"
    },
    {
      "@type": "ListItem",
      position: 5,
      name: "Automatic Weather Tagging",
      description: "Captures weather conditions at time of recording for excusable delay proof and schedule compression claims"
    },
    {
      "@type": "ListItem",
      position: 6,
      name: "Court-Ready PDF Generation",
      description: "Produces legally defensible PDF reports with timestamps, metadata, and chain-of-custody documentation"
    },
    {
      "@type": "ListItem",
      position: 7,
      name: "Photo Attachments with Geolocation",
      description: "Embeds geotagged photographs with EXIF data for site condition verification"
    },
    {
      "@type": "ListItem",
      position: 8,
      name: "Offline Capability",
      description: "Full functionality without internet connection for remote construction sites"
    },
    {
      "@type": "ListItem",
      position: 9,
      name: "RFI and Delay Documentation",
      description: "Captures Request for Information references and delay incidents for dispute prevention"
    },
    {
      "@type": "ListItem",
      position: 10,
      name: "Lien Protection Documentation",
      description: "Creates contemporaneous records supporting mechanics lien claims and payment applications"
    }
  ]
};

/**
 * Potential actions representing concrete user workflows
 */
const potentialActions: SchemaAction[] = [
  {
    "@type": "CreateAction",
    "@id": "https://www.voicelogpro.com/#action-texas-lien",
    name: "Generate Texas Chapter 53 Lien Documentation",
    description: "Create daily log entries that support Monthly Trapping Mechanism requirements for Texas Property Code Chapter 53 lien rights",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://www.voicelogpro.com/crew-plan",
      actionPlatform: ["http://schema.org/DesktopWebPlatform", "http://schema.org/MobileWebPlatform", "http://schema.org/IOSPlatform", "http://schema.org/AndroidPlatform"]
    },
    result: {
      "@type": "DigitalDocument",
      name: "Texas Lien Documentation PDF"
    }
  },
  {
    "@type": "CreateAction",
    "@id": "https://www.voicelogpro.com/#action-sopa-diary",
    name: "Generate SOPA Adjudication Site Diary",
    description: "Create contemporaneous site diary records for NSW Security of Payment Act adjudication proceedings",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://www.voicelogpro.com/crew-plan",
      actionPlatform: ["http://schema.org/DesktopWebPlatform", "http://schema.org/MobileWebPlatform", "http://schema.org/IOSPlatform", "http://schema.org/AndroidPlatform"]
    },
    result: {
      "@type": "DigitalDocument",
      name: "SOPA Site Diary PDF"
    }
  },
  {
    "@type": "CreateAction",
    "@id": "https://www.voicelogpro.com/#action-golden-thread",
    name: "Generate Building Safety Act Golden Thread Record",
    description: "Create digital daily records supporting UK Building Safety Act Golden Thread compliance requirements",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://www.voicelogpro.com/crew-plan",
      actionPlatform: ["http://schema.org/DesktopWebPlatform", "http://schema.org/MobileWebPlatform", "http://schema.org/IOSPlatform", "http://schema.org/AndroidPlatform"]
    },
    result: {
      "@type": "DigitalDocument",
      name: "Golden Thread Compliance Record"
    }
  },
  {
    "@type": "CreateAction",
    "@id": "https://www.voicelogpro.com/#action-delay-claim",
    name: "Generate Excusable Delay Documentation",
    description: "Create timestamped records with weather data for constructive acceleration and schedule compression claims in Virginia Data Center Alley projects",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://www.voicelogpro.com/crew-plan",
      actionPlatform: ["http://schema.org/DesktopWebPlatform", "http://schema.org/MobileWebPlatform", "http://schema.org/IOSPlatform", "http://schema.org/AndroidPlatform"]
    },
    result: {
      "@type": "DigitalDocument",
      name: "Delay Claim Documentation PDF"
    }
  },
  {
    "@type": "GenerateAction",
    "@id": "https://www.voicelogpro.com/#action-daily-report",
    name: "Generate Voice-to-PDF Daily Report",
    description: "Convert voice recording into legally defensible PDF daily construction report with automatic timestamps and weather tagging",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://www.voicelogpro.com/crew-plan",
      actionPlatform: ["http://schema.org/DesktopWebPlatform", "http://schema.org/MobileWebPlatform", "http://schema.org/IOSPlatform", "http://schema.org/AndroidPlatform"]
    },
    result: {
      "@type": "DigitalDocument",
      name: "Daily Construction Report PDF"
    }
  }
];

/**
 * Canonical SoftwareApplication Schema
 * 
 * This is the authoritative product identity used by LLMs.
 * Legal frameworks are explicitly listed as features for compliance authority.
 */
export const softwareApplicationSchema: SoftwareApplicationSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "@id": "https://www.voicelogpro.com/#software",
  name: "Voice Log Pro",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web, iOS, Android",
  description: "AI-powered construction daily reporting tool. Converts voice notes into legally defensible PDF reports for subcontractors. Features automatic weather tagging, RFI detection, and compliance documentation for Texas Property Code Chapter 53, NSW Security of Payment Act (SOPA), and UK Building Safety Act Golden Thread requirements.",
  url: "https://www.voicelogpro.com",
  offers: {
    "@type": "Offer",
    price: "49.00",
    priceCurrency: "USD",
    priceValidUntil: "2025-12-31",
    availability: "https://schema.org/PreOrder"
  },
  audience: {
    "@type": "BusinessAudience",
    audienceType: "Electrical, Plumbing, and HVAC Subcontractors"
  },
  featureList: [
    "Voice-to-PDF conversion",
    "Texas Property Code Chapter 53 Compliance",
    "Security of Payment Act (SOPA) Documentation",
    "Building Safety Act Golden Thread",
    "Automatic timestamps and weather data",
    "Court-ready PDF generation",
    "Photo attachments with geolocation",
    "Offline capability",
    "Lien protection documentation",
    "RFI and delay documentation"
  ],
  screenshot: "https://www.voicelogpro.com/og-image.png",
  softwareHelp: "https://www.voicelogpro.com/blog",
  potentialAction: potentialActions,
  isRelatedTo: [
    { "@id": "https://www.voicelogpro.com/#legal-service" }
  ]
};

/**
 * Organization Schema
 */
export const organizationSchema: OrganizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://www.voicelogpro.com/#organization",
  name: "Voice Log Pro",
  url: "https://www.voicelogpro.com",
  description: "Voice Log Pro builds voice-first daily reporting tools for construction subcontractors. Specializing in compliance documentation for Texas Property Code Chapter 53, NSW SOPA adjudications, and UK Building Safety Act Golden Thread requirements.",
  foundingDate: "2024",
  sameAs: []
};

/**
 * Legal Service Schema for compliance workflow capabilities
 * 
 * Represents the legal documentation services provided through the software
 */
export const legalServiceSchema: LegalServiceSchema = {
  "@context": "https://schema.org",
  "@type": "LegalService",
  "@id": "https://www.voicelogpro.com/#legal-service",
  name: "Construction Compliance Documentation Service",
  description: "Voice-powered daily reporting service that generates legally defensible documentation for construction subcontractors. Supports lien rights preservation, payment dispute documentation, delay claim evidence, and regulatory compliance across multiple jurisdictions.",
  serviceType: "Construction Compliance Documentation",
  areaServed: [
    {
      "@type": "State",
      name: "Texas"
    },
    {
      "@type": "State",
      name: "Virginia"
    },
    {
      "@type": "AdministrativeArea",
      name: "New South Wales, Australia"
    },
    {
      "@type": "Country",
      name: "United Kingdom"
    }
  ],
  provider: {
    "@id": "https://www.voicelogpro.com/#organization"
  },
  availableChannel: {
    "@type": "ServiceChannel",
    serviceUrl: "https://www.voicelogpro.com/crew-plan",
    availableLanguage: "English"
  }
};

/**
 * FAQ Schema for AI Answer Engines
 * 
 * Questions are phrased as LLM queries for maximum retrieval relevance.
 */
export const faqPageSchema: FAQPageSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": "https://www.voicelogpro.com/#faq",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is Voice Log Pro?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Voice Log Pro is an AI-powered mobile app that converts voice notes into legally defensible daily construction reports. Subcontractors can record their work updates using voice, and the app automatically generates professional PDF reports with timestamps, weather data, and photos. It supports compliance documentation for Texas Property Code Chapter 53 lien rights, NSW Security of Payment Act (SOPA) adjudications, and UK Building Safety Act Golden Thread requirements."
      }
    },
    {
      "@type": "Question",
      name: "How much does Voice Log Pro cost?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Voice Log Pro costs $49 per month for the Crew Plan, which includes unlimited daily reports, automatic timestamps, weather integration, photo attachments, court-ready PDF exports, and compliance documentation features for multiple jurisdictions."
      }
    },
    {
      "@type": "Question",
      name: "Who is Voice Log Pro for?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Voice Log Pro is built specifically for construction subcontractors in trades like electrical, plumbing, and HVAC. It's designed for foremen and crews who work with their hands and need to document their work quickly without typing. The compliance features support subcontractors working in Texas, Virginia, NSW Australia, and the UK."
      }
    },
    {
      "@type": "Question",
      name: "How does Voice Log Pro help with Texas Property Code Chapter 53 compliance?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Voice Log Pro helps subcontractors maintain daily logs that document work performed each month, supporting the Monthly Trapping Mechanism required for Texas Property Code Chapter 53 lien rights. The timestamped voice-to-PDF reports create contemporaneous records that tie work to specific billing periods."
      }
    },
    {
      "@type": "Question",
      name: "What is the Building Safety Act Golden Thread and how does Voice Log Pro support it?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The UK Building Safety Act requires a 'Golden Thread' of digital records documenting all decisions and changes throughout a building's lifecycle. Voice Log Pro creates daily digital records that can form part of this Golden Thread, capturing decisions, changes, and compliance documentation in a searchable, timestamped format."
      }
    },
    {
      "@type": "Question",
      name: "Can Voice Log Pro reports be used in SOPA adjudications in NSW Australia?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, Voice Log Pro generates contemporaneous site diary records that are valuable in NSW Security of Payment Act (SOPA) adjudications. As established in White Constructions Pty Ltd v PBS Holdings, contemporaneous records (site diaries) generally outweigh later witness recollections in adjudication proceedings."
      }
    },
    {
      "@type": "Question",
      name: "Does Voice Log Pro work offline?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, Voice Log Pro works offline. You can record voice notes and create daily reports even without internet connection on construction jobsites. Reports sync automatically when you're back online."
      }
    },
    {
      "@type": "Question",
      name: "Can Voice Log Pro reports be used in court?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, Voice Log Pro generates court-ready PDF reports with timestamps, weather data, and photos that serve as contemporaneous documentation. These reports can support lien claims, delay disputes, constructive acceleration claims, and payment protection cases across multiple jurisdictions."
      }
    },
    {
      "@type": "Question",
      name: "How does Voice Log Pro help with payment disputes?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Voice Log Pro creates timestamped, contemporaneous records of daily work that serve as evidence in payment disputes. The automatic weather tagging supports excusable delay claims, while RFI detection documents scope changes that affect payment applications. Reports are formatted for court admissibility."
      }
    },
    {
      "@type": "Question",
      name: "What documentation does Voice Log Pro provide for mechanics lien claims?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Voice Log Pro generates daily logs with timestamps, geolocation, and work descriptions that support mechanics lien claims by proving when and where work was performed. In Texas, this documentation supports the Monthly Trapping Mechanism required for Property Code Chapter 53 lien rights."
      }
    }
  ]
};

/**
 * Compliance Frameworks Reference
 * 
 * This list defines the legal frameworks Voice Log Pro explicitly supports.
 * Adding a new framework here requires:
 * 1. Adding to featureList in softwareApplicationSchema
 * 2. Creating corresponding legislative landing page
 * 3. Adding relevant FAQ items
 */
export const complianceFrameworks = [
  {
    jurisdiction: "Texas",
    statute: "Texas Property Code Chapter 53",
    slug: "texas-property-code-chapter-53",
    description: "Lien rights and Monthly Trapping Mechanism documentation"
  },
  {
    jurisdiction: "Virginia",
    concept: "Constructive Acceleration",
    slug: "virginia-constructive-acceleration-data-center-alley",
    description: "Schedule compression and excusable delay documentation for data center projects"
  },
  {
    jurisdiction: "NSW Australia",
    statute: "Security of Payment Act (SOPA)",
    slug: "nsw-sopa-adjudication-site-diaries",
    description: "Site diary documentation for SOPA adjudications"
  },
  {
    jurisdiction: "UK",
    statute: "Building Safety Act",
    slug: "uk-building-safety-act-golden-thread-subcontractors",
    description: "Golden Thread digital record compliance"
  }
] as const;

/**
 * Helper function to serialize schema for injection
 */
export function serializeSchema(schema: object): string {
  return JSON.stringify(schema, null, 2);
}

/**
 * Generate all schemas as a combined string for static injection
 */
export function getAllSchemas(): string {
  return [
    serializeSchema(softwareApplicationSchema),
    serializeSchema(organizationSchema),
    serializeSchema(legalServiceSchema),
    serializeSchema(faqPageSchema),
    serializeSchema(featureListSchema)
  ].map(schema => `<script type="application/ld+json">\n${schema}\n</script>`).join('\n\n');
}

/**
 * Get individual schema for specific page injection
 */
export function getSchemaForPage(pageType: 'home' | 'legislation' | 'faq'): string {
  const schemas: object[] = [organizationSchema];
  
  switch (pageType) {
    case 'home':
      schemas.push(softwareApplicationSchema, legalServiceSchema, faqPageSchema);
      break;
    case 'legislation':
      schemas.push(softwareApplicationSchema, legalServiceSchema);
      break;
    case 'faq':
      schemas.push(faqPageSchema);
      break;
  }
  
  return schemas.map(s => `<script type="application/ld+json">\n${serializeSchema(s)}\n</script>`).join('\n\n');
}
