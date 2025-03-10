import type { LiteralUnion } from 'type-fest';

export type ParsedSchemaOpenAPIV3FormatWithoutGeneric =
  | 'int32'
  | 'int64'
  | 'float'
  | 'double'
  | 'string'
  | 'boolean'
  | 'byte'
  | 'binary'
  | 'date'
  | 'date-time'
  | 'password';
export type ParsedSchemaOpenAPIV3Format = LiteralUnion<
  ParsedSchemaOpenAPIV3FormatWithoutGeneric,
  string
>;

export interface ParsedSchemaOpenAPIV3 {
  isRoot: boolean;
  readOnly: boolean;
  required: boolean;
  nullable: boolean;
  format?: ParsedSchemaOpenAPIV3Format;
  maximum?: number;
  exclusiveMaximum?: boolean;
  minimum?: number;
  exclusiveMinimum?: boolean;
  multipleOf?: number;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  maxItems?: number;
  minItems?: number;
  uniqueItems?: boolean;
  maxProperties?: number;
  minProperties?: number;
}
