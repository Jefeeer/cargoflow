// ============================================================
// CargoFlow site content — single source of truth for copy.
// Based on CargoFlow's real positioning. Contains NO fabricated
// testimonials, certifications, partnerships, stats, or logos.
// ============================================================
import type { ServiceKey } from './types';

export const COMPANY = {
  name: 'CargoFlow',
  legalName: 'CargoFlow LLC',
  location: 'North Miami, Florida',
  region: 'FL',
  email: 'info@cargoflowgroup.com',
  tagline: 'Precision logistics from Miami to destinations across the United States.',
} as const;

export interface NavItem {
  label: string;
  to: string;
}

/** Primary navigation. Section links use hash anchors on the home page. */
export const NAV_ITEMS: NavItem[] = [
  { label: 'Services', to: '/#services' },
  { label: 'Aviation', to: '/aviation' },
  { label: 'Freight Forwarding', to: '/freight' },
  { label: 'Business Shipping', to: '/business-shipping' },
  { label: 'About', to: '/about' },
  { label: 'Why CargoFlow', to: '/#why' },
  { label: 'Contact', to: '/contact' },
];

export const HERO = {
  kicker: 'Miami-based logistics · National reach',
  headline: ['Precision Logistics.', 'Delivered Without Compromise.'],
  subhead:
    'CargoFlow provides reliable aviation parts transport, freight forwarding, and business shipping from Miami to destinations across the United States.',
  primaryCta: { label: 'Get a Free Quote', to: '/quote' },
  secondaryCta: { label: 'Explore Our Services', to: '/#services' },
} as const;

export const POSITIONING = {
  kicker: 'Your Transportation & Logistics Partner',
  heading: 'Critical shipments, handled with precision.',
  body: 'CargoFlow combines logistics expertise, responsive service, and technology-driven routing to handle critical and time-sensitive shipments — with clear communication from pickup to delivery.',
  values: [
    {
      title: 'Integrity',
      body: 'Straightforward coordination and honest communication on every shipment.',
    },
    {
      title: 'Adaptability',
      body: 'Flexible routing and planning that adjust to complex, changing requirements.',
    },
    {
      title: 'Service',
      body: 'Hands-on, responsive coordination throughout the shipment journey.',
    },
    {
      title: 'Resilience',
      body: 'Built for time-sensitive logistics where timing and reliability matter.',
    },
  ],
} as const;

export interface ServiceContent {
  key: ServiceKey;
  eyebrow: string;
  title: string;
  short: string;
  description: string;
  highlights: string[];
  cta: { label: string; to: string };
  route: string;
}

export const SERVICES: ServiceContent[] = [
  {
    key: 'aviation',
    eyebrow: 'Time-critical',
    title: 'Aviation Parts Transportation',
    short:
      'Aircraft parts, engines, and specialized aviation equipment moved with urgency and care.',
    description:
      'Critical aviation components cannot afford unnecessary delays. CargoFlow transports aircraft parts, engines, specialized aviation equipment, and time-sensitive components with careful handling and responsive coordination.',
    highlights: [
      'Time-sensitive transport',
      'Careful handling of sensitive components',
      'Local Miami expertise',
      'Interstate delivery',
      'Responsive coordination',
      'Shipment visibility',
    ],
    cta: { label: 'Request Aviation Quote', to: '/quote?service=aviation' },
    route: '/aviation',
  },
  {
    key: 'freight',
    eyebrow: 'End-to-end',
    title: 'Freight Forwarding',
    short: 'Coordinated movement of goods from port to warehouse to carrier to final destination.',
    description:
      'CargoFlow manages the movement of goods through every stage — port, warehouse, carrier, and final destination — with smart routing and cost-conscious planning that keeps timelines on track.',
    highlights: [
      'Shipment coordination',
      'Carrier coordination',
      'Smart routing',
      'Cost-conscious logistics',
      'Timeline management',
      'Shipment tracking',
    ],
    cta: { label: 'Request Freight Quote', to: '/quote?service=freight' },
    route: '/freight',
  },
  {
    key: 'business',
    eyebrow: 'Local & interstate',
    title: 'Business Shipping Solutions',
    short:
      'Local and interstate logistics for growing small-to-medium businesses and recurring shipments.',
    description:
      'CargoFlow provides local and interstate logistics services for growing small-to-medium businesses — from retail inventory and wholesale orders to multi-location distribution and recurring shipments.',
    highlights: [
      'Retail inventory',
      'Wholesale orders',
      'Multi-location distribution',
      'Business deliveries',
      'Recurring shipments',
      'Local & interstate coverage',
    ],
    cta: { label: 'Request Business Shipping Quote', to: '/quote?service=business' },
    route: '/business-shipping',
  },
];

export const AVIATION = {
  kicker: 'Aviation specialization',
  headline: 'Built for Time-Critical Aviation Logistics',
  body: 'Aircraft-related transportation is unlike generic local delivery. It demands precision, urgency, clear communication, careful handling, and reliable scheduling. CargoFlow is built around those demands.',
  requirements: [
    { title: 'Precision', body: 'Exacting handling for sensitive, high-value components.' },
    { title: 'Urgency', body: 'Movement planned around time-critical aviation timelines.' },
    { title: 'Communication', body: 'Clear updates and coordination at every step.' },
    { title: 'Careful handling', body: 'Protecting components from origin to destination.' },
    { title: 'Reliable scheduling', body: 'Dependable pickup and delivery planning.' },
  ],
  cta: { label: 'Get an Aviation Shipping Quote', to: '/quote?service=aviation' },
} as const;

export interface ProcessStep {
  number: string;
  title: string;
  body: string;
  points: string[];
}

export const PROCESS: ProcessStep[] = [
  {
    number: '01',
    title: 'Tell Us About Your Shipment',
    body: 'Share the essentials so we can scope the right solution.',
    points: ['Origin', 'Destination', 'Cargo type', 'Timeline', 'Special requirements'],
  },
  {
    number: '02',
    title: 'CargoFlow Plans the Route',
    body: 'We coordinate the transportation approach end to end.',
    points: ['Transportation coordination', 'Routing', 'Timing', 'Carrier planning where applicable'],
  },
  {
    number: '03',
    title: 'Shipment Moves',
    body: 'Your cargo moves with professional handling and updates.',
    points: ['Professional handling', 'Ongoing communication', 'Shipment visibility'],
  },
  {
    number: '04',
    title: 'Delivered',
    body: 'We confirm completion and successful delivery.',
    points: ['Delivery confirmation', 'Wrap-up and follow-up'],
  },
];

export interface WhyItem {
  title: string;
  body: string;
}

export const WHY_CARGOFLOW: WhyItem[] = [
  {
    title: 'Industry-Specific Expertise',
    body: 'We understand the demands of aviation, freight forwarding, and growing businesses.',
  },
  {
    title: 'Technology-Driven Efficiency',
    body: 'Smart routing and shipment visibility help create more efficient logistics operations.',
  },
  {
    title: 'Miami Expertise',
    body: 'Strategically based in North Miami, Florida.',
  },
  {
    title: 'National Reach',
    body: 'Coordinate shipments from South Florida to destinations throughout the United States.',
  },
  {
    title: 'Responsive Service',
    body: 'Clear communication and hands-on coordination throughout the shipment journey.',
  },
  {
    title: 'Time-Sensitive Logistics',
    body: 'Built for shipments where timing and reliability matter.',
  },
];

export const TECHNOLOGY = {
  kicker: 'Technology',
  headline: 'Visibility From Pickup to Delivery',
  body: 'Smart routing and shipment visibility help keep every shipment on track. The milestones below illustrate how a CargoFlow shipment could progress from quote to delivery.',
  milestones: [
    'Quote Confirmed',
    'Scheduled',
    'Picked Up',
    'In Transit',
    'Out for Delivery',
    'Delivered',
  ],
} as const;

/** Clearly-labeled demo data for the tracking visualization. Not a production system. */
export const TRACKING_DEMO = {
  trackingNumber: 'CFG-DEMO-10245',
  status: 'In Transit',
  service: 'Aviation Parts Transportation',
  route: ['Miami, FL', 'Orlando, FL', 'Atlanta, GA'],
  currentLegIndex: 1,
  eta: 'Illustrative demo — not a live shipment',
} as const;

export const ABOUT = {
  kicker: 'About CargoFlow',
  headline: 'Complex logistics, simplified.',
  body: [
    'CargoFlow is a logistics partner based in North Miami, Florida, specializing in aviation parts transportation, freight forwarding, and small-to-medium business shipping.',
    'CargoFlow simplifies complex logistics so businesses can stay focused on their operations while we handle critical transportation — coordinating shipments from South Florida to destinations across the United States.',
  ],
  facts: [
    { label: 'Headquarters', value: 'North Miami, Florida' },
    { label: 'Reach', value: 'Nationwide across the United States' },
    { label: 'Focus', value: 'Aviation · Freight · Business shipping' },
    { label: 'Approach', value: 'Technology-driven, responsive coordination' },
  ],
} as const;

export const NETWORK = {
  kicker: 'Local expertise. National reach.',
  headline: 'Miami Based. Nationwide Reach.',
  body: 'CargoFlow coordinates shipments from its South Florida hub to destinations across the United States. The network below is an illustrative visualization of that reach — not live operational data.',
} as const;

export const QUOTE_CTA = {
  headline: 'Need to Move Something Important?',
  body: "Tell us what you're shipping, where it's going, and when it needs to arrive. CargoFlow will help determine the right logistics solution.",
  primaryCta: { label: 'Get a Free Quote', to: '/quote' },
  secondaryCta: { label: 'Contact CargoFlow', to: '/contact' },
} as const;

export const FOOTER = {
  blurb: COMPANY.tagline,
  columns: [
    {
      heading: 'Services',
      links: [
        { label: 'Aviation Parts Transportation', to: '/aviation' },
        { label: 'Freight Forwarding', to: '/freight' },
        { label: 'Business Shipping', to: '/business-shipping' },
      ],
    },
    {
      heading: 'Company',
      links: [
        { label: 'About', to: '/about' },
        { label: 'Why CargoFlow', to: '/#why' },
        { label: 'Contact', to: '/contact' },
      ],
    },
    {
      heading: 'Get Started',
      links: [{ label: 'Request a Quote', to: '/quote' }],
    },
  ],
  legal: [
    { label: 'Privacy Policy', to: '/privacy' },
    { label: 'Terms', to: '/terms' },
  ],
} as const;

/** Success message shown after a quote submits. No response-time promise. */
export const QUOTE_SUCCESS =
  'Thank you. Your quote request has been received. The CargoFlow team will be able to review your shipment information.';

export const CONTACT_SUCCESS = 'Thank you. Your message has been received.';
