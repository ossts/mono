import type { LiteralUnion } from 'type-fest';

export interface ParsedSchemaOpenAPIV3 {
  isRoot: boolean;
  readOnly: boolean;
  required: boolean;
  nullable: boolean;
  format?: LiteralUnion<
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
    | 'password',
    string
  >;
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
