import type { LiteralUnion } from 'type-fest';

import type {
  ParsedEnumOpenAPIV3,
  ParsedModelCompositionTypeOpenAPIV3,
  ParsedSchemaOpenAPIV3,
} from '.';

export type ParsedModelExportTypeOpenAPIV3 =
  | ParsedModelCompositionTypeOpenAPIV3
  | 'reference'
  | 'generic'
  | 'enum'
  | 'array'
  | 'dictionary'
  | 'interface';

export type ParsedModelOpenAPIV3TypeWithoutGeneric =
  | 'number'
  | 'boolean'
  | 'string'
  | 'binary'
  | 'any';
export type ParsedModelOpenAPIV3Type = LiteralUnion<
  ParsedModelOpenAPIV3TypeWithoutGeneric,
  string
>;

export interface ParsedModelOpenAPIV3 extends ParsedSchemaOpenAPIV3 {
  name: string;
  export: ParsedModelExportTypeOpenAPIV3;
  type: ParsedModelOpenAPIV3Type;
  base: string;
  template: string | null;
  link: ParsedModelOpenAPIV3 | null;
  description?: string;
  deprecated?: boolean;
  default?: string;
  imports: string[];
  enum: ParsedEnumOpenAPIV3[];
  enums: ParsedModelOpenAPIV3[];
  properties: ParsedModelOpenAPIV3[];
  refToParent?: ParsedModelOpenAPIV3;
}
