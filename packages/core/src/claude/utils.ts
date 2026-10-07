import { ZodObject, ZodRawShape, ZodType } from "zod";

/**
 * Extract the shape from a ZodObject schema for use with Claude Agents SDK.
 * The Claude SDK tool() function expects a plain object of Zod types,
 * not a wrapped z.object().
 *
 * @param schema - The Zod schema (typically z.object({...}))
 * @returns The shape object { field: z.string(), ... }
 * @throws Error if schema is not a ZodObject
 */
export function extractZodShape<T extends ZodRawShape>(
  schema: ZodType<any>,
): T {
  if (schema instanceof ZodObject) {
    return schema.shape as T;
  }
  throw new Error(
    `Claude Agents SDK requires a ZodObject schema. Received: ${schema.constructor.name}`,
  );
}
