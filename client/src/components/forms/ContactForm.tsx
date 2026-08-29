import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ApiError, submitContact } from '@/lib/api';
import { CONTACT_SUCCESS } from '@/lib/content';

const contactSchema = z.object({
  name: z.string().trim().min(1, 'Name is required.'),
  company: z.string().trim().optional(),
  email: z.string().trim().min(1, 'Email is required.').email('Enter a valid email address.'),
  phone: z.string().trim().optional(),
  subject: z.string().trim().min(1, 'Subject is required.'),
  message: z.string().trim().min(1, 'Message is required.'),
});

type ContactFormValues = z.infer<typeof contactSchema>;

const fieldClass =
  'w-full rounded-lg border border-steel-500/30 bg-ink-900/60 px-4 py-2.5 text-sm text-white placeholder:text-steel-500 focus:border-signal-400';
const labelClass = 'mb-1.5 block text-sm font-medium text-steel-200';
const errorClass = 'mt-1.5 text-sm text-signal-300';

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
      <div className="card text-center" role="status">
        <h3 className="text-2xl">Message Sent</h3>
        <p className="mt-3 text-steel-300">{CONTACT_SUCCESS}</p>
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      {serverError && (
        <p role="alert" className="rounded-lg border border-signal-500/40 bg-signal-500/10 px-4 py-3 text-sm text-signal-200">
          {serverError}
        </p>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={labelClass}>Name *</label>
          <input
            id="name"
            className={fieldClass}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'name-error' : undefined}
            {...register('name')}
          />
          {errors.name && <p id="name-error" role="alert" className={errorClass}>{errors.name.message}</p>}
        </div>
        <div>
          <label htmlFor="company" className={labelClass}>Company</label>
          <input id="company" className={fieldClass} {...register('company')} />
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
          <label htmlFor="phone" className={labelClass}>Phone</label>
          <input id="phone" type="tel" className={fieldClass} {...register('phone')} />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="subject" className={labelClass}>Subject *</label>
          <input
            id="subject"
            className={fieldClass}
            aria-invalid={!!errors.subject}
            aria-describedby={errors.subject ? 'subject-error' : undefined}
            {...register('subject')}
          />
          {errors.subject && <p id="subject-error" role="alert" className={errorClass}>{errors.subject.message}</p>}
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="message" className={labelClass}>Message *</label>
          <textarea
            id="message"
            rows={5}
            className={fieldClass}
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? 'message-error' : undefined}
            {...register('message')}
          />
          {errors.message && <p id="message-error" role="alert" className={errorClass}>{errors.message.message}</p>}
        </div>
      </div>

      <button type="submit" className="btn-primary btn-lg w-full sm:w-auto" disabled={isSubmitting}>
        {isSubmitting ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
}
