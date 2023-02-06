import type { ParsedModelOpenAPIV3 } from '.';

export interface ParsedOperationResponseOpenAPIV3 extends ParsedModelOpenAPIV3 {
  in: 'response' | 'header';
  code: number;
}
