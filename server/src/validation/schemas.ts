import { z } from 'zod';
import { SERVICE_TYPES } from '../types.js';

const name = z.string().trim().min(1, 'This field is required.').max(120);
const shortText = z.string().trim().min(1, 'This field is required.').max(200);
const longText = z.string().trim().max(4000).optional();
const email = z
  .string()
  .trim()
  .min(1, 'Email is required.')
  .max(200)
  .email('Must be a valid email address.');
const optionalShort = z.string().trim().max(200).optional();

export const quoteSchema = z.object({
  fullName: name,
  companyName: optionalShort,
  email,
  phone: shortText.max(40, 'Phone number is too long.'),
  serviceType: z.enum(SERVICE_TYPES, {
    errorMap: () => ({ message: `Must be one of: ${SERVICE_TYPES.join(', ')}` }),
  }),
  cargoDescription: z.string().trim().min(1, 'This field is required.').max(4000),
  origin: shortText,
  destination: shortText,
  pickupDate: optionalShort,
  requestedDeliveryDate: optionalShort,
  approximateWeight: optionalShort,
  pieces: optionalShort,
  specialHandlingRequirements: longText,
  additionalNotes: longText,
  consentToContact: z.literal(true, {
    errorMap: () => ({ message: 'You must consent to be contacted.' }),
  }),
});

export type QuoteInput = z.infer<typeof quoteSchema>;

export const contactSchema = z.object({
  name,
  company: optionalShort,
  email,
  phone: optionalShort,
  subject: shortText,
  message: z.string().trim().min(1, 'This field is required.').max(4000),
});

export type ContactInput = z.infer<typeof contactSchema>;
