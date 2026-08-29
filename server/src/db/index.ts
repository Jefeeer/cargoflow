import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataDir = join(__dirname, '..', '..', 'data');
mkdirSync(dataDir, { recursive: true });

export const dbPath = join(dataDir, 'cargoflow.db');

export const db = new DatabaseSync(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS quotes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    reference_number TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    company_name TEXT,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    service_type TEXT NOT NULL,
    cargo_description TEXT NOT NULL,
    origin TEXT NOT NULL,
    destination TEXT NOT NULL,
    pickup_date TEXT,
    requested_delivery_date TEXT,
    approximate_weight TEXT,
    pieces TEXT,
    special_handling_requirements TEXT,
    additional_notes TEXT,
    consent_to_contact INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'new',
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    company TEXT,
    email TEXT NOT NULL,
    phone TEXT,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'new',
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

export interface InsertQuoteRow {
  referenceNumber: string;
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

const insertQuoteStmt = db.prepare(`
  INSERT INTO quotes (
    reference_number, full_name, company_name, email, phone, service_type,
    cargo_description, origin, destination, pickup_date, requested_delivery_date,
    approximate_weight, pieces, special_handling_requirements, additional_notes,
    consent_to_contact
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

export function insertQuote(row: InsertQuoteRow): number {
  const result = insertQuoteStmt.run(
    row.referenceNumber,
    row.fullName,
    row.companyName ?? null,
    row.email,
    row.phone,
    row.serviceType,
    row.cargoDescription,
    row.origin,
    row.destination,
    row.pickupDate ?? null,
    row.requestedDeliveryDate ?? null,
    row.approximateWeight ?? null,
    row.pieces ?? null,
    row.specialHandlingRequirements ?? null,
    row.additionalNotes ?? null,
    row.consentToContact ? 1 : 0,
  );
  return Number(result.lastInsertRowid);
}

export interface InsertContactRow {
  name: string;
  company?: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

const insertContactStmt = db.prepare(`
  INSERT INTO contacts (name, company, email, phone, subject, message)
  VALUES (?, ?, ?, ?, ?, ?)
`);

export function insertContact(row: InsertContactRow): number {
  const result = insertContactStmt.run(
    row.name,
    row.company ?? null,
    row.email,
    row.phone ?? null,
    row.subject,
    row.message,
  );
  return Number(result.lastInsertRowid);
}

const maxReferenceForYearStmt = db.prepare(`
  SELECT reference_number AS referenceNumber
  FROM quotes
  WHERE reference_number LIKE ?
  ORDER BY id DESC
  LIMIT 1
`);

/** Highest existing reference number's sequence for a given year, or 0 if none. */
export function getMaxSequenceForYear(year: number): number {
  const row = maxReferenceForYearStmt.get(`CFG-Q-${year}-%`) as
    | { referenceNumber: string }
    | undefined;
  if (!row) return 0;
  const match = row.referenceNumber.match(/-(\d+)$/);
  return match ? Number(match[1]) : 0;
}
