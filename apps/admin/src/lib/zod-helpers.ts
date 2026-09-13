import { z } from 'zod';

/**
 * Wraps a numeric schema so an empty string (what a blank number input
 * actually submits) is treated as "not provided" rather than coerced to
 * 0 — z.coerce.number() runs before .optional() can see it, so
 * `z.coerce.number().optional()` alone rejects a blank optional field.
 */
export function optionalNumber<T extends z.ZodTypeAny>(schema: T) {
  return z.preprocess((value) => (value === '' || value === null ? undefined : value), schema.optional());
}
