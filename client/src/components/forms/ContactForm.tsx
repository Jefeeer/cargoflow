'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ApiError, submitContact } from '@/lib/api';
import { CONTACT_SUCCESS } from '@/lib/content';
import { Arrow } from '@/components/ui/Arrow';
import { Field, ServerError, a11y } from './Field';

const contactSchema = z.object({
  name: z.string().trim().min(1, 'Name is required.'),
  company: z.string().trim().optional(),
  email: z.string().trim().min(1, 'Email is required.').email('Enter a valid email address.'),
  phone: z.string().trim().optional(),
  subject: z.string().trim().min(1, 'Subject is required.'),
  message: z.string().trim().min(1, 'Message is required.'),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export function ContactForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    setFocus,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({ resolver: zodResolver(contactSchema) });

  useEffect(() => {
    const firstError = Object.keys(errors)[0] as keyof ContactFormValues | undefined;
    if (firstError) setFocus(firstError);
  }, [errors, setFocus]);

  if (submitted) {
    return (
      <div role="status" className="bg-paper p-8 shadow-[inset_0_0_0_2px_var(--color-ink)] sm:p-12">
        <p className="label text-mute">Message · Received</p>
        <h2 className="t-h2 mt-4">Message sent.</h2>
        <p className="mt-4 leading-relaxed text-ink/75">{CONTACT_SUCCESS}</p>
      </div>
    );
  }

  const onSubmit = async (values: ContactFormValues) => {
    setServerError(null);
    try {
      await submitContact(values);
      setSubmitted(true);
    } catch (err) {
      if (err instanceof ApiError) {
        setServerError(err.message);
        err.fields.forEach((f) => {
          if (f.field in contactSchema.shape) {
            setError(f.field as keyof ContactFormValues, { message: f.message });
          }
        });
      } else {
        setServerError('An unexpected error occurred. Please try again.');
      }
    }
  };

  const e = errors;

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-8">
      <ServerError message={serverError} />

      <div className="waybill grid-cols-1 sm:grid-cols-2">
        <Field id="name" label="Name" ref_="01" required error={e.name?.message}>
          <input className="field-input" autoComplete="name" placeholder="Jane Rivera" {...a11y('name', e.name?.message)} {...register('name')} />
        </Field>
        <Field id="company" label="Company" ref_="02">
          <input id="company" className="field-input" placeholder="Acme Aerospace" autoComplete="organization" {...register('company')} />
        </Field>
        <Field id="email" label="Email" ref_="03" required error={e.email?.message}>
          <input type="email" className="field-input" placeholder="you@company.com" autoComplete="email" {...a11y('email', e.email?.message)} {...register('email')} />
        </Field>
        <Field id="phone" label="Phone" ref_="04">
          <input id="phone" type="tel" className="field-input" placeholder="(305) 555-0123" autoComplete="tel" {...register('phone')} />
        </Field>
        <Field id="subject" label="Subject" ref_="05" required error={e.subject?.message} className="sm:col-span-2">
          <input className="field-input" placeholder="What can we help with?" {...a11y('subject', e.subject?.message)} {...register('subject')} />
        </Field>
        <Field id="message" label="Message" ref_="06" required error={e.message?.message} className="sm:col-span-2">
          <textarea rows={6} className="field-input" placeholder="Tell us about your shipment, timeline, or question…" {...a11y('message', e.message?.message)} {...register('message')} />
        </Field>
      </div>

      <button type="submit" className="btn btn-ink min-h-14 w-full px-8 text-base sm:w-auto" disabled={isSubmitting}>
        {isSubmitting ? 'Sending…' : 'Send message'}
        <Arrow className="arrow" />
      </button>
    </form>
  );
}
