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

export interface ParsedModelOpenAPIV3 extends ParsedSchemaOpenAPIV3 {
  name: string;
  export: ParsedModelExportTypeOpenAPIV3;
  type: string;
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
}
