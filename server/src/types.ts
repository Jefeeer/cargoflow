// Server-side mirror of client/src/lib/types.ts — keep in sync.

export const SERVICE_TYPES = [
  'Aviation Parts Transportation',
  'Freight Forwarding',
  'Business Shipping',
  'Other',
] as const;

export type ServiceType = (typeof SERVICE_TYPES)[number];

export interface QuoteRequest {
  fullName: string;
  companyName?: string;
  email: string;
  phone: string;
  serviceType: string;
  cargoDescription: string;
  origin: string;
  destination: string;
  pickupDate?: string;
  requestedDeliveryDate?: string;
  approximateWeight?: string;
  pieces?: string;
  specialHandlingRequirements?: string;
  additionalNotes?: string;
  consentToContact: boolean;
}

export interface QuoteResponse {
  success: true;
  referenceNumber: string;
  message: string;
}

export interface ContactRequest {
  name: string;
  company?: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export interface ContactResponse {
  success: true;
  message: string;
}

export interface FieldError {
  field: string;
  message: string;
}

export interface ApiErrorResponse {
  success: false;
  error: string;
  fields?: FieldError[];
}

export interface HealthResponse {
  status: string;
  timestamp: string;
  uptime: number;
}

export interface QuoteRecord extends QuoteRequest {
  id: number;
  referenceNumber: string;
  status: string;
  createdAt: string;
}

export interface ContactRecord extends ContactRequest {
  id: number;
  status: string;
  createdAt: string;
}
