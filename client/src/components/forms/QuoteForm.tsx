import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSearchParams } from 'react-router-dom';
import { submitQuote } from '@/lib/api';
import { ApiError } from '@/lib/api';
import { SERVICE_OPTIONS, serviceLabelFromKey } from '@/lib/types';
import { QUOTE_SUCCESS } from '@/lib/content';

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

const fieldClass =
  'w-full rounded-lg border border-steel-500/30 bg-ink-900/60 px-4 py-2.5 text-sm text-white placeholder:text-steel-500 focus:border-signal-400';
const labelClass = 'mb-1.5 block text-sm font-medium text-steel-200';
const errorClass = 'mt-1.5 text-sm text-signal-300';

export function QuoteForm() {
  const [searchParams] = useSearchParams();
  const preselect = serviceLabelFromKey(searchParams.get('service'));
  const [serverError, setServerError] = useState<string | null>(null);
  const [referenceNumber, setReferenceNumber] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

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
      <div className="card text-center" role="status">
        <h3 className="text-2xl">Quote Request Received</h3>
        <p className="mt-3 text-steel-300">{QUOTE_SUCCESS}</p>
        <p className="mt-4 font-mono text-sm text-signal-300">
          Reference number: <span className="font-semibold">{referenceNumber}</span>
        </p>
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

  return (
    <form ref={formRef} onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-10">
      {serverError && (
        <p role="alert" className="rounded-lg border border-signal-500/40 bg-signal-500/10 px-4 py-3 text-sm text-signal-200">
          {serverError}
        </p>
      )}

      <fieldset>
        <legend className="mb-5 font-display text-lg text-white">Contact Information</legend>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="fullName" className={labelClass}>Full Name *</label>
            <input
              id="fullName"
              className={fieldClass}
              aria-invalid={!!errors.fullName}
              aria-describedby={errors.fullName ? 'fullName-error' : undefined}
              {...register('fullName')}
            />
            {errors.fullName && <p id="fullName-error" role="alert" className={errorClass}>{errors.fullName.message}</p>}
          </div>
          <div>
            <label htmlFor="companyName" className={labelClass}>Company Name</label>
            <input id="companyName" className={fieldClass} {...register('companyName')} />
          </div>
          <div>
            <label htmlFor="email" className={labelClass}>Email *</label>
            <input
              id="email"
              type="email"
              className={fieldClass}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'email-error' : undefined}
              {...register('email')}
            />
            {errors.email && <p id="email-error" role="alert" className={errorClass}>{errors.email.message}</p>}
          </div>
          <div>
            <label htmlFor="phone" className={labelClass}>Phone *</label>
            <input
              id="phone"
              type="tel"
              className={fieldClass}
              aria-invalid={!!errors.phone}
              aria-describedby={errors.phone ? 'phone-error' : undefined}
              {...register('phone')}
            />
            {errors.phone && <p id="phone-error" role="alert" className={errorClass}>{errors.phone.message}</p>}
          </div>
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-5 font-display text-lg text-white">Shipment Details</legend>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="serviceType" className={labelClass}>Service Type *</label>
            <select
              id="serviceType"
              className={fieldClass}
              aria-invalid={!!errors.serviceType}
              aria-describedby={errors.serviceType ? 'serviceType-error' : undefined}
              defaultValue={preselect ?? ''}
              {...register('serviceType')}
            >
              <option value="" disabled>
                Select a service
              </option>
              {SERVICE_OPTIONS.map((opt) => (
                <option key={opt.key} value={opt.label}>
                  {opt.label}
                </option>
              ))}
            </select>
            {errors.serviceType && (
              <p id="serviceType-error" role="alert" className={errorClass}>{errors.serviceType.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="cargoDescription" className={labelClass}>Cargo Description *</label>
            <input
              id="cargoDescription"
              className={fieldClass}
              aria-invalid={!!errors.cargoDescription}
              aria-describedby={errors.cargoDescription ? 'cargoDescription-error' : undefined}
              {...register('cargoDescription')}
            />
            {errors.cargoDescription && (
              <p id="cargoDescription-error" role="alert" className={errorClass}>{errors.cargoDescription.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="origin" className={labelClass}>Origin *</label>
            <input
              id="origin"
              className={fieldClass}
              aria-invalid={!!errors.origin}
              aria-describedby={errors.origin ? 'origin-error' : undefined}
              {...register('origin')}
            />
            {errors.origin && <p id="origin-error" role="alert" className={errorClass}>{errors.origin.message}</p>}
          </div>
          <div>
            <label htmlFor="destination" className={labelClass}>Destination *</label>
            <input
              id="destination"
              className={fieldClass}
              aria-invalid={!!errors.destination}
              aria-describedby={errors.destination ? 'destination-error' : undefined}
              {...register('destination')}
            />
            {errors.destination && (
              <p id="destination-error" role="alert" className={errorClass}>{errors.destination.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="pickupDate" className={labelClass}>Pickup Date</label>
            <input id="pickupDate" type="date" className={fieldClass} {...register('pickupDate')} />
          </div>
          <div>
            <label htmlFor="requestedDeliveryDate" className={labelClass}>Requested Delivery Date</label>
            <input id="requestedDeliveryDate" type="date" className={fieldClass} {...register('requestedDeliveryDate')} />
          </div>
          <div>
            <label htmlFor="approximateWeight" className={labelClass}>Approximate Weight</label>
            <input id="approximateWeight" className={fieldClass} placeholder="e.g. 450 lbs" {...register('approximateWeight')} />
          </div>
          <div>
            <label htmlFor="pieces" className={labelClass}>Number of Pieces / Pallets</label>
            <input id="pieces" className={fieldClass} {...register('pieces')} />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="specialHandlingRequirements" className={labelClass}>Special Handling Requirements</label>
            <input id="specialHandlingRequirements" className={fieldClass} {...register('specialHandlingRequirements')} />
          </div>
        </div>
      </fieldset>

      <div>
        <label htmlFor="additionalNotes" className={labelClass}>Tell Us More About Your Shipment</label>
        <textarea id="additionalNotes" rows={4} className={fieldClass} {...register('additionalNotes')} />
      </div>

      <div>
        <div className="flex items-start gap-3">
          <input
            id="consentToContact"
            type="checkbox"
            className="mt-1 h-4 w-4 rounded border-steel-500/40 bg-ink-900 text-signal-500 focus:ring-signal-400"
            aria-invalid={!!errors.consentToContact}
            aria-describedby={errors.consentToContact ? 'consent-error' : undefined}
            {...register('consentToContact')}
          />
          <label htmlFor="consentToContact" className="text-sm text-steel-300">
            I agree to be contacted regarding this quote request. *
          </label>
        </div>
        {errors.consentToContact && (
          <p id="consent-error" role="alert" className={errorClass}>{errors.consentToContact.message}</p>
        )}
      </div>

      <button type="submit" className="btn-primary btn-lg w-full sm:w-auto" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Request My Quote'}
      </button>
    </form>
  );
}
