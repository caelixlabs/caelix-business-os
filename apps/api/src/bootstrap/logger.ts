import { LogLevel } from '@nestjs/common';

/**
 * Log levels enabled per environment. Verbose/debug are noisy in
 * production; keep them for local development only.
 */
export function resolveLogLevels(): LogLevel[] {
  const isProduction = process.env.NODE_ENV === 'production';

  return isProduction
    ? ['log', 'warn', 'error']
    : ['log', 'warn', 'error', 'debug', 'verbose'];
}
