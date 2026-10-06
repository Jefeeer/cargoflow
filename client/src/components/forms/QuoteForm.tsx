'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSearchParams } from 'next/navigation';
import { ApiError, submitQuote } from '@/lib/api';
import { SERVICE_OPTIONS, serviceLabelFromKey } from '@/lib/types';
import { QUOTE_SUCCESS } from '@/lib/content';
import { Arrow } from '@/components/ui/Arrow';
import { Field, FormSection, ServerError, a11y } from './Field';

const quoteSchema = z.object({
  fullName: z.string().trim().min(1, 'Full name is required.'),
  companyName: z.string().trim().optional(),
  email: z.string().trim().min(1, 'Email is required.').email('Enter a valid email address.'),
  phone: z.string().trim().min(1, 'Phone number is required.'),
  serviceType: z.string().min(1, 'Select a service type.'),
  cargoDescription: z.string().trim().min(1, 'Cargo description is required.'),
  origin: z.string().trim().min(1, 'Origin is required.'),
  destination: z.string().trim().min(1, 'Destination is required.'),
  pickupDate: z.string().optional(),
  requestedDeliveryDate: z.string().optional(),
  approximateWeight: z.string().optional(),
  pieces: z.string().optional(),
  specialHandlingRequirements: z.string().optional(),
  additionalNotes: z.string().optional(),
  consentToContact: z.literal(true, {
    errorMap: () => ({ message: 'You must agree to be contacted regarding this quote request.' }),
  }),
});

type QuoteFormValues = z.infer<typeof quoteSchema>;

export function QuoteForm() {
  const searchParams = useSearchParams();
  const preselect = serviceLabelFromKey(searchParams.get('service'));
  const [serverError, setServerError] = useState<string | null>(null);
  const [referenceNumber, setReferenceNumber] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setFocus,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteSchema),
    defaultValues: { serviceType: preselect ?? '' },
  });

  useEffect(() => {
    // Focus the first invalid field whenever validation fails on submit.
    const firstError = Object.keys(errors)[0] as keyof QuoteFormValues | undefined;
    if (firstError) setFocus(firstError);
  }, [errors, setFocus]);

  if (referenceNumber) {
    return (
      <div role="status" className="relative overflow-hidden bg-paper p-8 shadow-[inset_0_0_0_2px_var(--color-ink)] sm:p-12">
        <p className="label text-mute">Quote request · Received</p>
        <h2 className="t-h2 mt-4">Quote request received.</h2>
        <p className="mt-4 max-w-lg leading-relaxed text-ink/75">{QUOTE_SUCCESS}</p>
        <div className="mt-8 inline-flex flex-col bg-ink px-5 py-4 text-paper">
          <span className="label text-paper/50">Reference number</span>
          <span className="mt-1 font-mono text-2xl tracking-wider text-sign">{referenceNumber}</span>
        </div>
      </div>
    );
  }

  const onSubmit = async (values: QuoteFormValues) => {
    setServerError(null);
    try {
      const res = await submitQuote(values);
      setReferenceNumber(res.referenceNumber);
    } catch (err) {
      if (err instanceof ApiError) {
        setServerError(err.message);
        err.fields.forEach((f) => {
          if (f.field in quoteSchema.shape) {
            setError(f.field as keyof QuoteFormValues, { message: f.message });
          }
        });
      } else {
        setServerError('An unexpected error occurred. Please try again.');
      }
    }
  };

  const e = errors;

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-12">
      <ServerError message={serverError} />

      <FormSection index="01" title="Contact information">
        <div className="waybill grid-cols-1 sm:grid-cols-2">
          <Field id="fullName" label="Full name" ref_="1a" required error={e.fullName?.message}>
            <input className="field-input" autoComplete="name" placeholder="Jane Rivera" {...a11y('fullName', e.fullName?.message)} {...register('fullName')} />
          </Field>
          <Field id="companyName" label="Company name" ref_="1b">
            <input className="field-input" autoComplete="organization" placeholder="Acme Aerospace" id="companyName" {...register('companyName')} />
          </Field>
          <Field id="email" label="Email" ref_="1c" required error={e.email?.message}>
            <input type="email" className="field-input" placeholder="you@company.com" autoComplete="email" {...a11y('email', e.email?.message)} {...register('email')} />
          </Field>
          <Field id="phone" label="Phone" ref_="1d" required error={e.phone?.message}>
            <input type="tel" className="field-input" placeholder="(305) 555-0123" autoComplete="tel" {...a11y('phone', e.phone?.message)} {...register('phone')} />
          </Field>
        </div>
      </FormSection>

      <FormSection index="02" title="Shipment details">
        <div className="waybill grid-cols-1 sm:grid-cols-2">
          <Field id="serviceType" label="Service type" ref_="2a" required error={e.serviceType?.message}>
            <select className="field-input" {...a11y('serviceType', e.serviceType?.message)} {...register('serviceType')}>
              <option value="" disabled>
                Select a service
              </option>
              {SERVICE_OPTIONS.map((opt) => (
                <option key={opt.key} value={opt.label}>
                  {opt.label}
                </option>
              ))}
            </select>
          </Field>
          <Field id="cargoDescription" label="Cargo description" ref_="2b" required error={e.cargoDescription?.message}>
            <input
              className="field-input"
              placeholder="e.g. Landing gear actuator, crated"
              {...a11y('cargoDescription', e.cargoDescription?.message)}
              {...register('cargoDescription')}
            />
          </Field>
          <Field id="origin" label="Origin" ref_="2c" required error={e.origin?.message}>
            <input className="field-input" placeholder="City, State" {...a11y('origin', e.origin?.message)} {...register('origin')} />
          </Field>
          <Field id="destination" label="Destination" ref_="2d" required error={e.destination?.message}>
            <input
              className="field-input"
              placeholder="City, State"
              {...a11y('destination', e.destination?.message)}
              {...register('destination')}
            />
          </Field>
          <Field id="pickupDate" label="Pickup date" ref_="2e">
            <input id="pickupDate" type="date" className="field-input" {...register('pickupDate')} />
          </Field>
          <Field id="requestedDeliveryDate" label="Requested delivery" ref_="2f">
            <input id="requestedDeliveryDate" type="date" className="field-input" {...register('requestedDeliveryDate')} />
          </Field>
          <Field id="approximateWeight" label="Approx. weight" ref_="2g">
            <input id="approximateWeight" className="field-input" placeholder="e.g. 450 lbs" {...register('approximateWeight')} />
          </Field>
          <Field id="pieces" label="Pieces / pallets" ref_="2h">
            <input id="pieces" className="field-input" placeholder="e.g. 2 crates" {...register('pieces')} />
          </Field>
          <Field id="specialHandlingRequirements" label="Special handling requirements" ref_="2i" className="sm:col-span-2">
            <input
              id="specialHandlingRequirements"
              className="field-input"
              placeholder="Fragile, temperature, liftgate, hazmat classification…"
              {...register('specialHandlingRequirements')}
            />
          </Field>
        </div>
      </FormSection>

      <FormSection index="03" title="Anything else">
        <div className="waybill grid-cols-1">
          <Field id="additionalNotes" label="Tell us more about your shipment" ref_="3a">
            <textarea id="additionalNotes" rows={4} className="field-input" placeholder="Deadlines, dimensions, customs paperwork, or anything else we should know…" {...register('additionalNotes')} />
          </Field>
        </div>
      </FormSection>

      <div className="flex flex-col gap-8 border-t-2 border-ink pt-8 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <label htmlFor="consentToContact" className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              className="peer sr-only"
              {...a11y('consentToContact', e.consentToContact?.message)}
              {...register('consentToContact')}
            />
            <span
              aria-hidden="true"
              className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center border-2 border-ink text-transparent peer-checked:bg-ink peer-checked:text-sign peer-focus-visible:shadow-[0_0_0_4px_var(--color-sign)]"
            >
              <svg viewBox="0 0 10 10" className="h-3 w-3">
                <path d="M1.5 5.5 4 8l4.5-6" fill="none" stroke="currentColor" strokeWidth="1.8" />
              </svg>
            </span>
            <span className="max-w-md text-[0.9375rem] leading-snug">
              I agree to be contacted regarding this quote request. <span aria-hidden="true">*</span>
            </span>
          </label>
          {e.consentToContact && (
            <p id="consentToContact-error" role="alert" className="field-error ml-8">
              {e.consentToContact.message}
            </p>
          )}
        </div>

        <button type="submit" className="btn btn-ink min-h-14 px-8 text-base" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting…' : 'Request my quote'}
          <Arrow className="arrow" />
        </button>
      </div>
    </form>
  );
}
