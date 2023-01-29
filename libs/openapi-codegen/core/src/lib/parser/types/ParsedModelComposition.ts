import type { ParsedModel } from './';

export type ParsedModelCompositionType = 'oneOf' | 'anyOf' | 'allOf';

export interface ParsedModelComposition {
  type: ParsedModelCompositionType;
  imports: string[];
  enums: ParsedModel[];
  properties: ParsedModel[];
}
