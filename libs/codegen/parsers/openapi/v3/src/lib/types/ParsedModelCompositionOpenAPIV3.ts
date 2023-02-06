import type { ParsedModelOpenAPIV3 } from '.';

export type ParsedModelCompositionTypeOpenAPIV3 = 'oneOf' | 'anyOf' | 'allOf';

export interface ParsedModelCompositionOpenAPIV3 {
  type: ParsedModelCompositionTypeOpenAPIV3;
  imports: string[];
  enums: ParsedModelOpenAPIV3[];
  properties: ParsedModelOpenAPIV3[];
}
