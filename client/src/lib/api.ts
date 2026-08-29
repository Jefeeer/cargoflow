import axios, { AxiosError } from 'axios';
import type {
  ApiErrorResponse,
  ContactRequest,
  ContactResponse,
  FieldError,
  HealthResponse,
  QuoteRequest,
  QuoteResponse,
} from './types';

const baseURL = import.meta.env.VITE_API_URL?.trim() || '';

const client = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

/** Normalized error thrown by the API layer so UI can show field-level messages. */
export class ApiError extends Error {
  fields: FieldError[];
  status?: number;
  constructor(message: string, fields: FieldError[] = [], status?: number) {
    super(message);
    this.name = 'ApiError';
    this.fields = fields;
    this.status = status;
  }
}

function toApiError(err: unknown): ApiError {
  const axiosErr = err as AxiosError<ApiErrorResponse>;
  if (axiosErr?.isAxiosError) {
    const data = axiosErr.response?.data;
    if (data && typeof data === 'object' && 'error' in data) {
      return new ApiError(data.error, data.fields ?? [], axiosErr.response?.status);
    }
    if (axiosErr.code === 'ECONNABORTED') {
      return new ApiError('The request timed out. Please try again.');
    }
    if (!axiosErr.response) {
      return new ApiError(
        'Unable to reach the CargoFlow server. Please check your connection and try again.',
      );
    }
    return new ApiError('Something went wrong. Please try again.', [], axiosErr.response?.status);
  }
  return new ApiError('An unexpected error occurred. Please try again.');
}

export async function submitQuote(payload: QuoteRequest): Promise<QuoteResponse> {
  try {
    const { data } = await client.post<QuoteResponse>('/api/quotes', payload);
    return data;
  } catch (err) {
    throw toApiError(err);
  }
}

export async function submitContact(payload: ContactRequest): Promise<ContactResponse> {
  try {
    const { data } = await client.post<ContactResponse>('/api/contact', payload);
    return data;
  } catch (err) {
    throw toApiError(err);
  }
}

export async function getHealth(): Promise<HealthResponse> {
  try {
    const { data } = await client.get<HealthResponse>('/api/health');
    return data;
  } catch (err) {
    throw toApiError(err);
  }
}
