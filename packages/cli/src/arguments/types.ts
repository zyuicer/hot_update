export interface JsonSchema {
  type: string;
  description?: string;
}

export interface ObjectJsonSchema extends JsonSchema {
  type: "object";
  properties: Record<string, Schema>;
  additionalProperties: boolean;
  required: string[];
}

export interface StringEnumSchema extends JsonSchema {
  type: "enum";
  items: string[];
}

export interface ArraySchema extends JsonSchema {
  type: "array";
  items: Schema;
}

export interface StringConstantSchema extends JsonSchema {
  type: "string";
}

export interface BooleanSchema extends JsonSchema {
  type: "boolean";
}

export interface AnySchema {
  anyOf: (ArraySchema | ObjectJsonSchema | BooleanSchema | StringSchema)[];
  description?: string;
}

export type StringSchema = StringEnumSchema | StringConstantSchema;

export type Schema =
  | StringSchema
  | AnySchema
  | ArraySchema
  | BooleanSchema
  | ObjectJsonSchema
  | JsonSchema;
