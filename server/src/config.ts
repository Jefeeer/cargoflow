import { config as loadEnv } from 'dotenv';

loadEnv();

function firstOrigin(raw: string | undefined): string {
  return (raw ?? 'http://localhost:5173').split(',')[0]!.trim();
}

export const config = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigin: firstOrigin(process.env.CORS_ORIGIN),
  notifyEmail: process.env.NOTIFY_EMAIL || undefined,
  smtp: {
    host: process.env.SMTP_HOST || undefined,
    port: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined,
    user: process.env.SMTP_USER || undefined,
    pass: process.env.SMTP_PASS || undefined,
  },
} as const;

export const isProduction = config.nodeEnv === 'production';
