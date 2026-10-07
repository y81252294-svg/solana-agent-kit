import { ZodObject, ZodRawShape, ZodType } from "zod";

export function transformToZodObject<T extends ZodRawShape>(
  schema: ZodType<any>,
): ZodObject<T> {
  if (schema instanceof ZodObject) {
    return schema as ZodObject<T>;
  }
  throw new Error(
    `The provided schema is not a ZodObject: ${JSON.stringify(schema)}`,
  );
}
