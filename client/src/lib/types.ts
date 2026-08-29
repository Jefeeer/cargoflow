// ============================================================
// Shared API contract — MUST stay in sync with server/src/types.ts
// ============================================================

export type ServiceKey = 'aviation' | 'freight' | 'business' | 'other';

export interface ServiceOption {
  key: ServiceKey;
  /** Human label sent to the backend as `serviceType`. */
  label: string;
}

/** Canonical service list. Query param (?service=<key>) maps to these. */
export const SERVICE_OPTIONS: ServiceOption[] = [
  { key: 'aviation', label: 'Aviation Parts Transportation' },
  { key: 'freight', label: 'Freight Forwarding' },
  { key: 'business', label: 'Business Shipping' },
  { key: 'other', label: 'Other' },
];

export const SERVICE_LABELS = SERVICE_OPTIONS.map((s) => s.label);

/** Resolve a ?service= query key to its full label (for preselect). */
export function serviceLabelFromKey(key: string | null): string | undefined {
  return SERVICE_OPTIONS.find((s) => s.key === key)?.label;
}

// ---------- Quote ----------
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

// ---------- Contact ----------
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

// ---------- Errors ----------
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
  uptime?: number;
}
