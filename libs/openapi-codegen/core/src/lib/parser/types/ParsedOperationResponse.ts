import type { ParsedModel } from './';

export interface ParsedOperationResponse extends ParsedModel {
  in: 'response' | 'header';
  code: number;
}
