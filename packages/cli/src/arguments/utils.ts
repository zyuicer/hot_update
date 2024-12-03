import { Schema } from "./types";

export function getSchemaType(
  schema: Schema,
): "string" | "boolean" | "array" | "object" | "number" {
  if ("type" in schema) {
    return schema.type as "string" | "boolean" | "array" | "object" | "number";
  }

  if ("anyOf" in schema) {
    const types = schema.anyOf.map(s => getSchemaType(s));

    if (types.includes("object")) return "object";
    if (types.includes("array")) return "array";
    if (types.includes("string")) return "string";
    if (types.includes("number")) return "number";
    if (types.includes("boolean")) return "boolean";
  }

  return "object";
}

export function flattenSchema(
  schema: Record<string, Schema>,
  base: Record<string, Schema> = {},
  parent: string = "",
) {
  for (const [k, value] of Object.entries(schema)) {
    const key = parent ? `${parent}.${k}` : k;
    if (getSchemaType(value) === "object") {
      if ("properties" in value) {
        flattenSchema(value.properties, base, key);
      } else {
        base[key] = value;
      }
    }
    base[key] = value;
  }

  return base;
}

export function camelCaseToKebabCase(str: string) {
  return str.replace(/[A-Z]/g, match => `-${match.toLowerCase()}`);
}

export function kebabCaseToCamelCase(str: string) {
  return str.replace(/-./g, match => match[1].toUpperCase());
}
