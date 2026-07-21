import { z } from 'zod';

/**
 * Converts a Zod error into the standardized details object.
 * @param error - The ZodError from a failed safeParse call.
 * @returns Flattened error with fieldErrors and formErrors, per z.flattenError output.
 */
export function formatZodError(error: z.ZodError): z.ZodFlattenedError<unknown> {
  return z.flattenError(error);
}
