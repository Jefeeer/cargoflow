import { getMaxSequenceForYear } from '../db/index.js';

// ponytail: single-process in-memory counter seeded from DB max; fine for a
// low-traffic lead-gen form. Add a DB-level transaction/lock if concurrent
// multi-instance writers become a real requirement.
let cachedYear: number | null = null;
let cachedSequence = 0;

/** Generates the next reference number, e.g. CFG-Q-2026-0001. Persists via DB rows. */
export function nextReferenceNumber(): string {
  const year = new Date().getFullYear();
  if (cachedYear !== year) {
    cachedYear = year;
    cachedSequence = getMaxSequenceForYear(year);
  }
  cachedSequence += 1;
  const padded = String(cachedSequence).padStart(4, '0');
  return `CFG-Q-${year}-${padded}`;
}
