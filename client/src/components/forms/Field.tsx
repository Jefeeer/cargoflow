import type { ReactNode } from 'react';

interface FieldProps {
  id: string;
  label: string;
  /** Field reference shown top-right, like a numbered box on a waybill. */
  ref_?: string;
  required?: boolean;
  error?: string;
  className?: string;
  children: ReactNode;
}

/** A waybill box: mono caption, borderless input, inline error. Inputs inside use `.field-input`. */
export function Field({ id, label, ref_, required, error, className = '', children }: FieldProps) {
  return (
    <div className={`field ${className}`} data-invalid={error ? 'true' : undefined}>
      <label htmlFor={id} className="field-label">
        <span>
          {label}
          {required && (
            <span aria-hidden="true" className="text-ink">
              {' '}
              *
            </span>
          )}
          {required && <span className="sr-only"> (required)</span>}
        </span>
        {ref_ && <span aria-hidden="true">{ref_}</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} role="alert" className="field-error">
          {error}
        </p>
      )}
    </div>
  );
}

/** Props to spread onto an input so it announces its error state. */
export function a11y(id: string, error?: string) {
  return {
    id,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': error ? `${id}-error` : undefined,
  } as const;
}

export function FormSection({ index, title, children }: { index: string; title: string; children: ReactNode }) {
  return (
    <fieldset>
      <legend className="mb-4 flex w-full items-baseline gap-3 border-b-2 border-ink pb-3">
        <span className="label text-mute">{index}</span>
        <span className="text-xl font-semibold tracking-tight">{title}</span>
      </legend>
      {children}
    </fieldset>
  );
}

export function ServerError({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <p role="alert" className="border-l-4 border-stamp bg-stamp/10 px-4 py-3 text-sm font-medium text-stamp">
      {message}
    </p>
  );
}
