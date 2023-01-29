import type { ParsedEnum, ParsedModelCompositionType, ParsedSchema } from './';

export type ParsedModelExportType =
  | ParsedModelCompositionType
  | 'reference'
  | 'generic'
  | 'enum'
  | 'array'
  | 'dictionary'
  | 'interface';

export interface ParsedModel extends ParsedSchema {
  name: string;
  export: ParsedModelExportType;
  type: string;
  base: string;
  template: string | null;
  link: ParsedModel | null;
  description?: string;
  deprecated?: boolean;
  default?: string;
  imports: string[];
  enum: ParsedEnum[];
  enums: ParsedModel[];
  properties: ParsedModel[];
}
